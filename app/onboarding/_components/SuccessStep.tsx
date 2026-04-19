import { ScrapedPage } from "@/lib/onboarding-types";
import { Flag } from "lucide-react";

type SuccessStepProps = {
  scrapedPages: ScrapedPage[];
  totalWords: number;
  chatbotId?: string;
};

export function SuccessStep({
  scrapedPages,
  totalWords,
  chatbotId,
}: SuccessStepProps) {
  const testUrl = chatbotId ? `/widget/${chatbotId}` : "#";

  return (
    <div className="animate-fade-in-up text-center">
      <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
        <span className="text-5xl">🎉</span>
        <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-ping opacity-20" />
      </div>
      <h1 className="text-4xl font-bold mb-3 text-foreground">
        Your chatbot is ready!
      </h1>
      <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto">
        Your AI chatbot has been trained and is ready to answer questions based
        on your content.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md mx-auto mb-10">
        {[
          {
            label: "Pages trained",
            value: scrapedPages.filter((p) => p.status !== "failed").length,
          },
          {
            label: "Words indexed",
            value: totalWords.toLocaleString(),
          },
          { label: "Status", value: "Live ✓" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href="/dashboard"
          className="flex items-center justify-center gap-2 px-8 py-3 hover:bg-accent/50 bg-muted/30 border border-border rounded-xl text-sm font-medium transition-all text-foreground cursor-pointer"
        >
          Go to Dashboard
        </a>
        <a
          href={testUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-medium transition-all text-white cursor-pointer"
        >
          <Flag className="w-4 h-4" />
          Test Chatbot
        </a>
      </div>
    </div>
  );
}
