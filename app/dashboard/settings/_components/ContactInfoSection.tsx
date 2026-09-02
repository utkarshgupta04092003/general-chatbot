"use client";

import { Link as LinkIcon, Mail, MessageCircle, Phone } from "lucide-react";
import { ChatbotSettings } from "./types";

export function ContactInfoSection({
  selected,
  onChange,
}: {
  selected: ChatbotSettings;
  onChange: (b: ChatbotSettings) => void;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-pink-500/10 rounded-md flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-pink-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Fallback Contact Options</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Shown to users when the bot doesn&apos;t know the answer.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Support Email
          </label>
          <div className="flex gap-3">
            <div className="flex items-center bg-card border border-border border border-border rounded-md px-4 flex-1">
              <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="email"
                value={selected.supportEmail || ""}
                onChange={(e) =>
                  onChange({ ...selected, supportEmail: e.target.value })
                }
                placeholder="support@example.com"
                className="w-full bg-transparent px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Phone Number
          </label>
          <div className="flex gap-3">
            <div className="flex items-center bg-card border border-border border border-border rounded-md px-4 flex-1">
              <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="tel"
                value={selected.supportPhone || ""}
                onChange={(e) =>
                  onChange({ ...selected, supportPhone: e.target.value })
                }
                placeholder="+1 (555) 000-0000"
                className="w-full bg-transparent px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            WhatsApp
          </label>
          <div className="flex gap-3">
            <div className="flex items-center bg-card border border-border border border-border rounded-md px-4 flex-1">
              <MessageCircle className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                value={selected.supportWhatsapp || ""}
                onChange={(e) =>
                  onChange({ ...selected, supportWhatsapp: e.target.value })
                }
                placeholder="+1234567890 (include country code)"
                className="w-full bg-transparent px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Contact Page Link
          </label>
          <div className="flex gap-3">
            <div className="flex items-center bg-card border border-border border border-border rounded-md px-4 flex-1">
              <LinkIcon className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="url"
                value={selected.contactPageLink || ""}
                onChange={(e) =>
                  onChange({ ...selected, contactPageLink: e.target.value })
                }
                placeholder="https://example.com/contact"
                className="w-full bg-transparent px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
