import {
  CHAT_ROLES,
  FEEDBACK_TEXT,
  GEMINI_3_1_PRO,
  GEMINI_3_FLASH,
  GEMINI_EMBEDDING_001,
} from "./config";

export type QAModel =
  | typeof GEMINI_3_1_PRO
  | typeof GEMINI_3_FLASH
  | typeof GEMINI_EMBEDDING_001;

export type ChatRole = (typeof CHAT_ROLES)[keyof typeof CHAT_ROLES];

export type FeedbackType = (typeof FEEDBACK_TEXT)[keyof typeof FEEDBACK_TEXT];
