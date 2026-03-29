"use client";

import { Copy } from "lucide-react";

type ChatbotIdSectionProps = {
  chatbotId: string | undefined;
  onCopy: (text: string) => void;
};

export function ChatbotIdSection({
  chatbotId,
  onCopy,
}: ChatbotIdSectionProps) {
  if (!chatbotId) return null;

  return (
    <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-5">
      <h3 className="text-sm font-medium text-slate-300 mb-2">
        Your Chatbot ID
      </h3>
      <div className="flex items-center gap-3">
        <code className="flex-1 px-3 py-2 bg-white/5 rounded-lg text-sm font-mono text-indigo-300 truncate">
          {chatbotId}
        </code>
        <button
          onClick={() => onCopy(chatbotId)}
          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
        >
          <Copy className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </div>
  );
}
