import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDomain } from "@/lib/utils";
import { fetchWithFallback, extractLogo } from "@/lib/scraper";
import { load } from "cheerio";
import { NextResponse } from "next/server";

const CRAWL_CONFIG = {
  MAX_DISCOVERED_LEVEL1: 25,
  MAX_RETURNED_URLS: 20,
  BFS_DEPTH_LIMIT: 5,
  BFS_THRESHOLD: 20,
  TIMEOUT_HOMEPAGE: 10000,
  TIMEOUT_GENERAL: 5000,
  PREVIEW_LENGTH: 500,
};

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
  const $ = load(html);
  const links = new Set<string>();

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;

    try {
      let fullUrl: string;
      if (href.startsWith("http")) {
        fullUrl = href;
      } else if (href.startsWith("/")) {
        fullUrl = base + href;
      } else if (
        !href.startsWith("#") &&
        !href.startsWith("mailto:") &&
        !href.startsWith("tel:")
      ) {
        fullUrl = base + "/" + href;
      } else {
        return;
      }

      const parsed = new URL(fullUrl);
      if (
        parsed.host === urlObj.host &&
        !parsed.pathname.match(/\.(pdf|png|jpg|jpeg|gif|svg|zip|css|js|ico)$/i)
      ) {
        // Normalize URL by removing trailing slash and fragments
        const normalized = `${parsed.protocol}//${parsed.host}${parsed.pathname.replace(/\/$/, "")}`;
        links.add(normalized);
      }
    } catch {
      // ignore invalid URLs
    }
  });

  return Array.from(links);
}

async function fetchSitemap(baseUrl: string): Promise<string[]> {
  const allUrls = new Set<string>();
  const seenSitemaps = new Set<string>();

  async function processSitemap(sitemapUrl: string) {
    if (seenSitemaps.has(sitemapUrl)) return;
    seenSitemaps.add(sitemapUrl);

    try {
      const res = await fetchWithFallback(sitemapUrl, {
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) return;
      const xml = await res.text();

      // Check for nested sitemaps (sitemap index)
      const sitemapRefs =
        xml.match(/<sitemap>[\s\S]*?<loc>(https?:\/\/[^<]+)<\/loc>/gi) || [];
      if (sitemapRefs.length > 0) {
        for (const ref of sitemapRefs) {
          const nestedUrl = ref.match(/<loc>(https?:\/\/[^<]+)<\/loc>/i)?.[1];
          if (nestedUrl) await processSitemap(nestedUrl);
        }
      }

      // Extract URLs from this sitemap
      const locs =
        xml.match(/<url>[\s\S]*?<loc>(https?:\/\/[^<]+)<\/loc>/gi) || [];
      locs.forEach((l) => {
        const url = l.match(/<loc>(https?:\/\/[^<]+)<\/loc>/i)?.[1];
        if (url) allUrls.add(url.trim().replace(/\/$/, ""));
      });
    } catch (e) {
      console.error(`Error processing sitemap ${sitemapUrl}`, e);
    }
  }

  const urlObj = new URL(baseUrl);
  const initialSitemap = `${urlObj.protocol}//${urlObj.host}/sitemap.xml`;
  await processSitemap(initialSitemap);

  return Array.from(allUrls);
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { url, chatbotId } = body;

    if (!url)
      return NextResponse.json({ error: "URL is required" }, { status: 400 });

    let targetUrl = url;
    if (!targetUrl.startsWith("http")) targetUrl = "https://" + targetUrl;

    // Validate URL
    let domain = "";
    try {
      const urlObj = new URL(targetUrl);
      domain = urlObj.hostname.replace(/^www\./, "");
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 },
      );
    }

    // Check verification
    const verifiedDomain = await prisma.verifiedDomain.findFirst({
      where: {
        userId: session.user.id,
        domain,
        deleted: false,
      },
    });

    if (!verifiedDomain || !verifiedDomain.verified) {
      return NextResponse.json(
        {
          error: `Domain ${domain} is not verified. Please verify ownership first.`,
        },
        { status: 403 },
      );
    }

    // URL Discovery Logic
    const discoveredUrls = new Set<string>([targetUrl]);
    let rootTitle = "";
    let rootCleanContent = "";
    let rootWordCount = 0;
    let websiteLogo: string | null = null;

    // 1. Fetch Homepage to get initial links and title
    try {
      const response = await fetchWithFallback(targetUrl, {
        headers: {
          Accept: "text/html",
        },
        signal: AbortSignal.timeout(CRAWL_CONFIG.TIMEOUT_HOMEPAGE),
      });

      // Extract logo in background
      websiteLogo = await extractLogo(targetUrl);

      if (response.ok) {
        const html = await response.text();
        rootTitle =
          html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? targetUrl;
        rootCleanContent = cleanText(html);
        rootWordCount = rootCleanContent.split(/\s+/).length;

        const homeLinks = extractLinks(html, targetUrl);
        homeLinks.forEach((l) => discoveredUrls.add(l));
      } else {
        console.error(
          `Home fetch failed for ${targetUrl} with status ${response.status}`,
        );
      }
    } catch (e) {
      console.error("Home fetch failed", e);
    }

    // 2. Try Sitemap (handle indexes recursively)
    const sitemapLinks = await fetchSitemap(targetUrl);
    sitemapLinks.forEach((l) => discoveredUrls.add(l));

    // 3. Limited BFS for more depth (only if we have fewer than limit)
    if (discoveredUrls.size < CRAWL_CONFIG.BFS_THRESHOLD) {
      const toCrawl = Array.from(discoveredUrls).slice(
        1,
        CRAWL_CONFIG.BFS_DEPTH_LIMIT,
      );
      for (const nextUrl of toCrawl) {
        if (discoveredUrls.size >= CRAWL_CONFIG.MAX_DISCOVERED_LEVEL1) break;
        try {
          const res = await fetchWithFallback(nextUrl, {
            headers: {
              Accept: "text/html",
            },
            signal: AbortSignal.timeout(CRAWL_CONFIG.TIMEOUT_GENERAL),
          });
          if (res.ok) {
            const html = await res.text();
            const deepLinks = extractLinks(html, nextUrl);
            deepLinks.forEach((l) => {
              if (discoveredUrls.size < CRAWL_CONFIG.MAX_DISCOVERED_LEVEL1)
                discoveredUrls.add(l);
            });
          }
        } catch {
          continue;
        }
      }
    }

    const allUrls = Array.from(discoveredUrls).slice(
      0,
      CRAWL_CONFIG.MAX_RETURNED_URLS,
    );

    // 4. Persistence if chatbotId is provided
    if (chatbotId) {
      try {
        await Promise.allSettled(
          allUrls.map((url) =>
            prisma.dataSource.upsert({
              where: { chatbotId_url: { chatbotId, url } },
              update: { deleted: false },
              create: { chatbotId, url, status: "pending", deleted: false },
            }),
          ),
        );
      } catch (dbErr) {
        console.error("Failed to persist discovered links", dbErr);
      }

      // Update chatbot website logo if missing
      if (websiteLogo) {
        try {
          await prisma.chatbot.update({
            where: { id: chatbotId },
            data: { websiteLogo },
          });
        } catch (logoErr) {
          console.error("Failed to update chatbot logo", logoErr);
        }
      }
    }

    return NextResponse.json({
      urls: allUrls,
      rootTitle: rootTitle || getDomain(targetUrl) || targetUrl,
      preview: rootCleanContent.slice(0, CRAWL_CONFIG.PREVIEW_LENGTH),
      wordCount: rootWordCount,
      websiteLogo: websiteLogo || null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to crawl";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
