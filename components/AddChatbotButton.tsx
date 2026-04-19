"use client";

import { LimitReachedModal } from "@/components/LimitReachedModal";
import { useUsage } from "@/components/providers/usage-provider";
import { ENABLE_USAGE_LIMITS, PLAN_LIMITS } from "@/lib/config";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AddChatbotButtonProps = {
  className?: string;
  children: React.ReactNode;
};

export function AddChatbotButton({
  className,
  children,
}: AddChatbotButtonProps) {
  const { chatbotCount, isLoading } = useUsage();
  const [limitOpen, setLimitOpen] = useState(false);
  const router = useRouter();

  function handleClick() {
    if (ENABLE_USAGE_LIMITS && !isLoading && chatbotCount >= PLAN_LIMITS.FREE.MAX_CHATBOTS) {
      setLimitOpen(true);
    } else {
      router.push("/onboarding");
    }
  }

  return (
    <>
      <button onClick={handleClick} className={className} type="button">
        {children}
      </button>

      <LimitReachedModal
        isOpen={limitOpen}
        onClose={() => setLimitOpen(false)}
        title="Chatbot Limit Reached"
        description={`You've used all ${PLAN_LIMITS.FREE.MAX_CHATBOTS} chatbot slot(s) on this Free plan. Self deploy or sign up with new email to create more chatbots.`}
      />
    </>
  );
}
