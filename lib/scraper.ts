export async function fetchWithFallback(
  url: string,
  options: RobustFetchOptions = {},
  minWords = 50,
): Promise<Response> {
  const res = await robustFetch(url, options);
  if (!res.ok) return res;

  const clone = res.clone();
  const html = await clone.text();

  // Basic check for JS-only pages: not enough content text.
  const text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const wordCount = text.split(/\s+/).filter(Boolean).length;

  if (wordCount < minWords) {
    try {
      console.log(
        `[Scraper] Content length too low (${wordCount} words). Falling back to Puppeteer for: ${url}`,
      );
      return await puppeteerFetch(url, options);
    } catch (e) {
      console.error(`[Scraper] Puppeteer fallback failed for ${url}`, e);
      return res; // return original if fallback fails
    }
  }

  return res;
}

export async function robustFetch(
  url: string,
  options: RobustFetchOptions = {},
): Promise<Response> {
  const {
    timeout = 10000,
    retries = 2,
    useRandomUserAgent = true,
    headers = {},
    ...rest
  } = options;

  const defaultHeaders: Record<string, string> = {
    "User-Agent": useRandomUserAgent
      ? getRandomUserAgent()
      : "Mozilla/5.0 (compatible; ChatBase-Bot/1.0; +https://chatbase.ai/bot)",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    "Sec-Ch-Ua":
      '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
  };

  const finalHeaders = { ...defaultHeaders, ...headers };

  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...rest,
        headers: finalHeaders,
        signal: controller.signal,
      });

      clearTimeout(id);

      if (response.status === 403 || response.status === 429) {
        if (attempt < retries) {
          const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
      }

      return response;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < retries) {
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
    }
  }

  throw (
    lastError || new Error(`Failed to fetch ${url} after ${retries} retries`)
  );
}

export async function puppeteerFetch(
  url: string,
  options: RobustFetchOptions = {},
): Promise<Response> {
  // Dynamically import to avoid breaking environments where puppeteer isn't available
  const puppeteer = (await import("puppeteer")).default;

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  try {
    const page = await browser.newPage();
    if (options.useRandomUserAgent !== false) {
      await page.setUserAgent(getRandomUserAgent());
    }

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: options.timeout || 15000,
    });

    const html = await page.content();
    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    console.log("error in puppeteer", error);
    throw error;
  } finally {
    await browser.close();
  }
}

export function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

export interface RobustFetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  useRandomUserAgent?: boolean;
}

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
];
