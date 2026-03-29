"use client";

import { ChatbotSettings } from "./types";

type BasicInfoSectionProps = {
  selected: ChatbotSettings;
  onChange: (settings: ChatbotSettings) => void;
};

export function BasicInfoSection({
  selected,
  onChange,
}: BasicInfoSectionProps) {
  return (
    <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
      <h2 className="font-semibold mb-5">Basic Information</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Chatbot Name
          </label>
          <input
            type="text"
            value={selected.name}
            onChange={(e) => onChange({ ...selected, name: e.target.value })}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Welcome Message
          </label>
          <textarea
            value={selected.welcomeMessage}
            onChange={(e) =>
              onChange({ ...selected, welcomeMessage: e.target.value })
            }
            rows={3}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
          />
        </div>
      </div>
    </div>
  );
}
