"use client";

import { AlertCircle, FileText, Globe, Loader2, Plus } from "lucide-react";
import { DataSource } from "./types";

type AddUrlSectionProps = {
  selectedChatbotId: string;
  sources: DataSource[];
  error: string;
  addUrl: string;
  setAddUrl: (url: string) => void;
  onAdd: () => void;
  onAddManual: () => void;
  adding: boolean;
};

export function AddUrlSection({
  selectedChatbotId,
  sources,
  error,
  addUrl,
  setAddUrl,
  onAdd,
  onAddManual,
  adding,
}: AddUrlSectionProps) {
  const selectedChatbotName =
    selectedChatbotId === "all"
      ? "primary chatbot"
      : sources.find((s) => s.chatbotId === selectedChatbotId)?.chatbot.name;

  return (
    <div className="bg-card border border-border rounded-lg p-5 mb-6">
      <h2 className="text-sm font-semibold mb-3">
        Add to {selectedChatbotName}
      </h2>
      {error && (
        <div className="flex items-center gap-2 bg-danger/10 border border-red-500/20 text-red-300 px-3 py-2 rounded-lg text-sm mb-3">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex-1 flex items-center bg-card border border-border border border-border rounded-md px-4 gap-2 focus-within:ring-2 focus-within:ring-primary transition-all">
          <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="url"
            value={addUrl}
            onChange={(e) => setAddUrl(e.target.value)}
            placeholder="https://yoursite.com/new-page"
            className="flex-1 py-2.5 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
        <button
          onClick={onAdd}
          disabled={adding || !addUrl.trim()}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-sm font-medium rounded-md transition-all w-full lg:w-auto"
        >
          {adding ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {adding ? "Adding..." : "Add URL"}
        </button>
        <button
          onClick={onAddManual}
          disabled={adding}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-muted hover:bg-muted/80 disabled:opacity-50 text-foreground text-sm font-medium border border-border rounded-md transition-all w-full lg:w-auto"
        >
          <FileText className="w-4 h-4" />
          Add Manual Data
        </button>
      </div>
    </div>
  );
}
