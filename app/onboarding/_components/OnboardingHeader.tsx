"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { APP_NAME } from "@/lib/config";
import { Bot } from "lucide-react";

type OnboardingHeaderProps = {
  step: number;
  totalSteps: number;
};

export function OnboardingHeader({ step, totalSteps }: OnboardingHeaderProps) {
  return (
    <>
      <div className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            {APP_NAME}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            Step {step} of {totalSteps}
          </span>
          <ThemeToggle />
        </div>
      </div>

      <div className="w-full bg-card h-1">
        <div
          className="bg-gradient-to-r from-indigo-600 to-violet-600 h-1 transition-all duration-500"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>
    </>
  );
}
