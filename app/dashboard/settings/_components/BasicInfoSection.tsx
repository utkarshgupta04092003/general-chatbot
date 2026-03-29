"use client";

import { getDomain, getSafeFolder } from "@/lib/utils";
import { Globe, Loader2, Upload, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { ChatbotSettings } from "./types";

type BasicInfoSectionProps = {
  selected: ChatbotSettings;
  onChange: (settings: ChatbotSettings) => void;
};

export function BasicInfoSection({
  selected,
  onChange,
}: BasicInfoSectionProps) {
  const [uploading, setUploading] = useState<"assistant" | "website" | null>(
    null,
  );

  async function handleLogoUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    type: "assistant" | "website",
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(type);
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Extract domain from first data source or fallback to sanitized name
      const domainUrl = selected.dataSources?.[0]?.url || "";
      const domainName = getDomain(domainUrl) || selected.name;
      const folder = getSafeFolder(domainName);

      formData.append("folder", folder);
      formData.append("filename", type === "assistant" ? "assistantLogo" : "websiteLogo");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        onChange({
          ...selected,
          [type === "assistant" ? "assistantLogo" : "websiteLogo"]: data.url,
        });
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(null);
    }
  }

  return (
    <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
      <h2 className="font-semibold mb-5">Basic Information</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Assistant Logo */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Assistant Logo
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                {selected.assistantLogo ? (
                  <Image
                    src={selected.assistantLogo}
                    alt="Assistant Logo"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-slate-500" />
                )}
                {uploading === "assistant" && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  </div>
                )}
              </div>
              <label className="flex-1 cursor-pointer">
                <div className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium text-slate-300 transition-all flex items-center justify-center gap-2">
                  <Upload className="w-3.5 h-3.5" />
                  {uploading === "assistant" ? "Uploading..." : "Change Logo"}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleLogoUpload(e, "assistant")}
                  disabled={!!uploading}
                />
              </label>
            </div>
          </div>

          {/* Website Logo */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Website Logo (Scraped)
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                {selected.websiteLogo ? (
                  <Image
                    src={selected.websiteLogo}
                    alt="Website Logo"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <Globe className="w-6 h-6 text-slate-500" />
                )}
                {uploading === "website" && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  </div>
                )}
              </div>
              <label className="flex-1 cursor-pointer">
                <div className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium text-slate-300 transition-all flex items-center justify-center gap-2">
                  <Upload className="w-3.5 h-3.5" />
                  {uploading === "website" ? "Uploading..." : "Replace Logo"}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleLogoUpload(e, "website")}
                  disabled={!!uploading}
                />
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Chatbot Name
          </label>
          <input
            type="text"
            value={selected.name}
            onChange={(e) => onChange({ ...selected, name: e.target.value })}
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
              onChange({ ...selected, welcomeMessage: e.target.value })
            }
            rows={3}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
          />
        </div>
      </div>
    </div>
  );
}
