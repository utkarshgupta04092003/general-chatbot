"use client";

import { Moon, Sun } from "lucide-react";
import { ChatbotSettings } from "./types";

type ThemeSectionProps = {
  selected: ChatbotSettings;
  onChange: (settings: ChatbotSettings) => void;
};

export function ThemeSection({ selected, onChange }: ThemeSectionProps) {
  const options = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="font-semibold mb-5">Widget Theme</h2>
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange({ ...selected, theme: option.value })}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md border-2 transition-all cursor-pointer ${
              selected.theme === option.value
                ? "bg-primary-subtle border-primary text-primary"
                : "bg-background border-transparent hover:border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <option.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{option.label}</span>
          </button>
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground mt-4 leading-relaxed">
        Choose between a light or dark theme for your chatbot widget. The theme
        applies to the entire internal UI of the chatbot.
      </p>
    </div>
  );
}
