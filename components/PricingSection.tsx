"use client";

import { WaitlistModal } from "@/components/WaitlistModal";
import {
  CURRENCY_SYMBOL,
  PLAN_LIMITS,
  PLAN_PRICES,
  REGION,
} from "@/lib/config";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type PricingSectionProps = {
  session: {
    user?: {
      id?: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  } | null;
};

export function PricingSection({ session }: PricingSectionProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const plans = [
    {
      name: "Free",
      price: `${CURRENCY_SYMBOL}${PLAN_PRICES.FREE.toLocaleString(REGION === "IN" ? "en-IN" : "en-US")}`,
      period: "forever",
      description: "Perfect for testing",
      features: [
        `${PLAN_LIMITS.FREE.MAX_CHATBOTS} Chatbot`,
        `${PLAN_LIMITS.FREE.MAX_PAGES} Pages indexed`,
        `${PLAN_LIMITS.FREE.MAX_MESSAGES.toLocaleString()} Messages/month`,
        "Basic analytics",
        `Embed on ${PLAN_LIMITS.FREE.MAX_CHATBOTS} site`,
      ],
      cta: "Start Free",
      popular: false,
      href: "/signup",
    },
    {
      name: "Starter",
      price: `${CURRENCY_SYMBOL}${PLAN_PRICES.STARTER.toLocaleString(REGION === "IN" ? "en-IN" : "en-US")}`,
      period: "/month",
      description: "For small projects",
      features: [
        `${PLAN_LIMITS.STARTER.MAX_CHATBOTS} Chatbots`,
        `${PLAN_LIMITS.STARTER.MAX_PAGES} Pages indexed`,
        `${PLAN_LIMITS.STARTER.MAX_MESSAGES.toLocaleString()} Messages/month`,
        "Standard analytics",
        "Unlimited embeds",
        "Email support",
      ],
      cta: "Notify me when available",
      popular: true,
      href: "#",
    },
    {
      name: "Premium",
      price: `${CURRENCY_SYMBOL}${PLAN_PRICES.PREMIUM.toLocaleString(REGION === "IN" ? "en-IN" : "en-US")}`,
      period: "/month",
      description: "For professional scale",
      features: [
        `${PLAN_LIMITS.PREMIUM.MAX_CHATBOTS} Chatbots`,
        `${PLAN_LIMITS.PREMIUM.MAX_PAGES} Pages indexed`,
        `${PLAN_LIMITS.PREMIUM.MAX_MESSAGES.toLocaleString()} Messages/month`,
        "Advanced analytics",
        "Priority support",
        "Custom branding",
        "API access",
      ],
      cta: "Notify me when available",
      popular: false,
      href: "#",
    },
  ];

  function handleNotifyClick(plan: string) {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  }

  return (
    <>
      <div className="grid md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-2xl p-8 h-full transition-all hover:scale-[1.02] duration-300 ${
              plan.popular
                ? "bg-indigo-600 border-2 border-indigo-400 shadow-2xl shadow-indigo-500/30"
                : "bg-card border border-border"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-indigo-600 text-xs font-bold rounded-full z-10">
                MOST POPULAR
              </div>
            )}
            {plan.name !== "Free" && (
              <div
                className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${
                  plan.name === "Starter"
                    ? "bg-white text-indigo-600 border-white shadow-indigo-500/10"
                    : "bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400"
                }`}
              >
                Coming Soon
              </div>
            )}

            <div className="mb-6">
              <div className="text-sm text-muted-foreground mb-1">
                {plan.name}
              </div>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span
                  className={`text-sm mb-1.5 ${plan.popular ? "text-indigo-200" : "text-muted-foreground"}`}
                >
                  {plan.period}
                </span>
              </div>
              <p
                className={`text-sm ${plan.popular ? "text-indigo-200" : "text-muted-foreground"}`}
              >
                {plan.description}
              </p>
            </div>

            <ul className="space-y-3 mb-8 flex-grow">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <CheckCircle
                    className={`w-4 h-4 shrink-0 ${plan.popular ? "text-indigo-200" : "text-indigo-600 dark:text-indigo-400"}`}
                  />
                  <span
                    className={
                      plan.popular ? "text-indigo-100" : "text-muted-foreground"
                    }
                  >
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-4">
              {plan.name === "Free" ? (
                <Link
                  href={session ? "/dashboard" : "/signup"}
                  className={`block text-center py-3 rounded-xl font-medium text-sm transition-all shadow-lg ${
                    plan.popular
                      ? "bg-white text-indigo-600 hover:bg-indigo-50 shadow-white/10"
                      : "hover:bg-accent/50 bg-muted/30 hover:bg-accent/50 border border-border text-white shadow-black/10"
                  }`}
                >
                  {plan.cta}
                </Link>
              ) : (
                <button
                  onClick={() => handleNotifyClick(plan.name)}
                  className={`w-full text-center py-3 rounded-xl font-medium text-sm transition-all border border-border cursor-pointer ${
                    plan.popular
                      ? "bg-white text-indigo-600 hover:bg-indigo-50"
                      : "bg-transparent hover:bg-accent/50 bg-muted/30 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {plan.cta}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <WaitlistModal
        plan={selectedPlan || ""}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
