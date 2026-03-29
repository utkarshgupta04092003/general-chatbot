"use client";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckSquare,
  Globe,
  Loader2,
  RefreshCw,
  Square,
} from "lucide-react";

type PageSelectionStepProps = {
  crawledUrls: string[];
  selectedUrls: Set<string>;
  toggleUrl: (url: string) => void;
  setSelectedUrls: (urls: Set<string>) => void;
  onBack: () => void;
  onContinue: () => void;
  loading: boolean;
  onRescan: () => void;
  error: string;
  domain: string;
};

export function PageSelectionStep({
  crawledUrls,
  selectedUrls,
  toggleUrl,
  setSelectedUrls,
  onBack,
  onContinue,
  loading,
  onRescan,
  error,
  domain,
}: PageSelectionStepProps) {
  return (
    <div className="animate-fade-in-up">
      <h1 className="text-3xl font-bold mb-2">
        {loading ? `Scanning ${domain}...` : "Select pages to train on"}
      </h1>
      <p className="text-slate-400 mb-8">
        {loading
          ? `We are automatically discovering pages on ${domain}. This might take a few seconds.`
          : `We found ${crawledUrls.length} pages. Select which ones to include.`}
      </p>

      {error && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl mb-6">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden mb-6 min-h-[300px] flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
            <p className="text-lg font-medium text-white mb-2">
              {`Scanning ${domain}...`}
            </p>
            <p className="text-sm text-center max-w-xs transition-opacity duration-1000 opacity-80 backdrop-blur-sm animate-pulse">
              This usually takes less than 30 seconds depending on website size.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-slate-800/50">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  {selectedUrls.size} of {crawledUrls.length} selected
                </span>
                <button
                  onClick={onRescan}
                  disabled={loading}
                  className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  title="Rescan website"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
                  />
                  Rescan
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedUrls(new Set(crawledUrls))}
                  className="text-xs text-indigo-400 hover:text-indigo-300"
                >
                  Select all
                </button>
                <button
                  onClick={() => setSelectedUrls(new Set())}
                  className="text-xs text-slate-500 hover:text-slate-300"
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
              {crawledUrls.map((u) => (
                <label
                  key={u}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/3 cursor-pointer transition-colors"
                >
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      toggleUrl(u);
                    }}
                    className="shrink-0"
                  >
                    {selectedUrls.has(u) ? (
                      <CheckSquare className="w-5 h-5 text-indigo-400" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-600" />
                    )}
                  </div>
                  <Globe className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="text-sm text-slate-300 truncate">{u}</span>
                </label>
              ))}
              {crawledUrls.length === 0 && (
                <div className="p-12 text-center text-slate-500 italic">
                  No pages discovered. Try going back and checking the URL.
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm transition-all text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={onContinue}
          disabled={loading || selectedUrls.size === 0}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl text-sm font-medium transition-all text-white"
        >
          {loading ? "Discovering..." : "Continue"}{" "}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
