import {
  CHAT_ROLES,
  FEEDBACK_TEXT,
  GEMINI_FLASH_LITE,
  GEMINI_EMBEDDING_001,
} from "./config";

export type QAModel =
  | typeof GEMINI_FLASH_LITE
  | typeof GEMINI_EMBEDDING_001;

export type ChatRole = (typeof CHAT_ROLES)[keyof typeof CHAT_ROLES];

export type FeedbackType = (typeof FEEDBACK_TEXT)[keyof typeof FEEDBACK_TEXT];
