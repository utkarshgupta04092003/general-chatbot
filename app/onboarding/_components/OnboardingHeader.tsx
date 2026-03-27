"use client";

import { Zap } from "lucide-react";

type OnboardingHeaderProps = {
  step: number;
  totalSteps: number;
};

export function OnboardingHeader({ step, totalSteps }: OnboardingHeaderProps) {
  return (
    <>
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" fill="white" />
          </div>
          <span className="font-bold">ChatBase</span>
        </div>
        <div className="text-sm text-slate-400">
          Step {step} of {totalSteps}
        </div>
      </div>

      <div className="w-full bg-slate-900 h-1">
        <div
          className="bg-gradient-to-r from-indigo-600 to-violet-600 h-1 transition-all duration-500"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>
    </>
  );
}
