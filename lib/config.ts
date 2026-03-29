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
} as const;

export const FEEDBACK_TEXT = {
  HELPFUL: "helpful",
  UNHELPFUL: "unhelpful",
} as const;
