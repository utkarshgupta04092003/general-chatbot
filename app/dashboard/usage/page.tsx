import { ANALYTICS_EVENTS, CHAT_ROLES, PLAN_LIMITS } from "@/lib/config";
import PostHogClient from "@/lib/posthog";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { CreditCard } from "lucide-react";

export default async function UsagePage() {
  const session = await requireAuth();

  // Fetch usage data
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [chatbotCount, pageCount, messageCount] = await Promise.all([
    prisma.chatbot.count({
      where: { userId: session.user.id, deleted: false },
    }),
    prisma.dataSource.count({
      where: {
        chatbot: { userId: session.user.id, deleted: false },
        deleted: false,
      },
    }),
    prisma.message.count({
      where: {
        conversation: { chatbot: { userId: session.user.id, deleted: false } },
        role: CHAT_ROLES.ASSISTANT,
        createdAt: { gte: startOfMonth },
        deleted: false,
      },
    }),
  ]);

  const limits = PLAN_LIMITS.FREE;

  const posthog = PostHogClient();
  posthog.capture({
    distinctId: session.user.id,
    event: ANALYTICS_EVENTS.USAGE_VIEWED,
  });
  await posthog.shutdown();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Usage</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Monitor your resource consumption and payment history.
        </p>
      </div>

      {/* Current usage */}
      <div className="bg-muted/50 border border-border rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold">Current Usage</h2>
          <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 text-xs font-medium rounded-full border border-indigo-500/20">
            Free Plan
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              label: "Chatbots",
              used: chatbotCount,
              total: limits.MAX_CHATBOTS,
            },
            {
              label: "Pages indexed",
              used: pageCount,
              total: limits.MAX_PAGES,
            },
            {
              label: "AI Responses this month",
              used: messageCount,
              total: limits.MAX_MESSAGES,
            },
          ].map((item) => {
            const percentage =
              item.total > 0 ? (item.used / item.total) * 100 : 0;
            return (
              <div key={item.label} className="group">
                <div className="flex items-center justify-between text-sm mb-2.5">
                  <span className="text-muted-foreground group-hover:text-muted-foreground transition-colors">
                    {item.label}
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-foreground font-semibold">
                      {item.used.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground text-[10px]">
                      / {item.total.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="relative w-full bg-accent/50 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ease-out ${
                      percentage > 90
                        ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                        : percentage > 75
                          ? "bg-amber-500"
                          : "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.3)]"
                    }`}
                    style={{ width: `${Math.min(100, percentage)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment history placeholder */}
      <div className="bg-muted/50 border border-border rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-muted-foreground" />
          <h2 className="font-semibold">Payment History</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground text-sm">
            No payments yet. You are on the Free plan.
          </p>
        </div>
      </div>
    </div>
  );
}
