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

function extractLinks(html: string, baseUrl: string): string[] {
  const urlObj = new URL(baseUrl);
  const base = `${urlObj.protocol}//${urlObj.host}`;
  const links = new Set<string>();

  const hrefRegex = /href="([^"]+)"/gi;
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    const href = match[1];
    try {
      let fullUrl: string;
      if (href.startsWith("http")) {
        fullUrl = href;
      } else if (href.startsWith("/")) {
        fullUrl = base + href;
      } else if (!href.startsWith("#") && !href.startsWith("mailto:") && !href.startsWith("tel:")) {
        fullUrl = base + "/" + href;
      } else {
        continue;
      }

      const parsed = new URL(fullUrl);
      if (parsed.host === urlObj.host && !parsed.pathname.match(/\.(pdf|png|jpg|jpeg|gif|svg|zip|css|js|ico)$/i)) {
        links.add(`${parsed.protocol}//${parsed.host}${parsed.pathname}`);
      }
    } catch {
      // ignore invalid URLs
    }
  }

  return Array.from(links).slice(0, 10);
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

    let targetUrl = url;
    if (!targetUrl.startsWith("http")) targetUrl = "https://" + targetUrl;

    // Validate URL
    try { new URL(targetUrl); } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    // Fetch the homepage
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "ChatBase-Bot/1.0 (https://chatbase.ai/bot)",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch URL: ${response.status}` }, { status: 400 });
    }

    const html = await response.text();
    const links = extractLinks(html, targetUrl);
    const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? targetUrl;
    const cleanContent = cleanText(html);
    const wordCount = cleanContent.split(/\s+/).length;

    // Always include the root URL
    const allUrls = [targetUrl, ...links.filter((l) => l !== targetUrl)].slice(0, 10);

    return NextResponse.json({
      urls: allUrls,
      rootTitle: title,
      preview: cleanContent.slice(0, 500),
      wordCount,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to crawl";
    if (message.includes("fetch")) {
      return NextResponse.json({ error: "Could not reach the website. Please check the URL and try again." }, { status: 400 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
