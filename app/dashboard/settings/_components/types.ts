export type ChatbotSettings = {
  id: string;
  name: string;
  welcomeMessage: string;
  tone: string;
  systemPrompt: string;
  primaryColor: string;
  assistantLogo?: string | null;
  websiteLogo?: string | null;
  dataSources?: { url: string }[];
};

export const TONE_OPTIONS = [
  { value: "professional", label: "Professional", desc: "Formal and precise" },
  { value: "friendly", label: "Friendly", desc: "Warm and approachable" },
  { value: "concise", label: "Concise", desc: "Short and to the point" },
  { value: "technical", label: "Technical", desc: "Detailed and expert" },
];

export const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
];
