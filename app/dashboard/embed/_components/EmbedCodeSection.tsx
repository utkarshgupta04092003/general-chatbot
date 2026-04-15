"use client";

import { Check, Copy } from "lucide-react";

type EmbedCodeSectionProps = {
  title: string;
  description: React.ReactNode;
  code: string;
  language: string;
  copied: boolean;
  onCopy: (text: string) => void;
  stepNumber: number;
};

export function EmbedCodeSection({
  title,
  description,
  code,
  language,
  copied,
  onCopy,
  stepNumber,
}: EmbedCodeSectionProps) {
  return (
    <div className="bg-muted/50 border border-border rounded-2xl p-4 sm:p-6 min-w-0">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 bg-indigo-500/10 rounded flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
          {stepNumber}
        </div>
        <h2 className="font-semibold truncate">{title}</h2>
      </div>
      <div className="text-sm text-muted-foreground mb-4">{description}</div>
      <div className="relative bg-card rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-muted/50 border-b border-border">
          <span className="text-xs text-muted-foreground font-mono">
            {language}
          </span>
          <button
            onClick={() => onCopy(code)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <pre className="p-4 text-xs sm:text-sm text-green-900 dark:text-green-400 font-mono overflow-x-auto scrollbar-hide">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
