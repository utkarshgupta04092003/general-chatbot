"use client";

import { MarkdownMessage } from "@/components/MarkdownMessage";
import { ANALYTICS_EVENTS, CHAT_ROLES } from "@/lib/config";
import { formatRelativeTime } from "@/lib/utils";
import { Bot, ChevronDown, MessageSquare, User } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { useState } from "react";

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

export function ConversationItem({
  conversation,
}: {
  conversation: Conversation;
}) {
  const posthog = usePostHog();
  const [hasTracked, setHasTracked] = useState(false);

  const handleToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    // Only track when it opens and only track once per load to avoid noise
    if (e.currentTarget.open && !hasTracked) {
      posthog.capture(ANALYTICS_EVENTS.CONVERSATION_OPENED, {
        conversationId: conversation.id,
        chatbotId: conversation.chatbot.id,
      });
      setHasTracked(true);
    }
  };

  return (
    <details
      onToggle={handleToggle}
      className="group bg-muted/50 border border-border rounded-2xl overflow-hidden"
    >
      <summary className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-muted/50 transition-colors list-none">
        <div className="w-9 h-9 bg-indigo-500/10 rounded-xl flex items-center justify-center shrink-0">
          <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-foreground">
            {conversation.messages[0]?.content?.slice(0, 80) ??
              "Empty conversation"}
            {(conversation.messages[0]?.content?.length ?? 0) > 80 ? "..." : ""}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {conversation.chatbot.name} · {conversation.messages.length}{" "}
            messages · {formatRelativeTime(conversation.createdAt)}
          </div>
        </div>
        <ChevronDown className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform shrink-0" />
      </summary>
      <div className="border-t border-border px-5 py-4 space-y-3 max-h-80 overflow-y-auto">
        {conversation.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${
              msg.role === CHAT_ROLES.USER ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === CHAT_ROLES.ASSISTANT && (
              <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3 h-3 text-white" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm break-words overflow-hidden ${
                msg.role === CHAT_ROLES.USER
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-accent text-foreground rounded-bl-none"
              }`}
            >
              {msg.role === CHAT_ROLES.ASSISTANT ? (
                <MarkdownMessage
                  content={msg.content}
                  linkColor="text-indigo-400"
                  codeBg="bg-white/10"
                  preBg="bg-white/5"
                />
              ) : (
                <p>{msg.content}</p>
              )}
              <div
                className={`text-xs mt-1.5 ${
                  msg.role === CHAT_ROLES.USER
                    ? "text-indigo-200"
                    : "text-muted-foreground"
                }`}
              >
                {formatRelativeTime(msg.createdAt)}
              </div>
            </div>
            {msg.role === CHAT_ROLES.USER && (
              <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3 h-3 text-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>
    </details>
  );
}
