"use client";

import { ChatbotSettings, TONE_OPTIONS } from "./types";

type ToneSectionProps = {
  selected: ChatbotSettings;
  onChange: (settings: ChatbotSettings) => void;
};

export function ToneSection({ selected, onChange }: ToneSectionProps) {
  return (
    <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
      <h2 className="font-semibold mb-5">Response Tone</h2>
      <div className="grid grid-cols-2 gap-3">
        {TONE_OPTIONS.map((tone) => (
          <button
            key={tone.value}
            onClick={() => onChange({ ...selected, tone: tone.value })}
            className={`text-left p-3 rounded-xl border transition-all ${
              selected.tone === tone.value
                ? "border-indigo-500 bg-indigo-500/10 text-white"
                : "border-white/10 bg-white/3 text-slate-400 hover:text-white hover:border-white/20"
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
