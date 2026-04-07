"use client";

import { COLORS } from "@/lib/config";
import { CheckCircle, Plus } from "lucide-react";
import { ChatbotSettings } from "./types";

type ColorSectionProps = {
  selected: ChatbotSettings;
  onChange: (settings: ChatbotSettings) => void;
};

export function ColorSection({ selected, onChange }: ColorSectionProps) {
  return (
    <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
      <h2 className="font-semibold mb-5">Primary Color</h2>
      <div className="flex gap-3 flex-wrap">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => onChange({ ...selected, primaryColor: color })}
            className={`w-9 h-9 rounded-full transition-all ${
              selected.primaryColor === color
                ? "ring-2 ring-white ring-offset-2 ring-offset-slate-800 scale-110"
                : "hover:scale-105"
            }`}
            style={{ backgroundColor: color }}
          />
        ))}

        {/* Custom Color Picker */}
        <div className="relative group">
          <input
            type="color"
            id="custom-color"
            value={selected.primaryColor}
            onChange={(e) =>
              onChange({ ...selected, primaryColor: e.target.value })
            }
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all bg-slate-800 border-2 border-white/10 group-hover:border-white/30 ${
              !COLORS.includes(selected.primaryColor)
                ? "ring-2 ring-white ring-offset-2 ring-offset-slate-800 scale-110 shadow-lg"
                : ""
            }`}
            style={
              !COLORS.includes(selected.primaryColor)
                ? { backgroundColor: selected.primaryColor }
                : {}
            }
          >
            {!COLORS.includes(selected.primaryColor) ? (
              <CheckCircle className="w-4 h-4 text-white drop-shadow-md" />
            ) : (
              <Plus className="w-4 h-4 text-slate-400 group-hover:text-white" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
