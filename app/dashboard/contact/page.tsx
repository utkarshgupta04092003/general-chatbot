"use client";

import { NoChatbotEmptyState } from "@/components/dashboard/NoChatbotEmptyState";
import { PageHeader } from "@/components/ui";
import { ANALYTICS_EVENTS } from "@/lib/config";
import { ENDPOINTS } from "@/lib/endpoint";
import { CheckCircle, Loader2, Save } from "lucide-react";
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

  return (
    <div>
      <div className="mb-8">
        <PageHeader title="Fallback Contact Options" description={"Configure what information is shown to users when the AI assistant cannot answer their query."} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary dark:text-primary animate-spin" />
        </div>
      ) : chatbots.length === 0 ? (
        <NoChatbotEmptyState description="Create a chatbot first to configure its fallback contact options." />
      ) : (
        <>
          {chatbots.length > 1 && (
            <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
              {chatbots.map((bot) => (
                <button
                  key={bot.id}
                  onClick={() => setSelected(bot)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all shrink-0 cursor-pointer whitespace-nowrap ${
                    selected?.id === bot.id
                      ? "bg-primary text-white"
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
                  className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-medium rounded-md transition-all"
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
        </>
      )}
    </div>
  );
}
