import { load } from "cheerio";

/**
 * Extracts the domain from a URL (e.g., https://example.com/page -> example.com)
 */
export function getDomain(url: string): string {
  try {
    const { hostname } = new URL(url);
    return hostname;
  } catch {
    return "";
  }
}

/**
 * Verifies if a URL contains the required meta tag for ownership verification.
 * <meta name="chatbot-verification" content="TOKEN" />
 */
export async function verifyDomainOwnership(
  url: string,
  token: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const domain = getDomain(url);
    if (!domain) return { success: false, error: "Invalid URL" };

    // We fetch the root of the domain for verification
    const rootUrl = `https://${domain}`;

    const response = await fetch(rootUrl, {
      headers: {
        "User-Agent": "ChatbotVerification/1.0",
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to reach ${rootUrl} (Status: ${response.status})`,
      };
    }

    const html = await response.text();
    const $ = load(html);

    const metaTag = $('meta[name="chatbot-verification"]').attr("content");

    if (metaTag === token) {
      return { success: true };
    }

    return {
      success: false,
      error: metaTag
        ? "Verification token mismatch."
        : "Verification meta tag not found.",
    };
  } catch (err) {
    console.error("Verification error:", err);
    return { success: false, error: "An error occurred during verification." };
  }
}
