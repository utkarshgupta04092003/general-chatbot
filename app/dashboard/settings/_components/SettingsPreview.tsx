"use client";

import { ChatbotSettings } from "./types";
import Image from "next/image";

type SettingsPreviewProps = {
  selected: ChatbotSettings;
};

export function SettingsPreview({ selected }: SettingsPreviewProps) {
  return (
    <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
      <h2 className="font-semibold mb-4">Widget Preview</h2>
      <div className="bg-slate-900 rounded-xl overflow-hidden border border-white/10">
        <div
          className="px-4 py-3 flex items-center gap-3"
          style={{ backgroundColor: selected.primaryColor }}
        >
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-xs overflow-hidden relative">
            {selected.websiteLogo ? (
              <Image
                src={selected.websiteLogo}
                alt="Logo"
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              "🤖"
            )}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              {selected.name}
            </div>
            <div className="text-xs text-white/60 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full" /> Online
            </div>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white shrink-0 overflow-hidden relative"
              style={{ backgroundColor: selected.primaryColor }}
            >
              {selected.assistantLogo ? (
                <Image
                  src={selected.assistantLogo}
                  alt="Bot"
                  fill
                  className="object-cover"
                />
              ) : (
                "🤖"
              )}
            </div>
            <div className="bg-slate-800 rounded-xl rounded-bl-none px-3 py-2 max-w-[80%] text-sm text-slate-300">
              {selected.welcomeMessage}
            </div>
          </div>
          <div className="flex justify-end">
            <div
              className="px-3 py-2 rounded-xl rounded-br-none text-sm text-white text-right max-w-xs"
              style={{ backgroundColor: selected.primaryColor }}
            >
              How do I get started?
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
