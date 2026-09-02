import { POSTHOG_CONFIG } from "@/lib/config";
import { PostHog } from "posthog-node";
import { after } from "next/server";

interface PostHogCaptureArgs {
  distinctId: string;
  event: string;
  properties?: Record<string, unknown>;
  groups?: Record<string, unknown>;
  timestamp?: Date;
}

export default function PostHogClient() {
  const { apiKey: posthogApiKey, host: posthogHost } = POSTHOG_CONFIG;

  if (!posthogApiKey) {
    console.warn(
      "PostHog API key not found. Events will not be tracked on the server.",
    );
    return {
      capture: (args: PostHogCaptureArgs) => {
        console.log("[PostHog Mock] capture:", args);
      },
      shutdown: async () => {},
    };
  }

  // flushAt:1 + flushInterval:0 made every capture a blocking HTTP round-trip,
  // and shutdown() awaited them on the response path (~6s per chat request).
  const posthogClient = new PostHog(posthogApiKey, {
    host: posthogHost,
    flushAt: 20,
    flushInterval: 10000,
    requestTimeout: 3000,
  });

  return posthogClient;
}

/**
 * Flush without blocking the response. Next's `after()` runs the work once the
 * response has been sent, so the client never waits on the analytics round-trip.
 */
export function flushPostHog(client: { shutdown: () => Promise<void> }) {
  try {
    after(async () => {
      try {
        await client.shutdown();
      } catch {
        // analytics delivery is best-effort; never surface to the caller
      }
    });
  } catch {
    // outside a request scope (scripts, tests): fall back to fire-and-forget
    void client.shutdown().catch(() => {});
  }
}
