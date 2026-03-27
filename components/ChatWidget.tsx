"use client";

import { CHAT_ROLES } from "@/lib/config";
import { ChatRole } from "@/lib/declaration";
import { ENDPOINTS } from "@/lib/endpoint";
import {
  Loader2,
  MessageSquare,
  Minimize2,
  RefreshCw,
  Send,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MarkdownMessage } from "./MarkdownMessage";

type Message = {
  role: ChatRole;
  content: string;
};

type Props = {
  chatbotId: string;
  chatbotName?: string;
  welcomeMessage?: string;
  primaryColor?: string;
};

export default function ChatWidget({
  chatbotId,
  chatbotName = "AI Assistant",
  welcomeMessage,
  primaryColor = "#6366f1",
}: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Initialize session
    const storageKey = `chat_session_${chatbotId}`;
    let savedSession = localStorage.getItem(storageKey);
    if (!savedSession) {
      savedSession = Math.random().toString(36).slice(2);
      localStorage.setItem(storageKey, savedSession);
    }
    setSessionId(savedSession);

    // 2. Fetch history
    async function fetchHistory() {
      setFetchingHistory(true);
      try {
        const res = await fetch(
          `${ENDPOINTS.CHAT}?chatbotId=${chatbotId}&sessionId=${savedSession}`,
        );
        const data = await res.json();
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
        } else if (welcomeMessage) {
          setMessages([
            { role: CHAT_ROLES.ASSISTANT, content: welcomeMessage },
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
        if (welcomeMessage) {
          setMessages([
            { role: CHAT_ROLES.ASSISTANT, content: welcomeMessage },
          ]);
        }
      } finally {
        setFetchingHistory(false);
      }
    }

    fetchHistory();
  }, [chatbotId, welcomeMessage]);

  function handleReset() {
    if (!confirm("Are you sure you want to clear the chat history?")) return;

    const storageKey = `chat_session_${chatbotId}`;
    localStorage.removeItem(storageKey);

    const newSession = Math.random().toString(36).slice(2);
    localStorage.setItem(storageKey, newSession);

    setSessionId(newSession);
    setMessages(
      welcomeMessage
        ? [{ role: CHAT_ROLES.ASSISTANT, content: welcomeMessage }]
        : [],
    );
    setInput("");
  }

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [
      ...prev,
      { role: CHAT_ROLES.USER, content: userMsg },
    ]);
    setLoading(true);

    try {
      const res = await fetch(ENDPOINTS.CHAT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatbotId, message: userMsg, sessionId }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: CHAT_ROLES.ASSISTANT,
          content: data.response || "Sorry, I couldn't process that.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: CHAT_ROLES.ASSISTANT,
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-3 chatbot-widget">
      {/* Chat window */}
      {open && (
        <div
          className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col overflow-hidden border border-gray-100 animate-fade-in-up"
          style={{ height: "520px" }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">{chatbotName}</div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="text-xs text-white/70">
                  Always here to help
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                title="Reset Chat"
                className="text-white/70 hover:text-white transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
                title="Minimize"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === CHAT_ROLES.USER ? "justify-end" : "justify-start"}`}
              >
                {msg.role === CHAT_ROLES.ASSISTANT && (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs shrink-0 mr-2 mt-0.5"
                    style={{ backgroundColor: primaryColor }}
                  >
                    🤖
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed break-words overflow-hidden ${
                    msg.role === CHAT_ROLES.USER
                      ? "text-white rounded-br-sm"
                      : "bg-white text-gray-700 shadow-sm rounded-bl-sm"
                  }`}
                  style={
                    msg.role === CHAT_ROLES.USER
                      ? { backgroundColor: primaryColor }
                      : {}
                  }
                >
                  {msg.role === CHAT_ROLES.ASSISTANT ? (
                    <MarkdownMessage content={msg.content} />
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs shrink-0 mr-2 mt-0.5"
                  style={{ backgroundColor: primaryColor }}
                >
                  🤖
                </div>
                <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-gray-400 rounded-full animate-typing-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            {fetchingHistory && (
              <div className="flex justify-center py-4">
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all"
                style={
                  { "--tw-ring-color": primaryColor } as React.CSSProperties
                }
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-40 transition-all text-white"
                style={{ backgroundColor: primaryColor }}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>
            <p className="text-center text-[10px] text-gray-300 mt-2">
              Powered by ChatBase AI
            </p>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full text-white shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        style={{ backgroundColor: primaryColor }}
        aria-label="Open chat"
      >
        {open ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquare className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}
