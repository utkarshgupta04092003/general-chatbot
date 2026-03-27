"use client";

import { Check, Copy, ExternalLink, Loader2, Zap } from "lucide-react";
import { useEffect, useState } from "react";

type Chatbot = {
  id: string;
  name: string;
  primaryColor: string;
  status: string;
};

export default function EmbedPage() {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [selected, setSelected] = useState<Chatbot | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/chatbots")
      .then((r) => r.json())
      .then((d) => {
        setChatbots(d.chatbots ?? []);
        if (d.chatbots?.length > 0) setSelected(d.chatbots[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  const embedCode = selected
    ? `<script
  src="${typeof window !== "undefined" ? window.location.origin : ""}/widget.js"
  data-chatbot-id="${selected.id}"
  defer
></script>`
    : "";

  const iframeCode = selected
    ? `<iframe
  src="${typeof window !== "undefined" ? window.location.origin : "https://chatbase.ai"}/widget/${selected.id}"
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
          {/* Chatbot selector */}
          {chatbots.length > 1 && (
            <div className="flex gap-2 mb-6 flex-wrap">
              {chatbots.map((bot) => (
                <button
                  key={bot.id}
                  onClick={() => setSelected(bot)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selected?.id === bot.id
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {bot.name}
                </button>
              ))}
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Script embed */}
            <div className="space-y-6">
              <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-indigo-500/10 rounded flex items-center justify-center text-xs font-bold text-indigo-400">
                    1
                  </div>
                  <h2 className="font-semibold">Script Tag (Recommended)</h2>
                </div>
                <p className="text-sm text-slate-400 mb-4">
                  Paste this script before the closing{" "}
                  <code className="text-indigo-300 bg-indigo-500/10 px-1 rounded">
                    &lt;/body&gt;
                  </code>{" "}
                  tag on your website.
                </p>
                <div className="relative bg-slate-900 rounded-xl border border-white/5 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-white/5">
                    <span className="text-xs text-slate-400 font-mono">
                      HTML
                    </span>
                    <button
                      onClick={() => handleCopy(embedCode)}
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <pre className="p-4 text-sm text-green-300 font-mono overflow-x-auto">
                    <code>{embedCode}</code>
                  </pre>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-indigo-500/10 rounded flex items-center justify-center text-xs font-bold text-indigo-400">
                    2
                  </div>
                  <h2 className="font-semibold">iFrame Embed</h2>
                </div>
                <p className="text-sm text-slate-400 mb-4">
                  Embed the chatbot as a fixed-size panel inside your page.
                </p>
                <div className="relative bg-slate-900 rounded-xl border border-white/5 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-white/5">
                    <span className="text-xs text-slate-400 font-mono">
                      HTML
                    </span>
                    <button
                      onClick={() => handleCopy(iframeCode)}
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </button>
                  </div>
                  <pre className="p-4 text-sm text-green-300 font-mono overflow-x-auto">
                    <code>{iframeCode}</code>
                  </pre>
                </div>
              </div>

              {/* Chatbot ID */}
              <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-5">
                <h3 className="text-sm font-medium text-slate-300 mb-2">
                  Your Chatbot ID
                </h3>
                <div className="flex items-center gap-3">
                  <code className="flex-1 px-3 py-2 bg-white/5 rounded-lg text-sm font-mono text-indigo-300 truncate">
                    {selected?.id}
                  </code>
                  <button
                    onClick={() => selected && handleCopy(selected.id)}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div>
              <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6 sticky top-6">
                <h2 className="font-semibold mb-4">Widget Preview</h2>
                <div
                  className="bg-slate-900 rounded-xl border border-white/10 relative"
                  style={{ height: "400px" }}
                >
                  <div className="p-4 h-full flex flex-col">
                    {/* Chat header */}
                    <div
                      className="rounded-xl px-4 py-3 flex items-center gap-3 mb-3"
                      style={{
                        backgroundColor: selected?.primaryColor ?? "#6366f1",
                      }}
                    >
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">
                        🤖
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {selected?.name}
                        </div>
                        <div className="text-xs text-white/70 flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                          Online
                        </div>
                      </div>
                    </div>
                    {/* Messages */}
                    <div className="flex-1 space-y-2 overflow-hidden">
                      <div className="bg-slate-800 rounded-xl rounded-bl-none px-3 py-2 text-xs text-slate-300 max-w-[80%]">
                        👋 Hello! How can I help you today?
                      </div>
                      <div className="flex justify-end">
                        <div
                          className="px-3 py-2 rounded-xl rounded-br-none text-xs text-white max-w-[80%]"
                          style={{
                            backgroundColor:
                              selected?.primaryColor ?? "#6366f1",
                          }}
                        >
                          Tell me about your features
                        </div>
                      </div>
                      <div className="bg-slate-800 rounded-xl rounded-bl-none px-3 py-2 text-xs text-slate-300 max-w-[85%]">
                        I&apos;d be happy to help! Our platform offers...
                      </div>
                    </div>
                    {/* Input */}
                    <div className="mt-3 flex gap-2">
                      <div className="flex-1 bg-slate-800 rounded-xl px-3 py-2 text-xs text-slate-500">
                        Type a message...
                      </div>
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-xs"
                        style={{
                          backgroundColor: selected?.primaryColor ?? "#6366f1",
                        }}
                      >
                        →
                      </div>
                    </div>
                  </div>
                  {/* Floating button mockup */}
                  <div
                    className="absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-xl text-white text-xl"
                    style={{
                      backgroundColor: selected?.primaryColor ?? "#6366f1",
                    }}
                  >
                    💬
                  </div>
                </div>
                {selected?.id && (
                  <a
                    href={`/widget/${selected.id}`}
                    target="_blank"
                    className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-slate-300 rounded-xl transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open full chat page
                  </a>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
