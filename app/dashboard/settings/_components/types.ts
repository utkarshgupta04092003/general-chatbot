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
  supportEmail?: string | null;
  supportPhone?: string | null;
  supportWhatsapp?: string | null;
  contactPageLink?: string | null;
  dataSources?: { url: string }[];
};
