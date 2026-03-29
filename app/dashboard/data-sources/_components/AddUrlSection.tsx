"use client";

import { AlertCircle, Globe, Loader2, Plus } from "lucide-react";
import { DataSource } from "./types";

type AddUrlSectionProps = {
  selectedChatbotId: string;
  sources: DataSource[];
  error: string;
  addUrl: string;
  setAddUrl: (url: string) => void;
  onAdd: () => void;
  adding: boolean;
};

export function AddUrlSection({
  selectedChatbotId,
  sources,
  error,
  addUrl,
  setAddUrl,
  onAdd,
  adding,
}: AddUrlSectionProps) {
  const selectedChatbotName =
    selectedChatbotId === "all"
      ? "primary chatbot"
      : sources.find((s) => s.chatbotId === selectedChatbotId)?.chatbot.name;

  return (
    <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-5 mb-6">
      <h2 className="text-sm font-semibold mb-3">
        Add to {selectedChatbotName}
      </h2>
      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-300 px-3 py-2 rounded-lg text-sm mb-3">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
      <div className="flex gap-3">
        <div className="flex-1 flex items-center bg-white/5 border border-white/10 rounded-xl px-4 gap-2 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
          <Globe className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="url"
            value={addUrl}
            onChange={(e) => setAddUrl(e.target.value)}
            placeholder="https://yoursite.com/new-page"
            className="flex-1 py-2.5 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
        </div>
        <button
          onClick={onAdd}
          disabled={adding || !addUrl.trim()}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all"
        >
          {adding ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {adding ? "Adding..." : "Add URL"}
        </button>
      </div>
      <p className="text-xs text-slate-500 mt-2">
        Free plan: up to 10 pages total
      </p>
    </div>
  );
}
