"use client";

import { CheckCircle } from "lucide-react";

type Step = {
  id: number;
  label: string;
};

type StepIndicatorProps = {
  steps: Step[];
  currentStep: number;
};

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-4 py-6 px-4">
      {steps.map((s) => (
        <div key={s.id} className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              currentStep > s.id
                ? "bg-indigo-600 text-white"
                : currentStep === s.id
                  ? "bg-indigo-300/30 border-2 border-indigo-500 text-indigo-500"
                  : "bg-muted text-slate-600 border-2 border-grey-500"
            }`}
          >
            {currentStep > s.id ? <CheckCircle className="w-4 h-4" /> : s.id}
          </div>
          <span
            className={`text-xs hidden sm:block ${currentStep === s.id ? "text-foreground" : "text-slate-600"}`}
          >
            {s.label}
          </span>
          {s.id < steps.length && (
            <div className="w-8 h-px bg-muted hidden sm:block" />
          )}
        </div>
      ))}
    </div>
  );
}
