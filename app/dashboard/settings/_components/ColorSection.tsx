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
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="font-semibold mb-5">Primary Color</h2>
      <div className="flex gap-3 flex-wrap">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => onChange({ ...selected, primaryColor: color })}
            className={`w-9 h-9 rounded-full transition-all ${
              selected.primaryColor === color
                ? "ring-2 ring-foreground/60 ring-offset-2 ring-offset-background scale-110"
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
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all bg-muted border-2 border-border group-hover:border-border ${
              !COLORS.includes(selected.primaryColor)
                ? "ring-2 ring-foreground/60 ring-offset-2 ring-offset-background scale-110 shadow-e2"
                : ""
            }`}
            style={
              !COLORS.includes(selected.primaryColor)
                ? { backgroundColor: selected.primaryColor }
                : {}
            }
          >
            {!COLORS.includes(selected.primaryColor) ? (
              <CheckCircle className="w-4 h-4 text-foreground drop-shadow-e2" />
            ) : (
              <Plus className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
