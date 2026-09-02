"use client";

import { APP_NAME, CHAT_ROLES } from "@/lib/config";
import { ChatRole } from "@/lib/declaration";
import { Loader2, MessageSquare, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const DEMO_RESPONSES: Record<string, string> = {
  default: `I'm a demo chatbot trained on ${APP_NAME}'s own documentation. I can answer questions about how ${APP_NAME} works, features, and setup. Try asking me something!`,
  setup: `Setting up ${APP_NAME} takes 3 simple steps:\n1. Paste your website URL\n2. We crawl and index your pages automatically\n3. Copy one line of script and paste it on your site\n\nTotal setup time: under 2 minutes!`,
  embed: `To embed the chatbot on your website, just add this script tag before your closing \`</body>\` tag:\n\n\`<script src="${APP_NAME.toLowerCase()}.ai/widget.js" data-id="YOUR_ID"></script>\`\n\nThat\'s it! No other configuration needed.`,
  accuracy: `${APP_NAME} uses RAG (Retrieval-Augmented Generation) — it only answers from your actual content, so it won't hallucinate or make things up. Accuracy depends on how well your source pages cover the topic.`,
  features: `${APP_NAME} is packed with powerful features:\n\n• **Auto URL Discovery**: We automatically find and index all pages on your domain.\n• **Analytics Dashboard**: Track engagement and query performance in real-time.\n• **1-Line Embed**: Works with any website or framework.\n• **Data Privacy**: SOC 2 compliant storage and enterprise-grade security.`,
  benefits: `${APP_NAME} provides instant, accurate support 24/7. It reduces support tickets by up to 60%, improves customer satisfaction with zero wait times, and helps your team focus on complex tasks while the AI handles repetitive queries.`,
};

function getResponse(message: string): string {
  const lower = message.toLowerCase();
  if (
    lower.includes("setup") ||
    lower.includes("start") ||
    lower.includes("how") ||
    lower.includes("create") ||
    lower.includes("begin")
  )
    return DEMO_RESPONSES.setup;
  if (
    lower.includes("embed") ||
    lower.includes("script") ||
    lower.includes("install") ||
    lower.includes("website")
  )
    return DEMO_RESPONSES.embed;
  if (
    lower.includes("accurate") ||
    lower.includes("accuracy") ||
    lower.includes("hallucin") ||
    lower.includes("wrong")
  )
    return DEMO_RESPONSES.accuracy;
  if (
    lower.includes("feature") ||
    lower.includes("function") ||
    lower.includes("capability") ||
    lower.includes("what can it do")
  )
    return DEMO_RESPONSES.features;
  if (
    lower.includes("why") ||
    lower.includes("benefit") ||
    lower.includes("advantage") ||
    lower.includes("value") ||
    lower.includes("use it")
  )
    return DEMO_RESPONSES.benefits;
  return DEMO_RESPONSES.default;
}

type Message = {
  role: ChatRole;
  content: string;
};

export default function DemoChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: CHAT_ROLES.ASSISTANT,
      content: `👋 Hi! I'm ${APP_NAME}'s demo AI. Ask me about features, setup, or how it works!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 1 && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [
      ...prev,
      { role: CHAT_ROLES.USER, content: userMsg },
    ]);
    setLoading(true);

    // Simulate typing delay
    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 800));
    const response = getResponse(userMsg);
    setMessages((prev) => [
      ...prev,
      { role: CHAT_ROLES.ASSISTANT, content: response },
    ]);
    setLoading(false);
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-e3">
      {/* Chat header */}
      <div className="flex items-center gap-2.5 px-4 h-12 border-b border-border">
        <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center shrink-0">
          <MessageSquare className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium leading-tight">
            {APP_NAME} Assistant
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            <span className="text-[11px] text-muted-foreground">
              Trained on {APP_NAME.toLowerCase()} docs
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="h-72 overflow-y-auto p-4 space-y-3.5 relative"
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none p-10"></div>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === CHAT_ROLES.USER ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] text-sm leading-relaxed chat-message ${
                msg.role === CHAT_ROLES.USER
                  ? "bg-primary text-primary-foreground rounded-md px-3 py-2"
                  : "text-foreground"
              }`}
            >
              {msg.content.split("\n").map((line, j) => (
                <span key={j}>
                  {line.replace(/\*\*(.*?)\*\*/g, "$1")}
                  {j < msg.content.split("\n").length - 1 && <br />}
                </span>
              ))}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-1.5 py-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-typing-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Suggested questions */}
      <div className="px-4 pb-2 flex gap-2 flex-wrap">
        {["Why use it?", "What features do you have?", "How do I setup?"].map(
          (q) => (
            <button
              key={q}
              onClick={() => {
                setInput(q);
              }}
              className="text-xs px-2.5 py-1 bg-card hover:bg-accent border border-border rounded-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {q}
            </button>
          ),
        )}
      </div>

      {/* Input */}
      <div className="p-4 pt-2 border-t border-border">
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
            placeholder="Ask something..."
            className="flex-1 h-9 px-3 bg-card border border-input rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-9 h-9 shrink-0 bg-primary hover:bg-primary-hover disabled:opacity-50 rounded-md flex items-center justify-center transition-colors"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
            ) : (
              <Send className="w-4 h-4 text-primary-foreground" />
            )}
          </button>
        </form>
        <p className="text-center text-[10px] text-muted-foreground mt-2 leading-relaxed">
          Responses are generated using AI and may contain mistakes.
        </p>
      </div>
    </div>
  );
}
