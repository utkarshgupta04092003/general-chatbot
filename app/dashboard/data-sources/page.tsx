"use client";

import { useState, useEffect } from "react";
import {
  Globe,
  Trash2,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface DataSource {
  id: string;
  url: string;
  title: string;
  wordCount: number;
  status: string;
  createdAt: string;
  chatbotId: string;
}

export default function DataSourcesPage() {
  const [sources, setSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [addUrl, setAddUrl] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSources();
  }, []);

  async function fetchSources() {
    try {
      const res = await fetch("/api/data-sources");
      const data = await res.json();
      setSources(data.sources ?? []);
    } catch {
      setError("Failed to load data sources");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (
      !confirm(
        "Remove this data source? This may affect your chatbot's responses.",
      )
    )
      return;
    await fetch(`/api/data-sources/${id}`, { method: "DELETE" });
    setSources((prev) => prev.filter((s) => s.id !== id));
  }

  async function handleAddUrl() {
    if (!addUrl.trim()) return;
    setAdding(true);
    setError("");

    try {
      // 1. Get chatbot ID if we don't have it
      let targetChatbotId = sources[0]?.chatbotId;
      if (!targetChatbotId) {
        const res = await fetch("/api/chatbots");
        const data = await res.json();
        if (data.chatbots?.length > 0) {
          targetChatbotId = data.chatbots[0].id;
        } else {
          throw new Error("No chatbot found. Please complete onboarding.");
        }
      }

      // 2. Scrape the URL
      const scrapeRes = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: [addUrl.trim()] }),
      });
      const scrapeData = await scrapeRes.json();
      if (!scrapeRes.ok) throw new Error(scrapeData.error || "Scrape failed");

      const page = scrapeData.pages[0];
      if (page.status === "failed")
        throw new Error("Failed to extract content from this URL");

      // 3. Embed the content
      const embedRes = await fetch("/api/embed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatbotId: targetChatbotId, pages: [page] }),
      });
      const embedData = await embedRes.json();
      if (!embedRes.ok)
        throw new Error(embedData.error || "Failed to index page");

      // 4. Update UI
      setAddUrl("");
      fetchSources();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Data Sources</h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage the pages your chatbot is trained on.
        </p>
      </div>

      {/* Add URL */}
      <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-5 mb-6">
        <h2 className="text-sm font-semibold mb-3">Add a new page</h2>
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
            onClick={handleAddUrl}
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

      {/* Sources list */}
      <div className="bg-slate-800/50 border border-white/5 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h2 className="font-semibold text-sm">
            {sources.length} indexed pages
          </h2>
          <button
            onClick={fetchSources}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
        ) : sources.length === 0 ? (
          <div className="text-center py-16">
            <Globe className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-sm">No pages indexed yet.</p>
            <p className="text-slate-500 text-xs mt-1">
              Complete the onboarding to train your chatbot.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {sources.map((source) => (
              <div
                key={source.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-white/2 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    source.status === "indexed"
                      ? "bg-green-500/10"
                      : source.status === "failed"
                        ? "bg-red-500/10"
                        : "bg-yellow-500/10"
                  }`}
                >
                  {source.status === "indexed" ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : source.status === "failed" ? (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-yellow-400 animate-pulse" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">
                    {source.title || source.url}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {source.url}
                  </div>
                </div>
                <div className="text-xs text-slate-500 hidden sm:block">
                  {source.wordCount.toLocaleString()} words
                </div>
                <div className="text-xs text-slate-500 hidden md:block">
                  {formatDate(source.createdAt)}
                </div>
                <div
                  className={`hidden sm:flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                    source.status === "indexed"
                      ? "bg-green-500/10 text-green-400"
                      : source.status === "failed"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-yellow-500/10 text-yellow-400"
                  }`}
                >
                  {source.status}
                </div>
                <button
                  onClick={() => handleDelete(source.id)}
                  className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
