"use client";

import { MarkdownMessage } from "@/components/MarkdownMessage";
import { Tooltip as GlobalTooltip } from "@/components/Tooltip";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Search,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  Users,
} from "lucide-react";
import { ANALYTICS_EVENTS } from "@/lib/config";
import { usePostHog } from "posthog-js/react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type AnalyticsData = {
  overview: {
    totalConversations: number;
    totalMessages: number;
    totalUserMessages: number;
    totalAssistantMessages: number;
    uniqueSessions: number;
  };
  dailyActivity: {
    conversations: { date: string; count: number }[];
    messages: { date: string; count: number }[];
  };
  topQuestions: { question: string; count: number }[];
  unanswered: {
    count: number;
    list: { content: string; createdAt: Date }[];
  };
  lowConfidence: {
    count: number;
    samples: { content: string; confidence: number; createdAt: Date }[];
  };
  feedback: {
    helpfulCount: number;
    unhelpfulCount: number;
    ratio: number;
  };
  categories: Record<string, number>;
  engagement: {
    avgMessagesPerConversation: number;
    avgUserMessagesPerConversation: number;
  };
  successRate: number;
  topSources: { url: string; count: number }[];
};

export default function AnalyticsPage() {
  const posthog = usePostHog();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatbotId, setChatbotId] = useState<string | null>(null);
  const [chatbots, setChatbots] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    posthog.capture(ANALYTICS_EVENTS.ANALYTICS_VIEWED);
  }, [posthog]);

  useEffect(() => {
    fetch("/api/chatbots")
      .then((res) => res.json())
      .then((d) => {
        setChatbots(d.chatbots || []);
        if (d.chatbots?.length > 0) {
          setChatbotId(d.chatbots[0].id);
        } else {
          setLoading(false);
        }
      });
  }, []);

  useEffect(() => {
    if (!chatbotId) return;

    async function fetchAnalytics() {
      setLoading(true);
      try {
        const res = await fetch(`/api/analytics?chatbotId=${chatbotId}`);
        const d = await res.json();
        setData(d);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [chatbotId]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (chatbots.length === 0 && !loading) {
    return (
      <div className="p-8 text-center text-slate-400">
        No chatbots found. Create one to see analytics.
      </div>
    );
  }

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
  const categoryData = data?.categories
    ? Object.entries(data.categories).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">
            Analytics Dashboard
          </h1>
          <p className="text-slate-400 text-sm">
            Derive actionable insights from your AI
          </p>
        </div>
        <select
          value={chatbotId || ""}
          onChange={(e) => setChatbotId(e.target.value)}
          className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-w-[200px]"
        >
          {chatbots.map((cb) => (
            <option key={cb.id} value={cb.id}>
              {cb.name}
            </option>
          ))}
        </select>
      </div>

      {/* 1. OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Conversations",
            value: data?.overview.totalConversations,
            icon: MessageSquare,
            color: "text-blue-500",
          },
          {
            label: "Total Messages",
            value: data?.overview.totalMessages,
            icon: Search,
            color: "text-indigo-500",
          },
          {
            label: "Unique Users",
            value: data?.overview.uniqueSessions,
            icon: Users,
            color: "text-emerald-500",
          },
          {
            label: "Success Rate",
            value: `${Math.round((data?.successRate || 0) * 100)}%`,
            icon: CheckCircle2,
            color: "text-emerald-400",
          },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-900/50 border border-white/5 p-5 rounded-2xl hover:border-white/10 transition-all group"
          >
            <div
              className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center ${m.color} mb-4`}
            >
              <m.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{m.value}</div>
            <div className="text-slate-500 text-xs font-medium uppercase tracking-wider">
              {m.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 2. CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">
            Conversations Per Day
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.dailyActivity.conversations}>
                <defs>
                  <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#ffffff05"
                />
                <XAxis
                  dataKey="date"
                  stroke="#475569"
                  fontSize={10}
                  tickFormatter={(s) => s.split("-")[2]}
                />
                <YAxis stroke="#475569" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #ffffff10",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  fillOpacity={1}
                  fill="url(#colorConv)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">
            Messages Per Day
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.dailyActivity.messages}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#ffffff05"
                />
                <XAxis
                  dataKey="date"
                  stroke="#475569"
                  fontSize={10}
                  tickFormatter={(s) => s.split("-")[2]}
                />
                <YAxis stroke="#475569" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #ffffff10",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3. CATEGORY DISTRIBUTION PIE */}
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">
            Category Distribution
          </h2>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #ffffff10",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-white">
                {data?.overview.totalUserMessages}
              </span>
              <span className="text-[10px] text-slate-500 uppercase">
                Queries
              </span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {categoryData.map((c, i) => (
              <div
                key={c.name}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2 text-slate-400 capitalize">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  {c.name}
                </div>
                <span className="text-white font-medium">{c.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. FEEDBACK STATS */}
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white mb-6">
              Feedback Insights
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <ThumbsUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      Helpful
                    </div>
                    <div className="text-xs text-slate-500">
                      Positive responses
                    </div>
                  </div>
                </div>
                <div className="text-xl font-bold text-white">
                  {data?.feedback.helpfulCount}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                    <ThumbsDown className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      Unhelpful
                    </div>
                    <div className="text-xs text-slate-500">
                      Corrective needed
                    </div>
                  </div>
                </div>
                <div className="text-xl font-bold text-white">
                  {data?.feedback.unhelpfulCount}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-auto pt-8">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm text-slate-400 font-medium">
                Approval Rating
              </span>
              <span className="text-2xl font-bold text-indigo-400">
                {Math.round((data?.feedback.ratio || 0) * 100)}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(data?.feedback.ratio || 0) * 100}%` }}
                className="h-full bg-indigo-500 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* 5. TOP SOURCES */}
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 overflow-hidden">
          <h2 className="text-lg font-semibold text-white mb-6">
            Top Data Sources
          </h2>
          <div className="space-y-4">
            {data?.topSources && data.topSources.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-sm italic">
                No source data
              </div>
            ) : (
              data?.topSources?.map((s, i) => (
                <div
                  key={s.url}
                  className="flex items-center justify-between group/row"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-[10px] font-mono text-slate-500 w-4 shrink-0">
                      {i + 1}
                    </span>
                    <GlobalTooltip content={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-slate-300 truncate hover:text-indigo-400 flex items-center gap-1 transition-colors min-w-0"
                      >
                        {s.url}
                        <ExternalLink className="w-2 h-2 opacity-0 group-hover/row:opacity-100 shrink-0" />
                      </a>
                    </GlobalTooltip>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full shrink-0 ml-4">
                    {s.count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 6. TOP QUESTIONS */}
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Top User Questions
            </h2>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              Trending
            </span>
          </div>
          <div className="divide-y divide-white/5">
            {data?.topQuestions?.map((q, i) => (
              <div
                key={q.question}
                className="p-4 hover:bg-white/5 transition-colors group flex items-center justify-between"
              >
                <div className="flex items-center gap-4 min-w-0 pr-4">
                  <span className="text-xs text-slate-600 font-mono italic">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm text-slate-200 truncate pr-2 italic">
                    &quot;{q.question}&quot;
                  </p>
                </div>
                <div className="text-xs font-bold text-indigo-500/80 bg-indigo-500/10 px-2.5 py-1 rounded-lg shrink-0">
                  {q.count} times
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. UNANSWERED / LOW CONFIDENCE */}
        <div className="space-y-6">
          <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Unanswered Queries
                  </h2>
                  <p className="text-xs text-slate-500">
                    Bots couldn&apos;t find information
                  </p>
                </div>
              </div>
              <div className="text-2xl font-bold text-amber-500">
                {data?.unanswered.count}
              </div>
            </div>
            <div className="space-y-3">
              {data?.unanswered?.list?.slice(0, 5).map((u, i) => (
                <div
                  key={i}
                  className="text-xs p-3 bg-slate-800/50 rounded-xl text-slate-300 border border-white/5"
                >
                  <MarkdownMessage
                    content={u.content}
                    linkColor="text-indigo-400"
                    codeBg="bg-slate-700"
                    preBg="bg-slate-700"
                  />
                </div>
              ))}
              {(!data?.unanswered?.count || data.unanswered.count === 0) && (
                <div className="text-center py-4 text-emerald-500/50 text-sm">
                  Perfect Performance! 🌟
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                  <TrendingUp className="w-5 h-5 rotate-180" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Low Confidence
                  </h2>
                  <p className="text-xs text-slate-500">
                    Responses below 50% threshold
                  </p>
                </div>
              </div>
              <div className="text-2xl font-bold text-rose-500">
                {data?.lowConfidence.count}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {data?.lowConfidence?.samples?.slice(0, 3).map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg text-[10px]"
                >
                  <span className="text-slate-400 truncate max-w-[80%] italic pr-2">
                    &quot;{s.content}&quot;
                  </span>
                  <span className="text-rose-400 font-mono">
                    {Math.round(s.confidence * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
