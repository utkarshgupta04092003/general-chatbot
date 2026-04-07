export type ChatbotSettings = {
  id: string;
  name: string;
  welcomeMessage: string;
  tone: string;
  systemPrompt: string;
  primaryColor: string;
  agentType: string;
  assistantLogo?: string | null;
  websiteLogo?: string | null;
  dataSources?: { url: string }[];
};
