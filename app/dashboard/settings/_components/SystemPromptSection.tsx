"use client";

import { ChatbotSettings } from "./types";

type SystemPromptSectionProps = {
  selected: ChatbotSettings;
  onChange: (settings: ChatbotSettings) => void;
};

export function SystemPromptSection({
  selected,
  onChange,
}: SystemPromptSectionProps) {
  return (
    <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
      <h2 className="font-semibold mb-2">System Prompt</h2>
      <p className="text-xs text-slate-500 mb-4">
        Custom instructions that guide the AI&apos;s behavior and responses.
      </p>
      <textarea
        value={selected.systemPrompt}
        onChange={(e) => onChange({ ...selected, systemPrompt: e.target.value })}
        rows={8}
        placeholder="You are a helpful assistant trained on [Company] documentation..."
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none font-mono"
      />
    </div>
  );
}
