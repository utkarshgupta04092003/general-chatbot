"use client";

import { POSTHOG_CONFIG } from "@/lib/config";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { ReactNode } from "react";

if (typeof window !== "undefined") {
  const { apiKey: posthogApiKey, host: posthogHost } = POSTHOG_CONFIG;

  if (posthogApiKey) {
    posthog.init(posthogApiKey, {
      api_host: posthogHost,
      person_profiles: "identified_only",
      capture_pageview: true,
      capture_pageleave: true,
    });
  } else {
    console.warn(
      "PostHog API key not found. Client-side tracking is disabled.",
    );
  }
}

export default function PHProvider({ children }: { children: ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
