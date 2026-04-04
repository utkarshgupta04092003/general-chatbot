import { POSTHOG_CONFIG } from "@/lib/config";
import { PostHog } from "posthog-node";

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

  const posthogClient = new PostHog(posthogApiKey, {
    host: posthogHost,
    flushAt: 1,
    flushInterval: 0,
  });

  return posthogClient;
}
