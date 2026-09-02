"use client";

import { ENDPOINTS } from "@/lib/endpoint";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  FileText,
  Loader2,
  RefreshCw,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type ResyncModalProps = {
  isOpen: boolean;
  onClose: () => void;
  dataSourceId: string;
  onSuccess: () => void;
};

type PreviewData = {
  url: string;
  title: string;
  content: string;
  oldContent: string;
};

export function ResyncModal({
  isOpen,
  onClose,
  dataSourceId,
  onSuccess,
}: ResyncModalProps) {
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [error, setError] = useState("");

  const fetchPreview = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(ENDPOINTS.DATA_SOURCE_RESYNC(dataSourceId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ previewOnly: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch preview");
      setPreview(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch preview");
    } finally {
      setLoading(false);
    }
  }, [dataSourceId]);

  useEffect(() => {
    if (isOpen && dataSourceId) {
      fetchPreview();
    } else {
      setPreview(null);
      setError("");
    }
  }, [isOpen, dataSourceId, fetchPreview]);

  async function handleUpdate() {
    setUpdating(true);
    setError("");
    try {
      const res = await fetch(ENDPOINTS.DATA_SOURCE_RESYNC(dataSourceId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ previewOnly: false }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update index");
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setUpdating(false);
    }
  }

  if (!isOpen) return null;

  const isContentChanged = preview && preview.content !== preview.oldContent;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-card border border-border rounded-lg shadow-e4 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card/50">
            <div className="flex items-center gap-2">
              <RefreshCw
                className={`w-5 h-5 text-primary dark:text-primary ${loading ? "animate-spin" : ""}`}
              />
              <h2 className="text-lg font-semibold text-foreground">
                Resync Data Source
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground bg-card border border-border rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground font-medium italic">
                  Refetching page content...
                </p>
                <p className="text-muted-foreground text-sm mt-1">
                  Downloading and cleaning latest HTML
                </p>
              </div>
            ) : error ? (
              <div className="p-4 bg-danger/10 border border-red-500/20 rounded-md flex gap-3 text-danger">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            ) : preview ? (
              <div className="space-y-6">
                <div className="p-4 bg-muted/50 rounded-md border border-border">
                  <div className="text-xs text-primary dark:text-primary font-mono mb-1 uppercase tracking-wider">
                    Source URL
                  </div>
                  <div className="text-sm text-foreground truncate font-medium">
                    {preview.url}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      New Content Preview
                    </div>
                    {isContentChanged ? (
                      <span className="text-[10px] bg-warning/10 text-warning px-2 py-0.5 rounded-full border border-amber-500/20">
                        Changes Detected
                      </span>
                    ) : (
                      <span className="text-[10px] bg-success/10 text-success px-2 py-0.5 rounded-full border border-green-500/20">
                        No Changes Found
                      </span>
                    )}
                  </div>
                  <div className="p-4 bg-background rounded-md border border-border h-64 overflow-y-auto text-xs text-muted-foreground leading-relaxed font-mono whitespace-pre-wrap">
                    {preview.content}
                  </div>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/10 rounded-md flex gap-3">
                  <CheckCircle className="w-5 h-5 text-primary dark:text-primary shrink-0" />
                  <div className="text-xs text-muted-foreground">
                    Updating the index will delete old vectors from Pinecone and
                    create{" "}
                    {Math.ceil(preview.content.split(/\s+/).length / 450)} new
                    semantic fragments.
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-background/50 border-t border-border flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={updating}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={loading || updating || !!error}
              className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-md text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-e2 shadow-e2"
            >
              {updating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating Index...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Update Index
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
