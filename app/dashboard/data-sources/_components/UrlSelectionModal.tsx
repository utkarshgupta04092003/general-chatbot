"use client";

import { CheckCircle, List, Loader2, ShieldAlert } from "lucide-react";

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[85vh]">
        <div className="p-6 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              {scanning ? (
                <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
              ) : (
                <List className="w-6 h-6 text-indigo-400" />
              )}
            </div>
            <h2 className="text-xl font-bold text-white">
              {scanning ? "Scanning website pages..." : "Select Pages"}
            </h2>
          </div>
          <p className="text-slate-400 text-sm">
            {scanning
              ? "We are automatically discovering pages on this domain..."
              : `Discovered ${discoveredUrls.length} pages. Select which ones to add.`}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {scanning ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-indigo-500 animate-spin mb-4" />
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
                    className="w-4 h-4 rounded text-indigo-500 bg-slate-800 border-white/10 focus:ring-offset-slate-900 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-white select-none">
                    Select All
                  </span>
                </label>
                <span className="text-xs text-slate-500">
                  {selectedUrls.length} selected
                </span>
              </div>

              <div className="border border-white/5 rounded-xl divide-y divide-white/5 overflow-hidden">
                {discoveredUrls.map((u) => (
                  <label
                    key={u}
                    className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUrls.includes(u)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUrls([...selectedUrls, u]);
                        } else {
                          setSelectedUrls(selectedUrls.filter((sl) => sl !== u));
                        }
                      }}
                      className="w-4 h-4 rounded text-indigo-500 bg-slate-800 border-white/10 focus:ring-offset-slate-900 focus:ring-indigo-500"
                    />
                    <span
                      className="text-sm text-slate-300 truncate w-full"
                      title={u}
                    >
                      {u}
                    </span>
                  </label>
                ))}
                {discoveredUrls.length === 0 && (
                  <div className="p-6 text-center text-slate-500 text-sm">
                    No pages found. You can try adding the exact URL
                    directly.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-white/5 bg-slate-900 flex gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={adding || scanning || selectedUrls.length === 0}
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2"
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
