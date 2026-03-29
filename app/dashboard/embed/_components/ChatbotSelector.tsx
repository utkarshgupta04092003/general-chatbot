"use client";

import { Chatbot } from "./types";

type ChatbotSelectorProps = {
  chatbots: Chatbot[];
  selectedId: string | undefined;
  onSelect: (bot: Chatbot) => void;
};

export function ChatbotSelector({
  chatbots,
  selectedId,
  onSelect,
}: ChatbotSelectorProps) {
  if (chatbots.length <= 1) return null;

  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      {chatbots.map((bot) => (
        <button
          key={bot.id}
          onClick={() => onSelect(bot)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            selectedId === bot.id
              ? "bg-indigo-600 text-white"
              : "bg-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          {bot.name}
        </button>
      ))}
    </div>
  );
}
