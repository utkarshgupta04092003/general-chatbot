import { auth } from "@/lib/auth";
import { TEXT_EMBEDDING_3_SMALL } from "@/lib/config";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { fetchWithFallback } from "@/lib/scraper";
import { getAIClient, getDomain } from "@/lib/utils";
import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { NextResponse } from "next/server";

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

function cleanText(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function chunkText(text: string, chunkSize = 500, overlap = 50): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(" ");
    if (chunk.trim()) chunks.push(chunk);
  }
  return chunks;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { previewOnly } = await req.json();
    // Fetch data source and verify ownership via chatbot
    const dataSource = await prisma.dataSource.findFirst({
      where: {
        id,
        chatbot: {
          userId: session.user.id,
        },
      },
      include: {
        chatbot: true,
      },
    });

    if (!dataSource) {
      return NextResponse.json(
        { error: "Data source not found" },
        { status: 404 },
      );
    }

    // 1. Refetch content (Scrape)
    const response = await fetchWithFallback(dataSource.url, {
      headers: { Accept: "text/html" },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${dataSource.url}: ${response.status}`);
    }

    const html = await response.text();
    const text = cleanText(html);
    const title =
      html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ??
      dataSource.url;

    if (previewOnly) {
      return NextResponse.json({
        url: dataSource.url,
        title,
        content: text,
        oldContent: dataSource.content,
      });
    }

    // 2. Perform Full Resync (Pinecone + Prisma)
    const index = pc.index(process.env.PINECONE_INDEX || "general-chatbot");
    const domain = getDomain(dataSource.url);

    // Delete old vectors (Using metadata filter)
    // Note: Pinecone doesn't support deleting by metadata directly in all index types,
    // but we use URL-based deterministic IDs as seen in embed/route.ts
    // ID pattern: base64(url)-index
    // We'll delete a range to be safe or delete by prefix if supported.
    // Actually, in embed/route.ts, it uses: `${Buffer.from(page.url).toString('base64url')}-${index}`
    // We can delete up to some reasonable limit or delete by metadata 'url'.

    // For now, we'll use the ID prefix to delete
    const idPrefix = Buffer.from(dataSource.url).toString("base64url");

    // Pinecone delete with metadata filter
    await index.namespace(domain).deleteMany({
      filter: {
        url: { $eq: dataSource.url },
        chatbotId: { $eq: String(dataSource.chatbotId) },
      },
    });

    // Generate new embeddings
    const chunks = chunkText(text);
    const aiClient = getAIClient(TEXT_EMBEDDING_3_SMALL);
    const batchSize = 20;

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      const embeddingRes = await aiClient.embeddings.create({
        model: TEXT_EMBEDDING_3_SMALL,
        input: batch,
      });

      const vectors: PineconeRecord[] = batch.map((chunk, idx) => ({
        id: `${idPrefix}-resync-${Date.now()}-${i + idx}`,
        values: embeddingRes.data[idx].embedding,
        metadata: {
          chatbotId: String(dataSource.chatbotId),
          text: chunk,
          url: dataSource.url,
        },
      }));

      await index.namespace(domain).upsert({ records: vectors });
    }

    // Update Prisma
    await prisma.dataSource.update({
      where: { id },
      data: {
        content: text.slice(0, 10000),
        title,
        wordCount: text.split(/\s+/).filter(Boolean).length,
        status: "indexed",
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    logger.error("Resync error:", err);
    const message = err instanceof Error ? err.message : "Resync failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
