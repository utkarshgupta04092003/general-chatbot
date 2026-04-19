import { auth } from "@/lib/auth";
import { TEXT_EMBEDDING_3_SMALL } from "@/lib/config";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { getAIClient, getDomain } from "@/lib/utils";
import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { NextResponse } from "next/server";

// Initialize Pinecone client
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

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
      return NextResponse.json(
        { error: "chatbotId and pages required" },
        { status: 400 },
      );
    }

    // Verify chatbot belongs to user
    const chatbot = await prisma.chatbot.findFirst({
      where: { id: chatbotId, userId: session.user.id },
    });
    if (!chatbot) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });
    }

    const index = pc.index(process.env.PINECONE_INDEX || "general-chatbot");

    // Collect all chunks across all pages into a single list for this chatbot
    const allChunks: { id: string; text: string; url: string }[] = [];

    for (const page of pages) {
      if (!page.content || page.status === "failed") continue;

      // Create/update data source
      await prisma.dataSource.upsert({
        where: {
          chatbotId_url: {
            chatbotId,
            url: page.url,
          },
        },
        create: {
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
      pageChunks.forEach((chunk, i) => {
        const chunkId = `${Buffer.from(page.url).toString("base64url")}-${i}`;
        allChunks.push({ id: chunkId, text: chunk, url: page.url });
      });
    }

    // Process all chunks under the chatbotId namespace
    const client = getAIClient(TEXT_EMBEDDING_3_SMALL);
    const totalChunks = allChunks.length;
    const batchSize = 20;

    for (let i = 0; i < allChunks.length; i += batchSize) {
      const batch = allChunks.slice(i, i + batchSize);
      const input = batch.map((c) => c.text);

      const response = await client.embeddings.create({
        model: TEXT_EMBEDDING_3_SMALL,
        input,
      });

      const vectors: PineconeRecord[] = batch.map((chunk, idx) => ({
        id: chunk.id,
        values: response.data[idx].embedding,
        metadata: {
          chatbotId: String(chatbotId),
          text: chunk.text,
          url: chunk.url,
          domain: getDomain(chunk.url),
        },
      }));

      // Upsert to Pinecone using chatbotId as the namespace
      await index.namespace(chatbotId).upsert({ records: vectors });
    }

    // Update chatbot status to ready
    await prisma.chatbot.update({
      where: { id: chatbotId },
      data: { status: "ready" },
    });

    return NextResponse.json({
      success: true,
      chunksGenerated: totalChunks,
      pagesIndexed: pages.filter(
        (p: { status: string }) => p.status !== "failed",
      ).length,
    });
  } catch (err: unknown) {
    logger.error("Embedding error:", err);
    const message = err instanceof Error ? err.message : "Embedding failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
