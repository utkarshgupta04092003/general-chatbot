import { AddChatbotButton } from "@/components/AddChatbotButton";
import { Plus, Zap } from "lucide-react";

interface NoChatbotEmptyStateProps {
  title?: string;
  description?: string;
}

export function NoChatbotEmptyState({
  title = "No chatbots yet",
  description = "Create a chatbot first.",
}: NoChatbotEmptyStateProps) {
  return (
    <div className="text-center py-20 bg-card border border-border rounded-lg">
      <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="font-semibold text-muted-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-6">{description}</p>
      <AddChatbotButton className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-md transition-all cursor-pointer">
        <Plus className="w-4 h-4" />
        Add Chatbot
      </AddChatbotButton>
    </div>
  );
}
