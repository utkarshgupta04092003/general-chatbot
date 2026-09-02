"use client";

import { AddChatbotButton } from "@/components/AddChatbotButton";
import { Globe, Plus, Zap } from "lucide-react";
import Link from "next/link";

export function DashboardActions() {
  return (
    <>
      {/* Header button */}
      <AddChatbotButton className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-md transition-all cursor-pointer">
        <Plus className="w-4 h-4" />
        New Chatbot
      </AddChatbotButton>
    </>
  );
}

export function DashboardAddNewLink() {
  return (
    <AddChatbotButton className="text-xs text-primary dark:text-primary hover:text-primary dark:hover:text-primary flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0">
      <Plus className="w-3 h-3" />
      Add new
    </AddChatbotButton>
  );
}

export function DashboardQuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <AddChatbotButton className="flex items-center gap-2 px-4 py-3 bg-background hover:bg-accent/50 border border-border rounded-md text-sm text-muted-foreground hover:text-foreground transition-all cursor-pointer w-full">
        <Plus className="w-4 h-4 text-primary dark:text-primary" />
        Add New Chatbot
      </AddChatbotButton>
      <Link
        href="/dashboard/data-sources"
        className="flex items-center gap-2 px-4 py-3 bg-background hover:bg-accent/50 border border-border rounded-md text-sm text-muted-foreground hover:text-foreground transition-all"
      >
        <Globe className="w-4 h-4 text-primary dark:text-primary" />
        Manage Data Sources
      </Link>
      <Link
        href="/dashboard/embed"
        className="flex items-center gap-2 px-4 py-3 bg-background hover:bg-accent/50 border border-border rounded-md text-sm text-muted-foreground hover:text-foreground transition-all"
      >
        <Zap className="w-4 h-4 text-primary dark:text-primary" />
        Get Embed Code
      </Link>
    </div>
  );
}

export function DashboardCreateFirstChatbot() {
  return (
    <AddChatbotButton className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm rounded-md transition-all cursor-pointer">
      Create your first chatbot
    </AddChatbotButton>
  );
}
