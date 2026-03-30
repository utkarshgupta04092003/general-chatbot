"use client";

import { formatDate } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Globe,
  Loader2,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { DataSource } from "./types";

type DataSourcesListProps = {
  sources: DataSource[];
  loading: boolean;
  selectedChatbotId: string;
  verifiedDomains: string[];
  onRefresh: () => void;
  onDelete: (id: string) => void;
  onResync: (id: string) => void;
};

export function DataSourcesList({
  sources,
  loading,
  selectedChatbotId,
  verifiedDomains,
  onRefresh,
  onDelete,
  onResync,
}: DataSourcesListProps) {
  const filteredSources = sources.filter(
    (s) => selectedChatbotId === "all" || s.chatbotId === selectedChatbotId,
  );

  const indexedCount = filteredSources.filter(
    (s) => s.status === "indexed",
  ).length;

  return (
    <div className="bg-slate-800/50 border border-white/5 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <h2 className="font-semibold text-sm">{indexedCount} indexed pages</h2>
        <button
          onClick={onRefresh}
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
      ) : filteredSources.length === 0 ? (
        <div className="text-center py-16">
          <Globe className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-sm">No pages indexed yet.</p>
          <p className="text-slate-500 text-xs mt-1">
            Complete the onboarding to train your chatbot.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {filteredSources.map((source) => (
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
                <div className="flex items-center gap-2 text-xs text-slate-500 truncate">
                  {source.url}
                  {verifiedDomains.includes(new URL(source.url).hostname) && (
                    <span className="flex items-center gap-0.5 text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded-md font-medium">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                  {selectedChatbotId === "all" && (
                    <span className="flex items-center gap-1.5 text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-white/5">
                      <Plus className="w-2.5 h-2.5 rotate-45" />
                      {source.chatbot.name}
                    </span>
                  )}
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
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onResync(source.id)}
                  title="Resync Page Content"
                  className="p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(source.id)}
                  title="Remove Page"
                  className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
