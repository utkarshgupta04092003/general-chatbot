import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// In-memory mock vector store (per chatbot session)
const mockVectorStore = new Map<string, { text: string; url: string }[]>();

function chunkText(text: string, chunkSize = 500, overlap = 50): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(" ");
    if (chunk.trim()) chunks.push(chunk);
  }
  return chunks;
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatbotId, pages } = await req.json();

    if (!chatbotId || !pages) {
      return NextResponse.json({ error: "chatbotId and pages required" }, { status: 400 });
    }

    // Verify chatbot belongs to user
    const chatbot = await prisma.chatbot.findFirst({
      where: { id: chatbotId, userId: session.user.id },
    });
    if (!chatbot) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });
    }

    const chunks: { text: string; url: string }[] = [];

    for (const page of pages) {
      if (!page.content || page.status === "failed") continue;

      // Create/update data source
      await prisma.dataSource.upsert({
        where: { id: page.url },
        create: {
          id: page.url,
          chatbotId,
          url: page.url,
          title: page.title,
          content: page.content.slice(0, 10000),
          wordCount: page.wordCount,
          status: "indexed",
        },
        update: {
          title: page.title,
          content: page.content.slice(0, 10000),
          wordCount: page.wordCount,
          status: "indexed",
        },
      });

      // Chunk the content
      const pageChunks = chunkText(page.content);
      pageChunks.forEach((chunk) => chunks.push({ text: chunk, url: page.url }));
    }

    // Store in mock vector store (in real app: generate embeddings + store in Pinecone)
    if (process.env.OPENAI_API_KEY && process.env.PINECONE_API_KEY) {
      // Real embedding pipeline would go here
      console.log("Would generate real embeddings for", chunks.length, "chunks");
    }

    mockVectorStore.set(chatbotId, chunks);

    // Update chatbot status to ready
    await prisma.chatbot.update({
      where: { id: chatbotId },
      data: { status: "ready" },
    });

    return NextResponse.json({
      success: true,
      chunksGenerated: chunks.length,
      pagesIndexed: pages.filter((p: { status: string }) => p.status !== "failed").length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Embedding failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Export for use in chat route
export { mockVectorStore };
