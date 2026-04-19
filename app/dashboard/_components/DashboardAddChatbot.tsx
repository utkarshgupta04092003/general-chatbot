"use client";

import { AddChatbotButton } from "@/components/AddChatbotButton";
import { Globe, Plus, Zap } from "lucide-react";
import Link from "next/link";

export function DashboardActions() {
  return (
    <>
      {/* Header button */}
      <AddChatbotButton className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-all cursor-pointer">
        <Plus className="w-4 h-4" />
        New Chatbot
      </AddChatbotButton>
    </>
  );
}

export function DashboardAddNewLink() {
  return (
    <AddChatbotButton className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0">
      <Plus className="w-3 h-3" />
      Add new
    </AddChatbotButton>
  );
}

export function DashboardQuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <AddChatbotButton className="flex items-center gap-2 px-4 py-3 bg-background hover:bg-accent/50 border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground transition-all cursor-pointer w-full">
        <Plus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        Add New Chatbot
      </AddChatbotButton>
      <Link
        href="/dashboard/data-sources"
        className="flex items-center gap-2 px-4 py-3 bg-background hover:bg-accent/50 border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground transition-all"
      >
        <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        Manage Data Sources
      </Link>
      <Link
        href="/dashboard/embed"
        className="flex items-center gap-2 px-4 py-3 bg-background hover:bg-accent/50 border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground transition-all"
      >
        <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        Get Embed Code
      </Link>
    </div>
  );
}

export function DashboardCreateFirstChatbot() {
  return (
    <AddChatbotButton className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-xl transition-all cursor-pointer">
      Create your first chatbot
    </AddChatbotButton>
  );
}
