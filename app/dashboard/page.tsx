import { prisma } from "@/lib/prisma";
import { PageHeader, StatCard } from "@/components/ui";
import { requireAuth } from "@/lib/session";
import { formatRelativeTime } from "@/lib/utils";
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  Clock,
  Globe,
  MessageSquare,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import {
  DashboardActions,
  DashboardAddNewLink,
  DashboardCreateFirstChatbot,
  DashboardQuickActions,
} from "./_components/DashboardAddChatbot";

export default async function DashboardOverviewPage() {
  const session = await requireAuth();

  const chatbots = await prisma.chatbot.findMany({
    where: { userId: session.user.id, deleted: false },
    include: {
      _count: {
        select: {
          conversations: { where: { deleted: false } },
          dataSources: { where: { deleted: false } },
        },
      },
      conversations: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { messages: { take: 2, orderBy: { createdAt: "asc" } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalConversations = chatbots.reduce(
    (acc, c) => acc + c._count.conversations,
    0,
  );
  const totalQueries = chatbots.reduce((acc, c) => acc + c.totalQueries, 0);
  const totalDataSources = chatbots.reduce(
    (acc, c) => acc + c._count.dataSources,
    0,
  );

  const recentConversations = chatbots
    .flatMap((c) =>
      c.conversations.map((conv) => ({
        ...conv,
        chatbotName: c.name,
      })),
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return (
    <div>
      <PageHeader
        title="Overview"
        description="Welcome back! Here's how your chatbots are doing."
        actions={<DashboardActions />}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Conversations", value: totalConversations, icon: MessageSquare },
          { label: "Queries", value: totalQueries, icon: BarChart3 },
          { label: "Data sources", value: totalDataSources, icon: Globe },
          {
            label: "Active chatbots",
            value: chatbots.filter((c) => c.status === "ready").length,
            icon: Zap,
          },
        ].map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value.toLocaleString()}
            icon={<stat.icon className="w-4 h-4" />}
          />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 relative min-w-0">
        {/* Chatbots */}
        <div className="bg-card border border-border rounded-lg p-6 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold">Your Chatbots</h2>
            <DashboardAddNewLink />
          </div>
          {chatbots.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-14 h-14 bg-primary-subtle rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-primary dark:text-primary" />
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                No chatbots yet
              </p>
              <DashboardCreateFirstChatbot />
            </div>
          ) : (
            <div className="space-y-3">
              {chatbots.map((bot) => (
                <div
                  key={bot.id}
                  className="flex items-center gap-3 p-3 bg-accent/30 rounded-md hover:bg-accent/50 transition-colors"
                >
                  <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">
                      {bot.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {bot._count.conversations} conversations ·{" "}
                      {bot._count.dataSources} pages
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                      bot.status === "ready"
                        ? "bg-success/10 text-success"
                        : "bg-warning-subtle text-warning"
                    }`}
                  >
                    {bot.status === "ready" ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3 animate-spin" />
                    )}
                    {bot.status === "ready" ? "Live" : "Training"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Conversations */}
        <div className="bg-card border border-border rounded-lg p-6 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold">Recent Conversations</h2>
            <Link
              href="/dashboard/conversations"
              className="text-xs text-primary dark:text-primary hover:text-primary dark:hover:text-primary flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentConversations.length === 0 ? (
            <div className="text-center py-10">
              <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                No conversations yet. Embed your chatbot and start chatting!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentConversations.map((conv) => {
                const firstMsg = conv.messages[0];
                return (
                  <div key={conv.id} className="p-3 bg-accent/30 rounded-md">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-primary dark:text-primary font-medium">
                        {conv.chatbotName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(conv.createdAt)}
                      </span>
                    </div>
                    {firstMsg && (
                      <p className="text-sm text-muted-foreground truncate">
                        {firstMsg.content}
                      </p>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      {conv.messages.length} messages
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-primary dark:text-primary" />
          <h2 className="font-semibold">Quick Actions</h2>
        </div>
        <DashboardQuickActions />
      </div>
    </div>
  );
}
