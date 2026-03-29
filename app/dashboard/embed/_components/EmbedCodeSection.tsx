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
    <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 bg-indigo-500/10 rounded flex items-center justify-center text-xs font-bold text-indigo-400">
          {stepNumber}
        </div>
        <h2 className="font-semibold">{title}</h2>
      </div>
      <div className="text-sm text-slate-400 mb-4">{description}</div>
      <div className="relative bg-slate-900 rounded-xl border border-white/5 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-white/5">
          <span className="text-xs text-slate-400 font-mono">{language}</span>
          <button
            onClick={() => onCopy(code)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <pre className="p-4 text-sm text-green-300 font-mono overflow-x-auto">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
