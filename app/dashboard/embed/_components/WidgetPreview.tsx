"use client";

import { ExternalLink } from "lucide-react";
import { Chatbot } from "./types";

type WidgetPreviewProps = {
  chatbot: Chatbot | null;
};

export function WidgetPreview({ chatbot }: WidgetPreviewProps) {
  const primaryColor = chatbot?.primaryColor ?? "#6366f1";

  return (
    <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-4 sm:p-6 lg:sticky lg:top-6 min-w-0">
      <h2 className="font-semibold mb-4">Widget Preview</h2>
      <div
        className="bg-slate-900 rounded-xl border border-white/10 relative overflow-hidden"
        style={{ height: "400px" }}
      >
        <div className="p-4 h-full flex flex-col">
          {/* Chat header */}
          <div
            className="rounded-xl px-4 py-3 flex items-center gap-3 mb-3 shrink-0"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm shrink-0">
              🤖
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-white truncate">
                {chatbot?.name || "Chatbot"}
              </div>
              <div className="text-xs text-white/70 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full shrink-0" />
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
                style={{ backgroundColor: primaryColor }}
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
              className="w-8 h-8 rounded-xl flex items-center justify-center text-xs text-white"
              style={{ backgroundColor: primaryColor }}
            >
              →
            </div>
          </div>
        </div>
        {/* Floating button mockup */}
        <div
          className="absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-xl text-white text-xl"
          style={{ backgroundColor: primaryColor }}
        >
          💬
        </div>
      </div>
      {chatbot?.id && (
        <a
          href={`/widget/${chatbot.id}`}
          target="_blank"
          className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-slate-300 rounded-xl transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          Open full chat page
        </a>
      )}
    </div>
  );
}
