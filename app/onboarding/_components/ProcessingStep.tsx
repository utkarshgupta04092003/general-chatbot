"use client";

import { CheckCircle, Loader2, LucideIcon, Sparkles } from "lucide-react";

type ProcessingStepItem = {
  label: string;
  icon: LucideIcon;
  delay: number;
};

type ProcessingStepProps = {
  processStep: number;
  processingSteps: ProcessingStepItem[];
};

export function ProcessingStep({
  processStep,
  processingSteps,
}: ProcessingStepProps) {
  return (
    <div className="animate-fade-in-up text-center">
      <div className="w-20 h-20 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
        <Sparkles className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
        <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
      <h1 className="text-3xl font-bold mb-2 text-foreground">
        Training your chatbot...
      </h1>
      <p className="text-muted-foreground mb-12">
        This takes about 30 seconds. Please don&apos;t close this tab.
      </p>

      <div className="max-w-sm mx-auto space-y-4 text-left mb-8">
        {processingSteps.map((s, i) => (
          <div
            key={s.label}
            className={`flex items-center gap-4 transition-all duration-300 ${
              i < processStep
                ? "opacity-100"
                : i === processStep
                  ? "opacity-100"
                  : "opacity-30"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                i < processStep
                  ? "bg-green-500"
                  : i === processStep
                    ? "bg-indigo-600"
                    : "bg-accent"
              }`}
            >
              {i < processStep ? (
                <CheckCircle className="w-4 h-4 text-white" />
              ) : i === processStep ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <div className="w-2 h-2 bg-slate-500 rounded-full" />
              )}
            </div>
            <span
              className={`text-sm ${i <= processStep ? "text-foreground" : "text-muted-foreground"}`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="max-w-sm mx-auto bg-muted rounded-full h-2">
        <div
          className="bg-gradient-to-r from-indigo-600 to-violet-600 h-2 rounded-full transition-all duration-500"
          style={{
            width: `${Math.min((processStep / processingSteps.length) * 100, 100)}%`,
          }}
        />
      </div>
      <div className="text-sm text-muted-foreground mt-3">
        {Math.round(
          Math.min((processStep / processingSteps.length) * 100, 100),
        )}
        % complete
      </div>
    </div>
  );
}
