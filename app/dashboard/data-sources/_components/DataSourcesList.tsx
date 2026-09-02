"use client";

import { formatDate } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
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
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h2 className="font-semibold text-sm">{indexedCount} indexed pages</h2>
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-primary dark:text-primary animate-spin" />
        </div>
      ) : filteredSources.length === 0 ? (
        <div className="text-center py-16">
          <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">No pages indexed yet.</p>
          <p className="text-muted-foreground text-xs mt-1">
            Complete the onboarding to train your chatbot.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          {filteredSources.map((source) => (
            <div
              key={source.id}
              className="flex items-center gap-4 px-5 py-4 hover:bg-white/2 transition-colors min-w-0 overflow-hidden"
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  source.status === "indexed"
                    ? "bg-success/10"
                    : source.status === "failed"
                      ? "bg-danger/10"
                      : "bg-warning-subtle"
                }`}
              >
                {source.status === "indexed" ? (
                  <CheckCircle className="w-4 h-4 text-success" />
                ) : source.status === "failed" ? (
                  <AlertCircle className="w-4 h-4 text-danger" />
                ) : (
                  <Clock className="w-4 h-4 text-warning animate-pulse" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  {source.title || source.url}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
                  {source.url.startsWith("manual-") ? (
                    <span className="flex items-center gap-1 text-slate-500">
                      <FileText className="w-3 h-3" />
                      Manual Upload
                    </span>
                  ) : (
                    <>
                      {source.url}
                      {verifiedDomains.includes(
                        new URL(source.url).hostname,
                      ) && (
                        <span className="flex items-center gap-0.5 text-primary dark:text-primary bg-primary-subtle px-1.5 py-0.5 rounded-md font-medium shrink-0">
                          <ShieldCheck className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </>
                  )}
                  {selectedChatbotId === "all" && (
                    <span className="flex items-center gap-1.5 text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border max-w-[120px] sm:max-w-[180px] truncate shrink-0">
                      <Plus className="w-2.5 h-2.5 rotate-45 shrink-0" />
                      {source.chatbot.name}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-xs text-muted-foreground hidden xl:block whitespace-nowrap shrink-0">
                {source.wordCount.toLocaleString()} words
              </div>
              <div className="text-xs text-muted-foreground hidden 2xl:block whitespace-nowrap shrink-0">
                {formatDate(source.createdAt)}
              </div>
              <div
                className={`hidden xl:flex items-center gap-1 px-2 py-1 rounded-full text-xs shrink-0 ${
                  source.status === "indexed"
                    ? "bg-success/10 text-success"
                    : source.status === "failed"
                      ? "bg-danger/10 text-danger"
                      : "bg-warning-subtle text-warning"
                }`}
              >
                {source.status}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {!source.url.startsWith("manual-") && (
                  <button
                    onClick={() => onResync(source.id)}
                    title="Resync Page Content"
                    className="p-1.5 text-muted-foreground hover:text-primary dark:text-primary hover:bg-primary-subtle rounded-lg transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => onDelete(source.id)}
                  title="Remove Page"
                  className="p-1.5 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-lg transition-all cursor-pointer"
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
