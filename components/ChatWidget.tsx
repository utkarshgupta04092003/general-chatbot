"use client";

import {
  APP_NAME,
  CHAT_ROLES,
  FEEDBACK_TEXT,
  RESPONSE_ERROR_MESSAGE,
} from "@/lib/config";
import { ChatRole, FeedbackType } from "@/lib/declaration";
import { ENDPOINTS } from "@/lib/endpoint";
import {
  Loader2,
  MessageSquare,
  Minimize2,
  RefreshCw,
  Send,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MarkdownMessage } from "./MarkdownMessage";

type Message = {
  id?: string;
  role: ChatRole;
  content: string;
  feedback?: FeedbackType | null;
};

type Props = {
  chatbotId: string;
  chatbotName?: string;
  welcomeMessage?: string;
  primaryColor?: string;
  assistantLogo?: string | null;
  websiteLogo?: string | null;
  theme?: string;
};

export default function ChatWidget({
  chatbotId,
  chatbotName = "AI Assistant",
  welcomeMessage,
  primaryColor = "#6366f1",
  assistantLogo,
  websiteLogo,
  theme = "light",
}: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

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

  async function handleFeedback(messageId: string, feedback: FeedbackType) {
    try {
      // Optimistic update
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, feedback } : msg)),
      );

      await fetch(ENDPOINTS.MESSAGE_FEEDBACK(messageId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback }),
      });
    } catch (error) {
      console.error("Feedback error:", error);
    }
  }

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
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
          id: data.messageId,
          role: CHAT_ROLES.ASSISTANT,
          content: data.response || RESPONSE_ERROR_MESSAGE,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: CHAT_ROLES.ASSISTANT,
          content: RESPONSE_ERROR_MESSAGE,
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
          className={`rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col overflow-hidden border animate-fade-in-up transition-colors duration-300 ${
            theme === "dark"
              ? "bg-slate-900 border-slate-800 text-slate-100"
              : "bg-white border-gray-100 text-slate-900"
          }`}
          style={{ height: "520px" }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center shrink-0 overflow-hidden relative">
              {websiteLogo ? (
                <Image
                  src={websiteLogo}
                  alt="Logo"
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <MessageSquare className="w-4 h-4 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-white">
                {chatbotName}
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="text-xs text-white/80">
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
          <div
            ref={scrollRef}
            className={`flex-1 overflow-y-auto px-4 py-3 space-y-3 relative group/messages scroll-smooth transition-colors ${
              theme === "dark" ? "bg-slate-900/50" : "bg-gray-50"
            }`}
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.15] select-none p-10">
              <p
                className={`text-sm font-semibold text-center tracking-widest leading-relaxed ${theme === "dark" ? "text-white" : "text-black"}`}
              >
                Responses are generated using AI
                <br />
                and may contain mistakes
              </p>
            </div>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === CHAT_ROLES.USER ? "justify-end" : "justify-start"}`}
              >
                {msg.role === CHAT_ROLES.ASSISTANT && (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs shrink-0 mr-2 mt-0.5 overflow-hidden relative"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {assistantLogo ? (
                      <Image
                        src={assistantLogo}
                        alt="Bot"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      "🤖"
                    )}
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed break-words overflow-hidden relative group transition-colors ${
                    msg.role === CHAT_ROLES.USER
                      ? "text-white rounded-br-sm"
                      : theme === "dark"
                        ? "bg-slate-800 text-slate-100 shadow-md rounded-bl-sm"
                        : "bg-white text-gray-700 shadow-sm rounded-bl-sm"
                  }`}
                  style={
                    msg.role === CHAT_ROLES.USER
                      ? { backgroundColor: primaryColor }
                      : {}
                  }
                >
                  {msg.role === CHAT_ROLES.ASSISTANT ? (
                    <>
                      <MarkdownMessage content={msg.content} />
                      {msg.id && (
                        <div
                          className={`flex items-center gap-1.5 mt-2 pt-2 border-t opacity-0 group-hover:opacity-100 transition-all ${theme === "dark" ? "border-slate-700" : "border-gray-50"}`}
                        >
                          <button
                            onClick={() =>
                              handleFeedback(msg.id!, FEEDBACK_TEXT.HELPFUL)
                            }
                            className={`hover:bg-opacity-10 p-1 rounded transition-colors ${
                              msg.feedback === FEEDBACK_TEXT.HELPFUL
                                ? "text-green-500 bg-green-500/10"
                                : "text-gray-400 hover:bg-gray-400"
                            }`}
                            title={FEEDBACK_TEXT.HELPFUL}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              handleFeedback(msg.id!, FEEDBACK_TEXT.UNHELPFUL)
                            }
                            className={`hover:bg-opacity-10 p-1 rounded transition-colors ${
                              msg.feedback === FEEDBACK_TEXT.UNHELPFUL
                                ? "text-red-500 bg-red-500/10"
                                : "text-gray-400 hover:bg-gray-400"
                            }`}
                            title={FEEDBACK_TEXT.UNHELPFUL}
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs shrink-0 mr-2 mt-0.5 overflow-hidden relative"
                  style={{ backgroundColor: primaryColor }}
                >
                  {assistantLogo ? (
                    <Image
                      src={assistantLogo}
                      alt="Bot"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    "🤖"
                  )}
                </div>
                <div
                  className={`rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1.5 transition-colors ${theme === "dark" ? "bg-slate-800" : "bg-white"}`}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full animate-typing-bounce ${theme === "dark" ? "bg-slate-500" : "bg-gray-400"}`}
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
          </div>

          {/* Input */}
          <div
            className={`p-3 border-t transition-colors ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"}`}
          >
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
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 ${
                  theme === "dark"
                    ? "bg-slate-800 text-slate-100 placeholder:text-slate-500"
                    : "bg-gray-100 text-gray-700 placeholder:text-gray-400"
                }`}
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
            <p className="text-center text-[10px] text-gray-300 mt-2 leading-relaxed">
              Powered by {APP_NAME} AI
            </p>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 text-white"
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
