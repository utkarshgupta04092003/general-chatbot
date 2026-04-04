"use client";

import { CheckCircle, Loader2, Save, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { ANALYTICS_EVENTS } from "@/lib/config";
import { usePostHog } from "posthog-js/react";
import { ENDPOINTS } from "@/lib/endpoint";

import { ChatbotSettings } from "./_components/types";
import { BasicInfoSection } from "./_components/BasicInfoSection";
import { ToneSection } from "./_components/ToneSection";
import { ColorSection } from "./_components/ColorSection";
import { SystemPromptSection } from "./_components/SystemPromptSection";
import { SettingsPreview } from "./_components/SettingsPreview";

export default function ChatbotSettingsPage() {
  const posthog = usePostHog();
  const [chatbots, setChatbots] = useState<ChatbotSettings[]>([]);
  const [selected, setSelected] = useState<ChatbotSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

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
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );

  if (chatbots.length === 0)
    return (
      <div className="text-center py-20">
        <Settings className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h3 className="font-semibold text-slate-300 mb-2">No chatbots yet</h3>
        <p className="text-slate-500 text-sm">
          Create a chatbot first to configure its settings.
        </p>
      </div>
    );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Chatbot Settings</h1>
        <p className="text-slate-400 text-sm mt-1">
          Customize how your chatbot looks and behaves.
        </p>
      </div>

      {chatbots.length > 1 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {chatbots.map((bot) => (
            <button
              key={bot.id}
              onClick={() => setSelected(bot)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selected?.id === bot.id
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
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
              <BasicInfoSection selected={selected} onChange={setSelected} />
              <ToneSection selected={selected} onChange={setSelected} />
              <ColorSection selected={selected} onChange={setSelected} />
            </div>

            <div className="space-y-6">
              <SystemPromptSection selected={selected} onChange={setSelected} />
              <SettingsPreview selected={selected} />
            </div>
          </div>

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
        </>
      )}
    </div>
  );
}
