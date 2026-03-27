export const ENDPOINTS = {
  CHAT: "/api/chat",
  SIGNUP: "/api/auth/signup",
  CHATBOTS: "/api/chatbots",
  VERIFY_DOMAIN: "/api/verify-domain",
  DATA_SOURCES: "/api/data-sources",
  SCRAPE: "/api/scrape",
  EMBED: "/api/embed",
  CRAWL: "/api/crawl",

  // Dynamic route helpers
  CHATBOT_BY_ID: (id: string) => `/api/chatbots/${id}`,
  DATA_SOURCE_BY_ID: (id: string) => `/api/data-sources/${id}`,
} as const;
