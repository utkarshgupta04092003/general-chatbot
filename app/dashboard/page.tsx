import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { formatRelativeTime } from "@/lib/utils";
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  Clock,
  Globe,
  MessageSquare,
  Plus,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardOverviewPage() {
  const session = await requireAuth();

  const chatbots = await prisma.chatbot.findMany({
    where: { userId: session.user.id },
    include: {
      _count: { select: { conversations: true, dataSources: true } },
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
    )
    .slice(0, 5);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Overview</h1>
          <p className="text-slate-400 text-sm mt-1">
            Welcome back! Here&apos;s how your chatbots are doing.
          </p>
        </div>
        <Link
          href="/onboarding"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-all"
        >
          <Plus className="w-4 h-4" />
          New Chatbot
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Conversations",
            value: totalConversations,
            icon: MessageSquare,
            color: "text-indigo-400",
            bg: "bg-indigo-500/10",
          },
          {
            label: "Total Queries",
            value: totalQueries,
            icon: BarChart3,
            color: "text-violet-400",
            bg: "bg-violet-500/10",
          },
          {
            label: "Data Sources",
            value: totalDataSources,
            icon: Globe,
            color: "text-cyan-400",
            bg: "bg-cyan-500/10",
          },
          {
            label: "Active Chatbots",
            value: chatbots.filter((c) => c.status === "ready").length,
            icon: Zap,
            color: "text-green-400",
            bg: "bg-green-500/10",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-800/50 border border-white/5 rounded-2xl p-5"
          >
            <div
              className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}
            >
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {stat.value.toLocaleString()}
            </div>
            <div className="text-sm text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Chatbots */}
        <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold">Your Chatbots</h2>
            <Link
              href="/onboarding"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add new
            </Link>
          </div>
          {chatbots.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-indigo-400" />
              </div>
              <p className="text-slate-400 text-sm mb-4">No chatbots yet</p>
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-xl transition-all"
              >
                Create your first chatbot
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {chatbots.map((bot) => (
                <div
                  key={bot.id}
                  className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors"
                >
                  <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">
                      {bot.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {bot._count.conversations} conversations ·{" "}
                      {bot._count.dataSources} pages
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                      bot.status === "ready"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-yellow-500/10 text-yellow-400"
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
        <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold">Recent Conversations</h2>
            <Link
              href="/dashboard/conversations"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentConversations.length === 0 ? (
            <div className="text-center py-10">
              <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">
                No conversations yet. Embed your chatbot and start chatting!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentConversations.map((conv) => {
                const firstMsg = conv.messages[0];
                return (
                  <div key={conv.id} className="p-3 bg-slate-700/30 rounded-xl">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-indigo-400 font-medium">
                        {conv.chatbotName}
                      </span>
                      <span className="text-xs text-slate-500">
                        {formatRelativeTime(conv.createdAt)}
                      </span>
                    </div>
                    {firstMsg && (
                      <p className="text-sm text-slate-300 truncate">
                        {firstMsg.content}
                      </p>
                    )}
                    <div className="text-xs text-slate-500 mt-1">
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
      <div className="mt-6 bg-gradient-to-r from-indigo-600/10 to-violet-600/10 border border-indigo-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 text-indigo-400" />
          <h2 className="font-semibold">Quick Actions</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { href: "/onboarding", label: "Add New Chatbot", icon: Plus },
            {
              href: "/dashboard/data-sources",
              label: "Manage Data Sources",
              icon: Globe,
            },
            { href: "/dashboard/embed", label: "Get Embed Code", icon: Zap },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-sm text-slate-300 hover:text-white transition-all"
            >
              <action.icon className="w-4 h-4 text-indigo-400" />
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
