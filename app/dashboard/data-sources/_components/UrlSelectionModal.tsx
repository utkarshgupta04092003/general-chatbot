"use client";

import { CheckCircle, List, Loader2, ShieldAlert } from "lucide-react";
import { useEffect } from "react";

type UrlSelectionModalProps = {
  isOpen: boolean;
  scanning: boolean;
  discoveredUrls: string[];
  selectedUrls: string[];
  setSelectedUrls: (urls: string[]) => void;
  onClose: () => void;
  onConfirm: () => void;
  adding: boolean;
  error: string;
};

export function UrlSelectionModal({
  isOpen,
  scanning,
  discoveredUrls,
  selectedUrls,
  setSelectedUrls,
  onClose,
  onConfirm,
  adding,
  error,
}: UrlSelectionModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[85vh]"
      >
        <div className="p-6 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              {scanning ? (
                <Loader2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400 animate-spin" />
              ) : (
                <List className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              )}
            </div>
            <h2 className="text-xl font-bold text-foreground">
              {scanning ? "Scanning website pages..." : "Select Pages"}
            </h2>
          </div>
          <p className="text-muted-foreground text-sm">
            {scanning
              ? "We are automatically discovering pages on this domain..."
              : `Discovered ${discoveredUrls.length} pages. Select which ones to add.`}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {scanning ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <div className="w-12 h-12 rounded-full border-4 border-border border-t-indigo-500 animate-spin mb-4" />
              <p>Crawling domain, please wait...</p>
            </div>
          ) : error ? (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-sm">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Error</p>
                <p className="opacity-80">{error}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={
                      selectedUrls.length === discoveredUrls.length &&
                      discoveredUrls.length > 0
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUrls([...discoveredUrls]);
                      } else {
                        setSelectedUrls([]);
                      }
                    }}
                    className="w-4 h-4 rounded text-indigo-500 bg-muted border-border focus:ring-offset-slate-900 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-foreground select-none">
                    Select All
                  </span>
                </label>
                <span className="text-xs text-muted-foreground">
                  {selectedUrls.length} selected
                </span>
              </div>

              <div className="border border-border rounded-xl divide-y divide-white/5 overflow-hidden">
                {discoveredUrls.map((u) => (
                  <label
                    key={u}
                    className="flex items-center gap-3 p-3 hover:bg-accent/50 bg-muted/30 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUrls.includes(u)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUrls([...selectedUrls, u]);
                        } else {
                          setSelectedUrls(
                            selectedUrls.filter((sl) => sl !== u),
                          );
                        }
                      }}
                      className="w-4 h-4 rounded text-indigo-500 bg-muted border-border focus:ring-offset-slate-900 focus:ring-indigo-500"
                    />
                    <span
                      className="text-sm text-muted-foreground truncate w-full"
                      title={u}
                    >
                      {u}
                    </span>
                  </label>
                ))}
                {discoveredUrls.length === 0 && (
                  <div className="p-6 text-center text-muted-foreground text-sm">
                    No pages found. You can try adding the exact URL directly.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-border bg-card flex flex-col sm:flex-row gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:flex-1 py-2.5 hover:bg-accent/50 bg-muted/30 hover:bg-accent/50 text-foreground text-sm font-medium rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={adding || scanning || selectedUrls.length === 0}
            className="w-full sm:flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {adding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            {adding ? "Adding..." : "Add Selected Pages"}
          </button>
        </div>
      </div>
    </div>
  );
}
