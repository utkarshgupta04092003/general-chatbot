import { Plus, Zap } from "lucide-react";
import Link from "next/link";

interface NoChatbotEmptyStateProps {
  title?: string;
  description?: string;
}

export function NoChatbotEmptyState({
  title = "No chatbots yet",
  description = "Create a chatbot first.",
}: NoChatbotEmptyStateProps) {
  return (
    <div className="text-center py-20 bg-muted/30 border border-border rounded-2xl">
      <Zap className="w-12 h-12 text-slate-600 mx-auto mb-4" />
      <h3 className="font-semibold text-muted-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-6">{description}</p>
      <Link
        href="/onboarding"
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-all"
      >
        <Plus className="w-4 h-4" />
        Add Chatbot
      </Link>
    </div>
  );
}
