import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Import the mock vector store
import { mockVectorStore } from "@/app/api/embed/route";

function findRelevantChunks(query: string, chunks: { text: string; url: string }[], topK = 5): string[] {
  // Simple keyword-based retrieval (mock BM25)
  const queryWords = query.toLowerCase().split(/\s+/);
  const scored = chunks.map((chunk) => {
    const text = chunk.text.toLowerCase();
    const score = queryWords.reduce((acc, word) => {
      const matches = (text.match(new RegExp(word, "g")) || []).length;
      return acc + matches;
    }, 0);
    return { ...chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map((c) => c.text);
}

function generateMockResponse(query: string, context: string[]): string {
  if (context.length === 0 || context.every((c) => c.trim() === "")) {
    return "I don't have enough information from the indexed pages to answer that question. Please make sure the relevant pages have been indexed, or try rephrasing your question.";
  }

  const combinedContext = context.join("\n\n");
  const queryLower = query.toLowerCase();

  // Extract relevant sentences
  const sentences = combinedContext.match(/[^.!?]+[.!?]+/g) || [];
  const relevant = sentences.filter((s) => {
    const sLower = s.toLowerCase();
    return queryLower.split(/\s+/).some((word) => word.length > 3 && sLower.includes(word));
  });

  if (relevant.length > 0) {
    return relevant.slice(0, 4).join(" ").trim();
  }

  return `Based on the indexed content, here's what I found:\n\n${combinedContext.slice(0, 400)}...`;
}

export async function POST(req: Request) {
  try {
    const { chatbotId, message, sessionId } = await req.json();

    if (!chatbotId || !message) {
      return NextResponse.json({ error: "chatbotId and message required" }, { status: 400 });
    }

    // Get chatbot config
    const chatbot = await prisma.chatbot.findUnique({
      where: { id: chatbotId },
      include: { dataSources: { take: 5 } },
    });

    if (!chatbot) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });
    }

    // Get or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: { chatbotId, sessionId: sessionId ?? "" },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { chatbotId, sessionId: sessionId ?? "" },
      });
    }

    // Save user message
    await prisma.message.create({
      data: { conversationId: conversation.id, role: "user", content: message },
    });

    // Retrieve relevant chunks
    const chunks = mockVectorStore.get(chatbotId) ?? [];
    const relevantChunks = findRelevantChunks(message, chunks);

    // Generate response
    let response: string;
    if (process.env.OPENAI_API_KEY && chunks.length > 0) {
      // Real OpenAI call would go here
      response = generateMockResponse(message, relevantChunks);
    } else if (chunks.length > 0) {
      response = generateMockResponse(message, relevantChunks);
    } else {
      // Fall back to data sources content
      const fallbackContent = chatbot.dataSources.map((ds) => ds.content).join("\n\n");
      response = generateMockResponse(message, [fallbackContent]);
    }

    // Override with system prompt context
    if (chatbot.systemPrompt && chunks.length === 0) {
      response = "I'm your AI assistant. The chatbot is still being trained on your content. Please check back soon or add some data sources from your dashboard.";
    }

    // Save assistant message
    await prisma.message.create({
      data: { conversationId: conversation.id, role: "assistant", content: response },
    });

    // Update query count
    await prisma.chatbot.update({
      where: { id: chatbotId },
      data: { totalQueries: { increment: 1 } },
    });

    return NextResponse.json({ response, conversationId: conversation.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Chat failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
