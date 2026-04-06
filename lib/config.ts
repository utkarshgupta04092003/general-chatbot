export const APP_NAME = "Chatbase";

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

export const ERROR_MESSAGE = "I'm sorry, I couldn't generate a response.";

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
    MAX_PAGES: 10,
    MAX_MESSAGES: 100,
    MAX_CHATBOTS: 1,
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
