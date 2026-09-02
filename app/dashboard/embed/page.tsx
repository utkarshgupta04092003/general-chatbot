"use client";

import { NoChatbotEmptyState } from "@/components/dashboard/NoChatbotEmptyState";
import { PageHeader } from "@/components/ui";
import { ANALYTICS_EVENTS } from "@/lib/config";
import { ENDPOINTS } from "@/lib/endpoint";
import { Loader2 } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { useEffect, useState } from "react";

import { ChatbotIdSection } from "./_components/ChatbotIdSection";
import { ChatbotSelector } from "./_components/ChatbotSelector";
import { EmbedCodeSection } from "./_components/EmbedCodeSection";
import { Chatbot } from "./_components/types";
import { WidgetPreview } from "./_components/WidgetPreview";

export default function EmbedPage() {
  const posthog = usePostHog();
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [selected, setSelected] = useState<Chatbot | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    posthog.capture(ANALYTICS_EVENTS.EMBED_VIEWED);
  }, [posthog]);

  useEffect(() => {
    fetch(ENDPOINTS.CHATBOTS)
      .then((r) => r.json())
      .then((d) => {
        setChatbots(d.chatbots ?? []);
        if (d.chatbots?.length > 0) setSelected(d.chatbots[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const embedCode = selected
    ? `<script
  src="${origin}/widget.js"
  data-chatbot-id="${selected.id}"
  defer
></script>`
    : "";

  const iframeCode = selected
    ? `<iframe
  src="${origin}/widget/${selected.id}"
  width="400"
  height="600"
  frameborder="0"
></iframe>`
    : "";

  async function handleCopy(text: string, type: "script" | "iframe" | "id") {
    await navigator.clipboard.writeText(text);
    posthog.capture(ANALYTICS_EVENTS.EMBED_COPIED, {
      chatbotId: selected?.id,
      copyType: type,
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-w-0 overflow-hidden">
      <div className="mb-8">
        <PageHeader title="Embed Your Chatbot" description={"Add your chatbot to any website with a single line of code."} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary dark:text-primary animate-spin" />
        </div>
      ) : chatbots.length === 0 ? (
        <NoChatbotEmptyState />
      ) : (
        <>
          <ChatbotSelector
            chatbots={chatbots}
            selectedId={selected?.id}
            onSelect={setSelected}
          />

          <div className="grid lg:grid-cols-2 gap-6 min-w-0">
            <div className="space-y-6 min-w-0">
              <EmbedCodeSection
                title="Script Tag (Recommended)"
                description={
                  <>
                    Paste this script before the closing{" "}
                    <code className="text-primary bg-primary-subtle px-1 rounded">
                      &lt;/body&gt;
                    </code>{" "}
                    tag on your website.
                  </>
                }
                code={embedCode}
                language="HTML"
                copied={copied}
                onCopy={(text) => handleCopy(text, "script")}
                stepNumber={1}
              />

              <EmbedCodeSection
                title="iFrame Embed"
                description="Embed the chatbot as a fixed-size panel inside your page."
                code={iframeCode}
                language="HTML"
                copied={false} // Independent copy for iframe would be better but keeping simple for now
                onCopy={(text) => handleCopy(text, "iframe")}
                stepNumber={2}
              />

              <ChatbotIdSection
                chatbotId={selected?.id}
                onCopy={(text) => handleCopy(text, "id")}
              />
            </div>

            <WidgetPreview chatbot={selected} />
          </div>
        </>
      )}
    </div>
  );
}
