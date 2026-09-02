"use client";

import { NoChatbotEmptyState } from "@/components/dashboard/NoChatbotEmptyState";
import { PageHeader } from "@/components/ui";
import { MarkdownMessage } from "@/components/MarkdownMessage";
import { Tooltip as GlobalTooltip } from "@/components/Tooltip";
import { CHART_COLORS, axisProps, gridProps, tooltipProps } from "@/lib/chart-theme";
import { ANALYTICS_EVENTS } from "@/lib/config";
import { ENDPOINTS } from "@/lib/endpoint";
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
    fetch(ENDPOINTS.CHATBOTS)
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
        const url = chatbotId
          ? `${ENDPOINTS.ANALYTICS}?chatbotId=${chatbotId}`
          : ENDPOINTS.ANALYTICS;
        const res = await fetch(url);
        const d = await res.json();
        setData(d);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [chatbotId]);

  const COLORS = CHART_COLORS;
  const categoryData = data?.categories
    ? Object.entries(data.categories).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <PageHeader title="Analytics Dashboard" description={"Derive actionable insights from your AI"} />
      </div>
      {loading && !data ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : chatbots.length === 0 ? (
        <NoChatbotEmptyState description="Create a chatbot first to see analytics." />
      ) : (
        <>
          {/* Header */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {chatbots.map((cb) => (
              <button
                key={cb.id}
                onClick={() => setChatbotId(cb.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all shrink-0 ${
                  chatbotId === cb.id
                    ? "bg-primary text-white shadow-e2 shadow-e2"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {cb.name}
              </button>
            ))}
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
                color: "text-primary",
              },
              {
                label: "Unique Users",
                value: data?.overview.uniqueSessions,
                icon: Users,
                color: "text-success",
              },
              {
                label: "Success Rate",
                value: `${Math.round((data?.successRate || 0) * 100)}%`,
                icon: CheckCircle2,
                color: "text-success",
              },
            ].map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border p-5 rounded-lg hover:border-border transition-all group"
              >
                <div
                  className={`w-10 h-10 rounded-md bg-muted flex items-center justify-center ${m.color} mb-4`}
                >
                  <m.icon className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {m.value?.toLocaleString()}
                </div>
                <div className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                  {m.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* 2. CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">
                Conversations Per Day
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data?.dailyActivity.conversations}>
                    <defs>
                      <linearGradient
                        id="colorConv"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid {...gridProps} />
                    <XAxis dataKey="date" {...axisProps} tickFormatter={(s) => s.split("-")[2]} />
                    <YAxis {...axisProps} width={32} />
                    <Tooltip {...tooltipProps} />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorConv)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">
                Messages Per Day
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.dailyActivity.messages}>
                    <CartesianGrid {...gridProps} />
                    <XAxis dataKey="date" {...axisProps} tickFormatter={(s) => s.split("-")[2]} />
                    <YAxis {...axisProps} width={32} />
                    <Tooltip {...tooltipProps} />
                    <Bar dataKey="count" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 3. CATEGORY DISTRIBUTION PIE */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">
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
                        <Cell
                          key={`cell-${i}`}
                          fill={COLORS[i % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip {...tooltipProps} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold text-foreground">
                    {data?.overview.totalUserMessages.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase">
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
                    <div className="flex items-center gap-2 text-muted-foreground capitalize">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      />
                      {c.name}
                    </div>
                    <span className="text-foreground font-medium">
                      {c.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. FEEDBACK STATS */}
            <div className="bg-card border border-border rounded-lg p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-6">
                  Feedback Insights
                </h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-success">
                        <ThumbsUp className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          Helpful
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Positive responses
                        </div>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-foreground">
                      {data?.feedback.helpfulCount.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                        <ThumbsDown className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          Unhelpful
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Corrective needed
                        </div>
                      </div>
                    </div>
                    <div className="text-xl font-bold text-foreground">
                      {data?.feedback.unhelpfulCount.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-auto pt-8">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm text-muted-foreground font-medium">
                    Approval Rating
                  </span>
                  <span className="text-2xl font-bold text-primary dark:text-primary">
                    {Math.round((data?.feedback.ratio || 0) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(data?.feedback.ratio || 0) * 100}%` }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* 5. TOP SOURCES */}
            <div className="bg-card border border-border rounded-lg p-6 overflow-hidden">
              <h2 className="text-lg font-semibold text-foreground mb-6">
                Top Data Sources
              </h2>
              <div className="space-y-4">
                {data?.topSources && data.topSources.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground text-sm italic">
                    No source data
                  </div>
                ) : (
                  data?.topSources?.map((s, i) => (
                    <div
                      key={s.url}
                      className="flex items-center justify-between group/row"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="text-[10px] font-mono text-muted-foreground w-4 shrink-0">
                          {i + 1}
                        </span>
                        <GlobalTooltip content={s.url}>
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-muted-foreground truncate hover:text-primary dark:text-primary flex items-center gap-1 transition-colors min-w-0"
                          >
                            {s.url}
                            <ExternalLink className="w-2 h-2 opacity-0 group-hover/row:opacity-100 shrink-0" />
                          </a>
                        </GlobalTooltip>
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0 ml-4">
                        {s.count.toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 6. TOP QUESTIONS */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  Top User Questions
                </h2>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                  Trending
                </span>
              </div>
              <div className="divide-y divide-white/5">
                {data?.topQuestions?.map((q, i) => (
                  <div
                    key={q.question}
                    className="p-4 bg-card border border-border transition-colors group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4 min-w-0 pr-4">
                      <span className="text-xs text-muted-foreground font-mono italic">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-sm text-foreground truncate pr-2 italic">
                        &quot;{q.question}&quot;
                      </p>
                    </div>
                    <div className="text-xs font-bold text-primary/80 bg-primary-subtle px-2.5 py-1 rounded-lg shrink-0">
                      {q.count.toLocaleString()} times
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. UNANSWERED / LOW CONFIDENCE */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-warning/10 flex items-center justify-center text-warning">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        Unanswered Queries
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Bots couldn&apos;t find information
                      </p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-warning">
                    {data?.unanswered.count.toLocaleString()}
                  </div>
                </div>
                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                  {data?.unanswered?.list?.map((u, i) => (
                    <div
                      key={i}
                      className="text-xs p-3 bg-muted/50 rounded-md text-muted-foreground border border-border"
                    >
                      <MarkdownMessage
                        content={u.content}
                        linkColor="text-primary"
                        codeBg="bg-accent"
                        preBg="bg-accent"
                      />
                    </div>
                  ))}
                  {(!data?.unanswered?.count ||
                    data.unanswered.count === 0) && (
                    <div className="text-center py-4 text-success/50 text-sm">
                      Perfect Performance! 🌟
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-rose-500/10 flex items-center justify-center text-rose-500">
                      <TrendingUp className="w-5 h-5 rotate-180" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        Low Confidence
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Responses below 50% threshold
                      </p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-rose-500">
                    {data?.lowConfidence.count.toLocaleString()}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 max-h-[240px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                  {data?.lowConfidence?.samples?.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 bg-muted/30 rounded-lg text-[10px]"
                    >
                      <span className="text-muted-foreground truncate max-w-[80%] italic pr-2">
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
        </>
      )}
    </div>
  );
}
