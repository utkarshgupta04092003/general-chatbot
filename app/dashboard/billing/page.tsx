import { CheckCircle, Zap, CreditCard } from "lucide-react";
import Link from "next/link";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for testing",
    color: "border-white/10",
    features: ["10 pages indexed", "100 messages/month", "1 chatbot", "Basic analytics", "Community support"],
    current: true,
    cta: "Current Plan",
    ctaDisabled: true,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For growing businesses",
    color: "border-indigo-500/50 bg-indigo-600/5",
    popular: true,
    features: ["500 pages indexed", "5,000 messages/month", "5 chatbots", "Advanced analytics", "Unlimited embeds", "Priority support", "Custom branding", "API access"],
    current: false,
    cta: "Upgrade to Pro",
    ctaDisabled: false,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For large organizations",
    color: "border-white/10",
    features: ["Unlimited pages", "Unlimited messages", "Unlimited chatbots", "Custom AI fine-tuning", "SSO & SAML", "SLA guarantee", "Dedicated support", "White-label"],
    current: false,
    cta: "Contact Sales",
    ctaDisabled: false,
  },
];

export default function BillingPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Billing & Plans</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your subscription and usage.</p>
      </div>

      {/* Current usage */}
      <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold">Current Usage</h2>
          <span className="px-3 py-1 bg-indigo-500/10 text-indigo-300 text-xs font-medium rounded-full border border-indigo-500/20">
            Free Plan
          </span>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { label: "Pages indexed", used: 3, total: 10 },
            { label: "Messages this month", used: 47, total: 100 },
            { label: "Chatbots", used: 1, total: 1 },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-400">{item.label}</span>
                <span className="text-white font-medium">{item.used}/{item.total}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    item.used / item.total > 0.8 ? "bg-red-500" : "bg-indigo-500"
                  }`}
                  style={{ width: `${(item.used / item.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plans */}
      <h2 className="font-semibold mb-4">Available Plans</h2>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-slate-800/50 border rounded-2xl p-6 ${plan.color}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">
                POPULAR
              </div>
            )}
            {plan.current && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-600 text-white text-xs font-bold rounded-full">
                CURRENT
              </div>
            )}
            <div className="mb-5">
              <div className="font-semibold mb-1">{plan.name}</div>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-slate-500 text-sm mb-1">{plan.period}</span>
              </div>
              <p className="text-xs text-slate-500">{plan.description}</p>
            </div>
            <ul className="space-y-2.5 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="text-slate-300">{f}</span>
                </li>
              ))}
            </ul>
            <button
              disabled={plan.ctaDisabled}
              className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
                plan.ctaDisabled
                  ? "bg-white/5 text-slate-500 cursor-not-allowed"
                  : plan.popular
                  ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                  : "bg-white/5 hover:bg-white/10 border border-white/10 text-white"
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Payment history placeholder */}
      <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-slate-400" />
          <h2 className="font-semibold">Payment History</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-slate-500 text-sm">No payments yet. You are on the Free plan.</p>
        </div>
      </div>
    </div>
  );
}
