import {
  ANALYTICS_EVENTS,
  CHAT_ROLES,
  ERROR_MESSAGE,
  GPT_5_2,
  GPT_5_MINI,
  MIN_CONFIDENCE_THRESHOLD,
  TEXT_EMBEDDING_3_SMALL,
} from "@/lib/config";
import PostHogClient from "@/lib/posthog";
import { prisma } from "@/lib/prisma";
import { ensureAbsoluteUrl, getAIClient, getDomain } from "@/lib/utils";
import { Pinecone } from "@pinecone-database/pinecone";
import { NextResponse } from "next/server";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

// Initialize Pinecone client
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const AnalyticsSchema = z.object({
  category: z.enum(["pricing", "product", "support", "other"]),
  unanswered: z.boolean(),
  confidence: z.number().min(0).max(1),
});

async function getChatAnalytics(message: string, aiResponse: string) {
  try {
    const catClient = getAIClient(GPT_5_MINI);
    const catRes = await catClient.chat.completions.create({
      model: GPT_5_MINI,
      messages: [
        {
          role: CHAT_ROLES.SYSTEM,
          content:
            "Analyze the conversation. Categorize the user intent and determine if the assistant failed to find an answer (unanswered: true).",
        },
        {
          role: CHAT_ROLES.USER,
          content: `User Question: ${message}\nAI Response: ${aiResponse}`,
        },
      ],
      response_format: zodResponseFormat(AnalyticsSchema, "analytics"),
    });

    const parsed = JSON.parse(catRes.choices[0].message.content || "{}");
    return {
      category: parsed.category || "other",
      unanswered: !!parsed.unanswered,
      confidence:
        typeof parsed.confidence === "number" ? parsed.confidence : 0.9,
    };
  } catch (err) {
    console.error("Structured Analytics Error:", err);
    return { category: "other", unanswered: false, confidence: 0.9 };
  }
}

export async function POST(req: Request) {
  const posthog = PostHogClient();
  try {
    const { chatbotId, message, sessionId } = await req.json();

    if (!chatbotId || !message) {
      return NextResponse.json(
        { error: "chatbotId and message required" },
        { status: 400 },
      );
    }

    // Identify user/session for tracking
    const distinctId = sessionId || `anon-${chatbotId}`;

    // Track message sent
    posthog.capture({
      distinctId,
      event: ANALYTICS_EVENTS.MESSAGE_SENT_TO_BOT,
      properties: {
        chatbotId,
        messageLength: message.length,
      },
    });

    // Get chatbot config
    const chatbot = await prisma.chatbot.findFirst({
      where: { id: chatbotId, deleted: false },
      include: { dataSources: { where: { deleted: false }, take: 5 } },
    });

    if (!chatbot) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });
    }

    // Get or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: { chatbotId, sessionId: sessionId ?? "", deleted: false },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { chatbotId, sessionId: sessionId ?? "" },
      });
    }

    // Save user message
    const userMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: CHAT_ROLES.USER,
        content: message,
      },
    });

    // Generate embedding for the user message
    const embeddingClient = getAIClient(TEXT_EMBEDDING_3_SMALL);
    const embeddingResponse = await embeddingClient.embeddings.create({
      model: TEXT_EMBEDDING_3_SMALL,
      input: message,
    });
    const queryEmbedding = embeddingResponse.data[0].embedding;

    // Retrieve relevant chunks from Pinecone
    const index = pc.index(process.env.PINECONE_INDEX || "general-chatbot");

    // Determine namespace from the first data source's URL
    const domain = chatbot.dataSources[0]
      ? getDomain(chatbot.dataSources[0].url)
      : "default";

    const queryResults = await index.namespace(domain).query({
      vector: queryEmbedding,
      topK: 5,
      filter: { chatbotId: { $eq: chatbotId } },
      includeMetadata: true,
    });

    const relevantChunks = queryResults.matches
      .map((match) => match.metadata?.text as string)
      .filter(Boolean);

    // Generate response using real AI Client
    const client = getAIClient(GPT_5_2);

    let context = relevantChunks.join("\n\n");
    if (context.length === 0 && chatbot.dataSources.length > 0) {
      context = chatbot.dataSources.map((ds) => ds.content).join("\n\n");
    }

    const systemMessage = `
      ${chatbot.systemPrompt || "You are a helpful AI assistant."}
      
      TONE: ${chatbot.tone || "professional"}
      
      INSTRUCTIONS:
      1. Answer the user's question directly and concisely using the provided context.
      2. DO NOT mention "the provided context", "the document", or "the text" in your response. Act as if you naturally know this information.
      3. If the answer is not in the context, politely say you don't have enough information to answer that specific question.
      4. Avoid repetitive language and maintain a tone that matches the persona above.
      5. Write in a natural, human-like way. Avoid using em dashes or overly formal punctuation. Keep the response conversational and easy to read.
      
      Context:
      ${context}
    `;

    // Fetch last 6 messages for context (excluding the current user message)
    const history = await prisma.message.findMany({
      where: {
        conversationId: conversation.id,
        id: { not: userMessage.id },
        deleted: false,
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    });

    const contextMessages = history.reverse().map((msg) => ({
      role: msg.role as "user" | "assistant",
      content:
        msg.role === CHAT_ROLES.ASSISTANT
          ? msg.content
              .replace(/\n\n\*\*Still need help\?\*\*[\s\S]*$/, "")
              .replace(/\n\n\*\*Sources:\*\*[\s\S]*$/, "")
              .trim()
          : msg.content,
    }));

    const aiResponse = await client.chat.completions.create({
      model: GPT_5_2,
      messages: [
        { role: CHAT_ROLES.SYSTEM, content: systemMessage },
        ...contextMessages,
        { role: CHAT_ROLES.USER, content: message },
      ],
    });

    const response = aiResponse.choices[0].message.content || ERROR_MESSAGE;

    // Extract unique source URLs
    const sources = Array.from(
      new Set(
        queryResults.matches.map((match) => match.metadata?.url as string),
      ),
    ).filter(Boolean);

    let finalResponse = response;
    if (sources.length > 0) {
      finalResponse += `\n\n**Sources:**\n${sources.map((url) => `- [${url}](${url})`).join("\n")}`;
    }

    // Higher Accuracy Analytics: Categorize and detect 'unanswered' using structured output
    const analytics = await getChatAnalytics(message, response);
    if (
      analytics.unanswered ||
      analytics.confidence < MIN_CONFIDENCE_THRESHOLD
    ) {
      const contactLinks = [];
      if (chatbot.supportEmail) {
        contactLinks.push(
          `Email: [${chatbot.supportEmail}](mailto:${chatbot.supportEmail})`,
        );
      }
      if (chatbot.supportPhone) {
        const cleanPhone = chatbot.supportPhone.replace(/[^0-9+]/g, "");
        contactLinks.push(
          `Phone: [${chatbot.supportPhone}](tel:${cleanPhone})`,
        );
      }
      if (chatbot.supportWhatsapp) {
        // Ensure whatsapp numbers have no spaces/symbols
        const cleanWa = chatbot.supportWhatsapp.replace(/[^0-9]/g, "");
        contactLinks.push(
          `WhatsApp: [${chatbot.supportWhatsapp}](https://wa.me/${cleanWa})`,
        );
      }
      if (chatbot.contactPageLink) {
        const absoluteUrl = ensureAbsoluteUrl(chatbot.contactPageLink);
        contactLinks.push(`Contact Page: [Link](${absoluteUrl})`);
      }
      if (contactLinks.length > 0) {
        finalResponse += `\n\n**Still need help?** You can reach our support team here:\n${contactLinks.map((l) => `- ${l}`).join("\n")}`;
      }
    }

    // Track response received
    posthog.capture({
      distinctId,
      event: ANALYTICS_EVENTS.BOT_RESPONSE_RECEIVED,
      properties: {
        chatbotId,
        category: analytics.category,
        unanswered: analytics.unanswered,
        confidence: analytics.confidence,
        messageLength: finalResponse.length,
      },
    });

    // Save user message category (specifically for this message ID)
    await prisma.message.update({
      where: { id: userMessage.id },
      data: { category: analytics.category },
    });

    // Save assistant message
    const assistantMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: CHAT_ROLES.ASSISTANT,
        content: finalResponse,
        unanswered: analytics.unanswered,
        confidence: analytics.confidence,
        sourceUrls: sources,
      },
    });

    // Update query count
    await prisma.chatbot.update({
      where: { id: chatbotId, deleted: false },
      data: { totalQueries: { increment: 1 } },
    });

    return NextResponse.json({
      response: finalResponse,
      conversationId: conversation.id,
      messageId: assistantMessage.id,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Chat failed";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    // Ensure all events are sent before the request finishes in serverless environments
    await posthog.shutdown();
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const chatbotId = searchParams.get("chatbotId");
    const sessionId = searchParams.get("sessionId");

    if (!chatbotId || !sessionId) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 },
      );
    }

    const conversation = await prisma.conversation.findFirst({
      where: { chatbotId, sessionId, deleted: false },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          select: { id: true, role: true, content: true, feedback: true },
        },
      },
    });

    return NextResponse.json({ messages: conversation?.messages || [] });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch history";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
