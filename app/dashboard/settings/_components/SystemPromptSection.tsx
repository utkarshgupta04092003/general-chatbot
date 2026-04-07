"use client";

import {
  AGENT_PROMPT_TEMPLATES,
  AGENT_TYPE_OPTIONS,
  DEFAULT_SYSTEM_PROMPT,
} from "@/lib/config";
import { ChatbotSettings } from "./types";

type SystemPromptSectionProps = {
  selected: ChatbotSettings;
  onChange: (settings: ChatbotSettings) => void;
};

export function SystemPromptSection({
  selected,
  onChange,
}: SystemPromptSectionProps) {
  const handleAgentTypeChange = (type: string) => {
    const template = AGENT_PROMPT_TEMPLATES[type] || "";
    onChange({
      ...selected,
      agentType: type,
      systemPrompt: template,
    });
  };

  return (
    <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-semibold mb-1">System Prompt</h2>
          <p className="text-xs text-slate-500">
            Custom instructions that guide the AI&apos;s behavior and responses.
          </p>
        </div>
        <div className="flex flex-col gap-1.5 flex-1 max-w-[240px]">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 ml-1">
            Agent Role
          </label>
          <select
            value={selected.agentType || "general"}
            onChange={(e) => handleAgentTypeChange(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer hover:bg-white/10"
          >
            {AGENT_TYPE_OPTIONS.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-slate-900 text-white"
              >
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <textarea
        value={selected.systemPrompt}
        onChange={(e) =>
          onChange({ ...selected, systemPrompt: e.target.value })
        }
        rows={20}
        placeholder={
          DEFAULT_SYSTEM_PROMPT.split("\n").slice(0, 5).join("\n") + "..."
        }
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none font-mono"
      />
    </div>
  );
}
