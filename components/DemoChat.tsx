"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Loader2 } from "lucide-react";

const DEMO_RESPONSES: Record<string, string> = {
  default: "I'm a demo chatbot trained on ChatBase's own documentation. I can answer questions about how ChatBase works, pricing, features, and setup. Try asking me something!",
  pricing: "ChatBase offers 3 plans:\n\n• **Free**: 10 pages, 100 messages/month\n• **Pro** ($29/mo): 500 pages, 5,000 messages, 5 chatbots\n• **Enterprise** ($99/mo): Unlimited everything + dedicated support\n\nNo credit card required for the free plan!",
  setup: "Setting up ChatBase takes 3 simple steps:\n1. Paste your website URL\n2. We crawl and index your pages automatically\n3. Copy one line of script and paste it on your site\n\nTotal setup time: under 2 minutes!",
  embed: "To embed the chatbot on your website, just add this script tag before your closing `</body>` tag:\n\n`<script src=\"chatbase.ai/widget.js\" data-id=\"YOUR_ID\"></script>`\n\nThat's it! No other configuration needed.",
  accuracy: "ChatBase uses RAG (Retrieval-Augmented Generation) — it only answers from your actual content, so it won't hallucinate or make things up. Accuracy depends on how well your source pages cover the topic.",
};

function getResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("price") || lower.includes("cost") || lower.includes("plan") || lower.includes("paid")) return DEMO_RESPONSES.pricing;
  if (lower.includes("setup") || lower.includes("start") || lower.includes("how") || lower.includes("create") || lower.includes("begin")) return DEMO_RESPONSES.setup;
  if (lower.includes("embed") || lower.includes("script") || lower.includes("install") || lower.includes("website")) return DEMO_RESPONSES.embed;
  if (lower.includes("accurate") || lower.includes("accuracy") || lower.includes("hallucin") || lower.includes("wrong")) return DEMO_RESPONSES.accuracy;
  return DEMO_RESPONSES.default;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function DemoChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "👋 Hi! I'm ChatBase's demo AI. Ask me about pricing, setup, or how it works!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    // Simulate typing delay
    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 800));
    const response = getResponse(userMsg);
    setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    setLoading(false);
  }

  return (
    <div className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-indigo-600">
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold text-white">ChatBase Assistant</div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-xs text-indigo-200">Online · Trained on chatbase.ai</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-72 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed chat-message ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-sm"
                  : "bg-slate-800 text-slate-200 rounded-bl-sm"
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
            <div className="bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-slate-500 rounded-full animate-typing-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested questions */}
      <div className="px-4 pb-2 flex gap-2 flex-wrap">
        {["How much does it cost?", "How do I embed it?"].map((q) => (
          <button
            key={q}
            onClick={() => { setInput(q); }}
            className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-slate-400 hover:text-white transition-all"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 pt-2 border-t border-white/5">
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something..."
            className="flex-1 px-4 py-2.5 bg-slate-800 border border-white/5 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-10 h-10 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-xl flex items-center justify-center transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
          </button>
        </form>
      </div>
    </div>
  );
}
