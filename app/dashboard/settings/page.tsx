"use client";

import { CheckCircle, Loader2, Plus, Save, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { ENDPOINTS } from "@/lib/endpoint";

type ChatbotSettings = {
  id: string;
  name: string;
  welcomeMessage: string;
  tone: string;
  systemPrompt: string;
  primaryColor: string;
};

const TONE_OPTIONS = [
  { value: "professional", label: "Professional", desc: "Formal and precise" },
  { value: "friendly", label: "Friendly", desc: "Warm and approachable" },
  { value: "concise", label: "Concise", desc: "Short and to the point" },
  { value: "technical", label: "Technical", desc: "Detailed and expert" },
];

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
];

export default function ChatbotSettingsPage() {
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
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
              <h2 className="font-semibold mb-5">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Chatbot Name
                  </label>
                  <input
                    type="text"
                    value={selected.name}
                    onChange={(e) =>
                      setSelected({ ...selected, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Welcome Message
                  </label>
                  <textarea
                    value={selected.welcomeMessage}
                    onChange={(e) =>
                      setSelected({
                        ...selected,
                        welcomeMessage: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Tone */}
            <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
              <h2 className="font-semibold mb-5">Response Tone</h2>
              <div className="grid grid-cols-2 gap-3">
                {TONE_OPTIONS.map((tone) => (
                  <button
                    key={tone.value}
                    onClick={() =>
                      setSelected({ ...selected, tone: tone.value })
                    }
                    className={`text-left p-3 rounded-xl border transition-all ${
                      selected.tone === tone.value
                        ? "border-indigo-500 bg-indigo-500/10 text-white"
                        : "border-white/10 bg-white/3 text-slate-400 hover:text-white hover:border-white/20"
                    }`}
                  >
                    <div className="font-medium text-sm">{tone.label}</div>
                    <div className="text-xs opacity-70 mt-0.5">{tone.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
              <h2 className="font-semibold mb-5">Primary Color</h2>
              <div className="flex gap-3 flex-wrap">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() =>
                      setSelected({ ...selected, primaryColor: color })
                    }
                    className={`w-9 h-9 rounded-full transition-all ${
                      selected.primaryColor === color
                        ? "ring-2 ring-white ring-offset-2 ring-offset-slate-800 scale-110"
                        : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}

                {/* Custom Color Picker */}
                <div className="relative group">
                  <input
                    type="color"
                    id="custom-color"
                    value={selected.primaryColor}
                    onChange={(e) =>
                      setSelected({ ...selected, primaryColor: e.target.value })
                    }
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all bg-slate-800 border-2 border-white/10 group-hover:border-white/30 ${
                      !COLORS.includes(selected.primaryColor)
                        ? "ring-2 ring-white ring-offset-2 ring-offset-slate-800 scale-110 shadow-lg"
                        : ""
                    }`}
                    style={
                      !COLORS.includes(selected.primaryColor)
                        ? { backgroundColor: selected.primaryColor }
                        : {}
                    }
                  >
                    {!COLORS.includes(selected.primaryColor) ? (
                      <CheckCircle className="w-4 h-4 text-white drop-shadow-md" />
                    ) : (
                      <Plus className="w-4 h-4 text-slate-400 group-hover:text-white" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* System Prompt */}
            <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
              <h2 className="font-semibold mb-2">System Prompt</h2>
              <p className="text-xs text-slate-500 mb-4">
                Custom instructions that guide the AI&apos;s behavior and
                responses.
              </p>
              <textarea
                value={selected.systemPrompt}
                onChange={(e) =>
                  setSelected({ ...selected, systemPrompt: e.target.value })
                }
                rows={8}
                placeholder="You are a helpful assistant trained on [Company] documentation..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none font-mono"
              />
            </div>

            {/* Preview */}
            <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
              <h2 className="font-semibold mb-4">Widget Preview</h2>
              <div className="bg-slate-900 rounded-xl overflow-hidden border border-white/10">
                <div
                  className="px-4 py-3 flex items-center gap-2"
                  style={{ backgroundColor: selected.primaryColor }}
                >
                  <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-xs">
                    🤖
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {selected.name}
                    </div>
                    <div className="text-xs text-white/60 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />{" "}
                      Online
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="bg-slate-800 rounded-xl rounded-bl-none px-3 py-2 max-w-xs text-sm text-slate-300">
                    {selected.welcomeMessage}
                  </div>
                  <div className="flex justify-end">
                    <div
                      className="px-3 py-2 rounded-xl rounded-br-none text-sm text-white text-right max-w-xs"
                      style={{ backgroundColor: selected.primaryColor }}
                    >
                      How do I get started?
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving || !selected}
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
  );
}
