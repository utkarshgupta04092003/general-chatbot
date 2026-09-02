"use client";

import { TONE_OPTIONS } from "@/lib/config";
import { ChatbotSettings } from "./types";

type ToneSectionProps = {
  selected: ChatbotSettings;
  onChange: (settings: ChatbotSettings) => void;
};

export function ToneSection({ selected, onChange }: ToneSectionProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="font-semibold mb-5">Response Tone</h2>
      <div className="grid grid-cols-2 gap-3">
        {TONE_OPTIONS.map((tone) => (
          <button
            key={tone.value}
            onClick={() => onChange({ ...selected, tone: tone.value })}
            className={`text-left p-3 rounded-md border transition-all ${
              selected.tone === tone.value
                ? "border-primary bg-primary text-white"
                : "border-border bg-muted/50 text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            <div className="font-medium text-sm">{tone.label}</div>
            <div className="text-xs opacity-70 mt-0.5">{tone.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
