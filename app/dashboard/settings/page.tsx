"use client";

import { NoChatbotEmptyState } from "@/components/dashboard/NoChatbotEmptyState";
import { PageHeader } from "@/components/ui";
import { ANALYTICS_EVENTS } from "@/lib/config";
import { ENDPOINTS } from "@/lib/endpoint";
import { CheckCircle, Loader2, Save, Trash2 } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { useEffect, useState } from "react";

import { BasicInfoSection } from "./_components/BasicInfoSection";
import { ColorSection } from "./_components/ColorSection";
import { ModelSection } from "./_components/ModelSection";
import { SettingsPreview } from "./_components/SettingsPreview";
import { SystemPromptSection } from "./_components/SystemPromptSection";
import { ThemeSection } from "./_components/ThemeSection";
import { ToneSection } from "./_components/ToneSection";
import { ChatbotSettings } from "./_components/types";

export default function ChatbotSettingsPage() {
  const posthog = usePostHog();
  const [chatbots, setChatbots] = useState<ChatbotSettings[]>([]);
  const [selected, setSelected] = useState<ChatbotSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    posthog.capture(ANALYTICS_EVENTS.SETTINGS_VIEWED);
  }, [posthog]);

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
        name: selected.name,
        systemPrompt: selected.systemPrompt,
        welcomeMessage: selected.welcomeMessage,
        tone: selected.tone,
        primaryColor: selected.primaryColor,
        agentType: selected.agentType,
        hasSupportEmail: !!selected.supportEmail,
        hasSupportPhone: !!selected.supportPhone,
        hasSupportWhatsapp: !!selected.supportWhatsapp,
        hasContactPage: !!selected.contactPageLink,
        theme: selected.theme,
        model: selected.model,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!selected) return;
    if (
      !confirm(
        "Are you sure you want to delete this chatbot? This action cannot be undone.",
      )
    )
      return;

    setIsDeleting(true);
    try {
      const res = await fetch(ENDPOINTS.CHATBOT_BY_ID(selected.id), {
        method: "DELETE",
      });
      if (res.ok) {
        setChatbots((prev) => prev.filter((c) => c.id !== selected.id));
        setSelected(null);
      } else {
        alert("Failed to delete chatbot.");
      }
    } catch {
      alert("Failed to delete chatbot.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <PageHeader title="Chatbot Settings" description={"Customize how your chatbot looks and behaves."} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary dark:text-primary animate-spin" />
        </div>
      ) : chatbots.length === 0 ? (
        <NoChatbotEmptyState description="Create a chatbot first to configure its settings." />
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
            <>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <BasicInfoSection
                    selected={selected}
                    onChange={setSelected}
                  />
                  <ToneSection selected={selected} onChange={setSelected} />
                  <ColorSection selected={selected} onChange={setSelected} />
                  <ThemeSection selected={selected} onChange={setSelected} />
                  <ModelSection selected={selected} onChange={setSelected} />
                </div>

                <div className="space-y-6">
                  <SystemPromptSection
                    selected={selected}
                    onChange={setSelected}
                  />
                  <SettingsPreview selected={selected} />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border pt-6">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-2 px-6 py-3 bg-danger/10 hover:bg-danger/20 text-danger disabled:opacity-50 font-medium rounded-md transition-all"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  {isDeleting ? "Deleting..." : "Delete Chatbot"}
                </button>

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
            </>
          )}
        </>
      )}
    </div>
  );
}
