"use client";

import { DataSource } from "./types";

type ChatbotFilterProps = {
  sources: DataSource[];
  selectedChatbotId: string;
  setSelectedChatbotId: (id: string) => void;
};

export function ChatbotFilter({
  sources,
  selectedChatbotId,
  setSelectedChatbotId,
}: ChatbotFilterProps) {
  if (sources.length === 0) return null;

  const uniqueChatbots = Array.from(new Set(sources.map((s) => s.chatbotId)));

  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => setSelectedChatbotId("all")}
        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all shrink-0 ${
          selectedChatbotId === "all"
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
            : "bg-muted text-muted-foreground hover:text-foreground"
        }`}
      >
        All Sources
      </button>
      {uniqueChatbots.map((id) => {
        const name = sources.find((s) => s.chatbotId === id)?.chatbot.name;
        return (
          <button
            key={id}
            onClick={() => setSelectedChatbotId(id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all shrink-0 ${
              selectedChatbotId === id
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
}
