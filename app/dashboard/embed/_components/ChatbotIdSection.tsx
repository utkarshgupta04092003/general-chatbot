"use client";

import { Copy } from "lucide-react";

type ChatbotIdSectionProps = {
  chatbotId: string | undefined;
  onCopy: (text: string) => void;
};

export function ChatbotIdSection({ chatbotId, onCopy }: ChatbotIdSectionProps) {
  if (!chatbotId) return null;

  return (
    <div className="bg-muted/50 border border-border rounded-2xl p-4 sm:p-5">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">
        Your Chatbot ID
      </h3>
      <div className="flex items-center gap-3 min-w-0">
        <code className="flex-1 px-3 py-2 bg-muted/30 hover:bg-accent/50 rounded-lg text-sm font-mono text-indigo-600 dark:text-indigo-400 truncate min-w-0">
          {chatbotId}
        </code>
        <button
          onClick={() => onCopy(chatbotId)}
          className="p-2 hover:bg-accent/50 bg-muted/30 hover:bg-accent/50 rounded-lg transition-colors shrink-0"
        >
          <Copy className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
