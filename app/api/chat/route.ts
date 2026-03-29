import { CHAT_ROLES, GPT_5_2, TEXT_EMBEDDING_3_SMALL } from "@/lib/config";
import { prisma } from "@/lib/prisma";
import { getAIClient, getDomain } from "@/lib/utils";
import { Pinecone } from "@pinecone-database/pinecone";
import { NextResponse } from "next/server";

// Initialize Pinecone client
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { chatbotId, message, sessionId } = await req.json();

    if (!chatbotId || !message) {
      return NextResponse.json(
        { error: "chatbotId and message required" },
        { status: 400 },
      );
    }

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
    await prisma.message.create({
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
      
      INSTRUCTIONS:
      1. Answer the user's question directly and concisely using the provided context.
      2. DO NOT mention "the provided context", "the document", or "the text" in your response. Act as if you naturally know this information.
      3. If the answer is not in the context, politely say you don't have enough information to answer that specific question.
      4. Maintain a professional and helpful tone.
      
      Context:
      ${context}
    `;

    const aiResponse = await client.chat.completions.create({
      model: GPT_5_2,
      messages: [
        { role: "system", content: systemMessage },
        { role: CHAT_ROLES.USER, content: message },
      ],
    });

    const response =
      aiResponse.choices[0].message.content ||
      "I'm sorry, I couldn't generate a response.";

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

    // Save assistant message
    const assistantMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: CHAT_ROLES.ASSISTANT,
        content: finalResponse,
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
