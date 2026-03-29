"use client";

import { Loader2, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { ENDPOINTS } from "@/lib/endpoint";
import { Chatbot } from "./_components/types";
import { ChatbotSelector } from "./_components/ChatbotSelector";
import { EmbedCodeSection } from "./_components/EmbedCodeSection";
import { ChatbotIdSection } from "./_components/ChatbotIdSection";
import { WidgetPreview } from "./_components/WidgetPreview";

export default function EmbedPage() {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [selected, setSelected] = useState<Chatbot | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

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

  async function handleCopy(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Embed Your Chatbot</h1>
        <p className="text-slate-400 text-sm mt-1">
          Add your chatbot to any website with a single line of code.
        </p>
      </div>

      {chatbots.length === 0 ? (
        <div className="text-center py-20 bg-slate-800/30 border border-white/5 rounded-2xl">
          <Zap className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-300 mb-2">No chatbots yet</h3>
          <p className="text-slate-500 text-sm">Create a chatbot first.</p>
        </div>
      ) : (
        <>
          <ChatbotSelector
            chatbots={chatbots}
            selectedId={selected?.id}
            onSelect={setSelected}
          />

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <EmbedCodeSection
                title="Script Tag (Recommended)"
                description={
                  <>
                    Paste this script before the closing{" "}
                    <code className="text-indigo-300 bg-indigo-500/10 px-1 rounded">
                      &lt;/body&gt;
                    </code>{" "}
                    tag on your website.
                  </>
                }
                code={embedCode}
                language="HTML"
                copied={copied}
                onCopy={handleCopy}
                stepNumber={1}
              />

              <EmbedCodeSection
                title="iFrame Embed"
                description="Embed the chatbot as a fixed-size panel inside your page."
                code={iframeCode}
                language="HTML"
                copied={false} // Independent copy for iframe would be better but keeping simple for now
                onCopy={handleCopy}
                stepNumber={2}
              />

              <ChatbotIdSection
                chatbotId={selected?.id}
                onCopy={handleCopy}
              />
            </div>

            <WidgetPreview chatbot={selected} />
          </div>
        </>
      )}
    </div>
  );
}
