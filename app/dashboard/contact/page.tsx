"use client";

import { ANALYTICS_EVENTS } from "@/lib/config";
import { ENDPOINTS } from "@/lib/endpoint";
import { CheckCircle, Loader2, MessageCircle, Save } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { useEffect, useState } from "react";

import { ContactInfoSection } from "../settings/_components/ContactInfoSection";
import { ChatbotSettings } from "../settings/_components/types";

export default function ContactSettingsPage() {
  const posthog = usePostHog();
  const [chatbots, setChatbots] = useState<ChatbotSettings[]>([]);
  const [selected, setSelected] = useState<ChatbotSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(ENDPOINTS.CHATBOTS)
      .then((r) => r.json())
      .then((d) => {
        setChatbots(d.chatbots ?? []);
        if (d.chatbots?.length > 0) setSelected(d.chatbots[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    if (!selected) return;
    setSaving(true);
    try {
      await fetch(ENDPOINTS.CHATBOT_BY_ID(selected.id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selected),
      });

      posthog.capture(ANALYTICS_EVENTS.CHATBOT_SETTINGS_UPDATED, {
        chatbotId: selected.id,
        context: "contact_page",
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
      </div>
    );

  if (chatbots.length === 0)
    return (
      <div className="text-center py-20">
        <MessageCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h3 className="font-semibold text-muted-foreground mb-2">
          No chatbots yet
        </h3>
        <p className="text-muted-foreground text-sm">
          Create a chatbot first to configure its fallback contact options.
        </p>
      </div>
    );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Fallback Contact Options</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Configure what information is shown to users when the AI assistant
          cannot answer their query.
        </p>
      </div>

      {chatbots.length > 1 && (
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
          {chatbots.map((bot) => (
            <button
              key={bot.id}
              onClick={() => setSelected(bot)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all shrink-0 cursor-pointer whitespace-nowrap ${
                selected?.id === bot.id
                  ? "bg-indigo-600 text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {bot.name}
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="max-w-4xl">
          <ContactInfoSection selected={selected} onChange={setSelected} />

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-xl transition-all"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saved ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
