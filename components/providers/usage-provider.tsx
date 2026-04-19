"use client";

import { ENABLE_USAGE_LIMITS } from "@/lib/config";
import { ENDPOINTS } from "@/lib/endpoint";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type UsageData = {
  chatbotCount: number;
  pageCount: number;
  messageCount: number;
};

type UsageContextType = UsageData & {
  isLoading: boolean;
  mutate: () => void;
};

const UsageContext = createContext<UsageContextType>({
  chatbotCount: 0,
  pageCount: 0,
  messageCount: 0,
  isLoading: true,
  mutate: () => {},
});

export function useUsage() {
  return useContext(UsageContext);
}

export function UsageProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<UsageData>({
    chatbotCount: 0,
    pageCount: 0,
    messageCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsage = useCallback(async () => {
    if (!ENABLE_USAGE_LIMITS) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch(ENDPOINTS.USAGE);
      if (!res.ok) return;
      const json = await res.json();
      setData({
        chatbotCount: json.chatbotCount ?? 0,
        pageCount: json.pageCount ?? 0,
        messageCount: json.messageCount ?? 0,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  return (
    <UsageContext.Provider value={{ ...data, isLoading, mutate: fetchUsage }}>
      {children}
    </UsageContext.Provider>
  );
}
