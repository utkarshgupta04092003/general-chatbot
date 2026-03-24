import {
  GEMINI_3_1_PRO,
  GPT_4O_TRANSCRIBE,
  GPT_5_2,
  GPT_5_MINI,
  GPT_5_NANO,
  GROK_4_FAST_REASONING,
  MISTRAL_LARGE_3,
  TEXT_EMBEDDING_3_SMALL,
} from "./config";

export type QAModel =
  | typeof MISTRAL_LARGE_3
  | typeof GEMINI_3_1_PRO
  | typeof GROK_4_FAST_REASONING
  | typeof GPT_5_2
  | typeof GPT_5_MINI
  | typeof GPT_5_NANO
  | typeof GPT_4O_TRANSCRIBE
  | typeof TEXT_EMBEDDING_3_SMALL;
