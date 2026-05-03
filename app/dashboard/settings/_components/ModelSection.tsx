"use client";

import { GEMINI_3_FLASH, MODEL_OPTIONS } from "@/lib/config";
import { Cpu } from "lucide-react";
import { ChatbotSettings } from "./types";

type ModelSectionProps = {
  selected: ChatbotSettings;
  onChange: (val: ChatbotSettings) => void;
};

export function ModelSection({ selected, onChange }: ModelSectionProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 transition-all">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center">
          <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h2 className="font-semibold">AI Model</h2>
          <p className="text-xs text-muted-foreground">
            Choose the model that generates responses.
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {MODEL_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange({ ...selected, model: opt.value })}
            className={`flex flex-col items-start gap-1 p-4 rounded-xl border text-left transition-all ${
              selected.model === opt.value
                ? "border-indigo-600 bg-indigo-600/5 ring-1 ring-indigo-600"
                : "border-border hover:border-accent hover:bg-accent/50"
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-medium text-sm">{opt.label}</span>
              {selected.model === opt.value && (
                <div className="w-2 h-2 rounded-full bg-indigo-600" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {opt.value === GEMINI_3_FLASH
                ? "Fast, efficient, and great for most common queries."
                : "More intelligent and capable of complex reasoning."}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
