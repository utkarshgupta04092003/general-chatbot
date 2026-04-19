export const APP_NAME = "Chatbase";
export const ENABLE_USAGE_LIMITS = true; // Set to false to disable all usage restrictions
export const CONTACT_EMAIL = "hello@chatbase.com";
export const SALES_EMAIL = "sales@chatbase.com";
export const SUPPORT_EMAIL = "support@chatbase.com";

export const GPT_5_2 = "gpt-5.2";
export const MISTRAL_LARGE_3 = "Mistral-Large-3";
export const GEMINI_3_1_PRO = "gemini-3.1-pro-preview";
export const TEXT_EMBEDDING_3_SMALL = "text-embedding-3-small";
export const COHERE_RERANK_3_5 = "cohere-rerank-3.5";
export const GROK_4_FAST_REASONING = "grok-4-fast-reasoning";
export const GPT_5_MINI = "gpt-5-mini";
export const GPT_5_NANO = "gpt-5-nano";
export const GPT_4O_TRANSCRIBE = "gpt-4o-transcribe";

export const API_VERSIONS = {
  [TEXT_EMBEDDING_3_SMALL]: "2024-04-01-preview",
  [GEMINI_3_1_PRO]: "v1beta",
  [MISTRAL_LARGE_3]: "2024-05-01-preview",
  [GROK_4_FAST_REASONING]: "2024-05-01-preview",
  [GPT_5_2]: "2025-04-01-preview",
  [GPT_5_MINI]: "2025-01-01-preview",
  [GPT_5_NANO]: "2025-01-01-preview",
  [GPT_4O_TRANSCRIBE]: "2025-03-01-preview",
};

export const CHAT_ROLES = {
  USER: "user",
  ASSISTANT: "assistant",
  SYSTEM: "system",
} as const;

export const FEEDBACK_TEXT = {
  HELPFUL: "helpful",
  UNHELPFUL: "unhelpful",
} as const;

export const RESPONSE_ERROR_MESSAGE =
  "Sorry, something went wrong. Please try again.";
export const MIN_CONFIDENCE_THRESHOLD = 0.6;

export const POSTHOG_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
};

export const ANALYTICS_EVENTS = {
  USER_SIGNED_UP: "user_signed_up",
  USER_LOGGED_IN: "user_logged_in",
  CHATBOT_CREATED: "chatbot_created",
  CHATBOT_SETTINGS_UPDATED: "chatbot_settings_updated",
  CHATBOT_DELETED: "chatbot_deleted",
  MESSAGE_SENT_TO_BOT: "message_sent_to_bot",
  BOT_RESPONSE_RECEIVED: "bot_response_received",
  DATA_SOURCE_ADDED: "data_source_added",
  ONBOARDING_STARTED: "onboarding_started",
  ONBOARDING_STEP_COMPLETED: "onboarding_step_completed",
  ONBOARDING_COMPLETED: "onboarding_completed",
  ANALYTICS_VIEWED: "analytics_viewed",
  CONVERSATIONS_VIEWED: "conversations_viewed",
  SETTINGS_VIEWED: "settings_viewed",
  EMBED_VIEWED: "embed_viewed",
  USAGE_VIEWED: "usage_viewed",
  DATA_SOURCES_VIEWED: "data_sources_viewed",
  CONVERSATION_OPENED: "conversation_opened",
  DATA_SOURCE_FILTER_CHANGED: "data_source_filter_changed",
  EMBED_COPIED: "embed_copied",
} as const;

export const REGION: "IN" | "GL" = "IN";

export const CURRENCY_SYMBOL = REGION === "IN" ? "₹" : "$";
export const MOBILE_PLACEHOLDER =
  REGION === "IN" ? "+91 99999 99999" : "+1 (555) 000-0000";

export const PLAN_LIMITS = {
  FREE: {
    MAX_PAGES: 25,
    MAX_MESSAGES: 50,
    MAX_CHATBOTS: 2,
  },
  STARTER: {
    MAX_PAGES: 50,
    MAX_MESSAGES: 1000,
    MAX_CHATBOTS: 3,
  },
  PREMIUM: {
    MAX_PAGES: 100,
    MAX_MESSAGES: 5000,
    MAX_CHATBOTS: 10,
  },
} as const;

export const PLAN_PRICES =
  REGION === "IN"
    ? ({
        FREE: 0,
        STARTER: 1499,
        PREMIUM: 4499,
      } as const)
    : ({
        FREE: 0,
        STARTER: 19,
        PREMIUM: 49,
      } as const);

export const AGENT_TYPE_GENERAL = "general";
export const AGENT_TYPE_SALES = "sales";
export const AGENT_TYPE_SUPPORT = "support";

export const AGENT_TYPE_OPTIONS = [
  { value: AGENT_TYPE_GENERAL, label: "General Chatbot" },
  { value: AGENT_TYPE_SALES, label: "Sales & Marketing" },
  { value: AGENT_TYPE_SUPPORT, label: "Customer Support" },
];

export const AGENT_PROMPT_TEMPLATES: Record<string, string> = {
  [AGENT_TYPE_GENERAL]: `
You are a helpful and knowledgeable AI assistant.

Your responsibilities:
- Answer user questions clearly and accurately using the provided context.
- If context is insufficient, say so instead of guessing.
- Provide concise yet complete explanations.
- Use simple, easy-to-understand language unless the user asks for technical depth.
- Maintain a polite, professional, and neutral tone.

Guidelines:
- Do not make up facts or hallucinate information.
- Ask clarifying questions if the user's request is unclear.
- Structure answers with bullet points or steps when helpful.
- Prioritize usefulness and clarity over verbosity.
`,

  [AGENT_TYPE_SALES]: `
You are a sales-focused AI assistant designed to guide users toward a purchase or booking.

Your responsibilities:
- Clearly explain product or service features, benefits, and value.
- Understand user needs and recommend the most relevant solutions.
- Encourage conversions (purchases, sign-ups, bookings) in a natural and helpful way.

Guidelines:
- Be persuasive but not pushy.
- Highlight benefits over just listing features.
- Address potential objections or concerns proactively.
- Use confident, positive, and engaging language.
- Provide clear next steps (e.g., "You can get started by...").

Behavior rules:
- Do not mislead or exaggerate claims.
- If unsure about details, acknowledge uncertainty.
- Keep responses professional, friendly, and customer-focused.
`,

  [AGENT_TYPE_SUPPORT]: `
You are a customer support AI assistant focused on helping users solve problems efficiently.

Your responsibilities:
- Understand the user's issue and provide clear, step-by-step solutions.
- Be patient, empathetic, and respectful in all interactions.
- Ensure the user feels supported and understood.

Guidelines:
- Acknowledge the user's problem before providing a solution.
- Break down solutions into simple, actionable steps.
- Ask follow-up questions if more information is needed.
- Offer alternative solutions when possible.

Behavior rules:
- Never blame the user.
- Do not provide incorrect or speculative fixes.
- If the issue cannot be resolved, suggest escalation or next steps (e.g., contacting support team).
- Maintain a calm, reassuring, and professional tone throughout.
`,
};

export const DEFAULT_SYSTEM_PROMPT = AGENT_PROMPT_TEMPLATES[AGENT_TYPE_GENERAL];

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

export const README_FILE_URL =
  "https://github.com/utkarshgupta04092003/general-chatbot";
