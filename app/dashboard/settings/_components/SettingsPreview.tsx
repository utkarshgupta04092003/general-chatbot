"use client";

import { FEEDBACK_TEXT } from "@/lib/config";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { ChatbotSettings } from "./types";

type SettingsPreviewProps = {
  selected: ChatbotSettings;
};

export function SettingsPreview({ selected }: SettingsPreviewProps) {
  return (
    <div className="bg-muted/50 border border-border rounded-2xl p-6">
      <h2 className="font-semibold mb-4">Widget Preview</h2>
      <div
        className={`rounded-xl overflow-hidden border border-border transition-colors ${selected.theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white"}`}
      >
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
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-foreground shrink-0 overflow-hidden relative"
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
            <div
              className={`rounded-xl rounded-bl-none px-3 py-2 max-w-[80%] text-sm transition-colors ${selected.theme === "dark" ? "bg-slate-800 text-slate-200" : "bg-muted text-muted-foreground"}`}
            >
              <div>{selected.welcomeMessage}</div>
              <div
                className={`flex items-center gap-1.5 mt-2 pt-1 border-t opacity-40 ${selected.theme === "dark" ? "border-slate-700" : "border-border"}`}
              >
                <div title={FEEDBACK_TEXT.HELPFUL}>
                  <ThumbsUp className="w-3 h-3" />
                </div>
                <div title={FEEDBACK_TEXT.UNHELPFUL}>
                  <ThumbsDown className="w-3 h-3" />
                </div>
              </div>
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
