"use client";

import { AlertCircle, ArrowLeft, CheckCircle, Sparkles } from "lucide-react";
import { useState } from "react";

import { ScrapedPage } from "@/lib/onboarding-types";

type PreviewStepProps = {
  scrapedPages: ScrapedPage[];
  totalWords: number;
  totalTokens: number;
  onBack: () => void;
  onTrain: () => void;
};

export function PreviewStep({
  scrapedPages,
  totalWords,
  totalTokens,
  onBack,
  onTrain,
}: PreviewStepProps) {
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const selectedPage = scrapedPages[selectedPageIndex] || scrapedPages[0];
  return (
    <div className="animate-fade-in-up">
      <h1 className="text-3xl font-bold mb-2 text-white">
        Data Extraction Preview
      </h1>
      <p className="text-slate-400 mb-8">
        Here&apos;s what we extracted from your website.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "Pages indexed",
            value: scrapedPages.filter((p) => p.status !== "failed").length,
          },
          { label: "Total words", value: totalWords.toLocaleString() },
          { label: "Est. tokens", value: totalTokens.toLocaleString() },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-900 border border-white/5 rounded-xl p-4 text-center"
          >
            <div className="text-2xl font-bold text-indigo-400">
              {stat.value}
            </div>
            <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden mb-6">
        <div className="px-5 py-3 border-b border-white/5 bg-slate-800/30 text-sm font-medium text-white">
          Extracted Pages
        </div>
        <div className="divide-y divide-white/5 max-h-60 overflow-y-auto">
          {scrapedPages.map((p, index) => (
            <button
              key={p.url}
              onClick={() => setSelectedPageIndex(index)}
              className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-white/5 ${
                selectedPageIndex === index ? "bg-indigo-500/10" : ""
              }`}
            >
              {p.status === "failed" ? (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              ) : (
                <CheckCircle
                  className={`w-4 h-4 shrink-0 ${
                    selectedPageIndex === index
                      ? "text-indigo-400"
                      : "text-green-400"
                  }`}
                />
              )}
              <div className="flex-1 min-w-0">
                <div
                  className={`text-sm truncate ${
                    selectedPageIndex === index
                      ? "text-indigo-300 font-medium"
                      : "text-slate-300"
                  }`}
                >
                  {p.title || p.url}
                </div>
                <div className="text-xs text-slate-500">
                  {p.wordCount} words · {p.url}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedPage && selectedPage.content && (
        <div className="bg-slate-900 border border-white/5 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-slate-500 uppercase tracking-wide">
              Content preview: {selectedPage.title || "Untitled Page"}
            </div>
            <div className="text-[10px] text-slate-600 font-mono">
              {selectedPage.wordCount} words
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-2">
            <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">
              {selectedPage.content}
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm transition-all text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={onTrain}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-medium transition-all text-white"
        >
          Train Chatbot <Sparkles className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
