import { NextResponse } from "next/server";

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

export async function POST(req: Request) {
  try {
    const { urls } = await req.json();
    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json({ error: "urls array required" }, { status: 400 });
    }

    const results = await Promise.allSettled(
      urls.map(async (url: string) => {
        const response = await fetch(url, {
          headers: { "User-Agent": "ChatBase-Bot/1.0", Accept: "text/html" },
          signal: AbortSignal.timeout(8000),
        });

        const html = await response.text();
        const text = cleanText(html);
        const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? url;
        const wordCount = text.split(/\s+/).filter(Boolean).length;

        return { url, title, content: text, wordCount, status: "success" };
      })
    );

    const pages = results.map((result, i) => {
      if (result.status === "fulfilled") return result.value;
      return { url: urls[i], title: urls[i], content: "", wordCount: 0, status: "failed" };
    });

    const totalWords = pages.reduce((acc, p) => acc + p.wordCount, 0);
    const totalTokens = Math.ceil(totalWords * 1.3);

    return NextResponse.json({ pages, totalWords, totalTokens });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Scrape failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
