"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";

type PermissionStepProps = {
  selectedUrls: Set<string>;
  onScrape: () => void;
  onBack: () => void;
  loading: boolean;
};

export function PermissionStep({
  selectedUrls,
  onScrape,
  onBack,
  loading,
}: PermissionStepProps) {
  return (
    <div className="animate-fade-in-up">
      <h1 className="text-3xl font-bold mb-2">Review & Confirm</h1>
      <p className="text-muted-foreground mb-8">
        Please confirm before we extract content from the selected pages.
      </p>

      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="font-semibold mb-1 text-foreground">
              Data Extraction Notice
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We will extract text content from{" "}
              <strong className="text-foreground">
                {selectedUrls.size} selected pages
              </strong>{" "}
              to train your AI chatbot. Only publicly accessible text content
              will be extracted. We respect robots.txt and privacy guidelines.
            </p>
          </div>
        </div>
        {[
          "Only public page content will be used",
          "No personal data or forms will be collected",
          "Content is stored securely and privately",
          "You can delete your data anytime",
        ].map((point) => (
          <div key={point} className="flex items-center gap-2 py-1.5">
            <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
            <span className="text-sm text-muted-foreground">{point}</span>
          </div>
        ))}
      </div>

      <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 text-sm text-indigo-300 mb-6">
        <strong>Pages to be indexed:</strong>
        <ul className="mt-2 space-y-1">
          {Array.from(selectedUrls)
            .slice(0, 3)
            .map((u) => (
              <li key={u} className="text-muted-foreground truncate">
                • {u}
              </li>
            ))}
          {selectedUrls.size > 3 && (
            <li className="text-muted-foreground">
              + {selectedUrls.size - 3} more
            </li>
          )}
        </ul>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 hover:bg-accent/50 bg-muted/30 hover:bg-accent/50 border border-border rounded-xl text-sm transition-all text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel
        </button>
        <button
          onClick={onScrape}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl text-sm font-medium transition-all text-white"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Extracting...
            </>
          ) : (
            <>
              Allow & Continue <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
