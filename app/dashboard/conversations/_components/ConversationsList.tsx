"use client";

import { MessageSquare } from "lucide-react";
import { useState } from "react";
import { ConversationItem } from "./ConversationItem";

type Message = {
  id: string;
  role: string;
  content: string;
  createdAt: Date;
};

type Conversation = {
  id: string;
  createdAt: Date;
  chatbot: {
    id: string;
    name: string;
  };
  messages: Message[];
};

export function ConversationsList({
  conversations,
}: {
  conversations: Conversation[];
}) {
  const [selectedChatbotId, setSelectedChatbotId] = useState<string>("all");

  const uniqueChatbots = Array.from(
    new Map(conversations.map((c) => [c.chatbot.id, c.chatbot.name])).entries(),
  );

  const filtered =
    selectedChatbotId === "all"
      ? conversations
      : conversations.filter((c) => c.chatbot.id === selectedChatbotId);

  if (conversations.length === 0) {
    return (
      <div className="text-center py-20 bg-card border border-border rounded-lg">
        <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold text-muted-foreground mb-2">
          No conversations yet
        </h3>
        <p className="text-muted-foreground text-sm">
          Conversations will appear here once visitors start chatting with your
          bot.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedChatbotId("all")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all shrink-0 ${
            selectedChatbotId === "all"
              ? "bg-primary text-white shadow-e2 shadow-e2"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          All Conversations
        </button>
        {uniqueChatbots.map(([id, name]) => (
          <button
            key={id}
            onClick={() => setSelectedChatbotId(id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all shrink-0 ${
              selectedChatbotId === id
                ? "bg-primary text-white shadow-e2 shadow-e2"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border rounded-lg">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-muted-foreground mb-2">
              No conversations for this chatbot
            </h3>
            <p className="text-muted-foreground text-sm">
              Conversations will appear here once visitors start chatting.
            </p>
          </div>
        ) : (
          filtered.map((conv) => (
            <ConversationItem key={conv.id} conversation={conv} />
          ))
        )}
      </div>
    </div>
  );
}
