"use client";

import { ENDPOINTS } from "@/lib/endpoint";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

type ChatbotOption = {
  id: string;
  name: string;
};

type SelectChatbotModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (chatbotId: string) => void;
};

export function SelectChatbotModal({
  isOpen,
  onClose,
  onSelect,
}: SelectChatbotModalProps) {
  const [chatbots, setChatbots] = useState<ChatbotOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [prevOpen, setPrevOpen] = useState(isOpen);

  if (isOpen !== prevOpen) {
    setPrevOpen(isOpen);
    if (isOpen) {
      setLoading(true);
      setChatbots([]);
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      fetch(ENDPOINTS.CHATBOTS)
        .then((res) => res.json())
        .then((data) => {
          setChatbots(data.chatbots || []);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-lg w-full max-w-sm overflow-hidden shadow-e4 animate-in fade-in zoom-in duration-200"
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-semibold text-foreground">
            Select Target Chatbot
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-accent/50 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 max-h-[300px] overflow-y-auto">
          {loading ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Loading chatbots...
            </div>
          ) : chatbots.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No chatbots found. Please create one first.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {chatbots.map((bot) => (
                <button
                  key={bot.id}
                  onClick={() => onSelect(bot.id)}
                  className="px-4 py-3 bg-muted/50 hover:bg-primary-subtle border border-border hover:border-primary/30 rounded-md text-sm font-medium text-left transition-all text-foreground"
                >
                  {bot.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
