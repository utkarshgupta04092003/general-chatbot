import { auth } from "@/lib/auth";
import { CHAT_ROLES, FEEDBACK_TEXT } from "@/lib/config";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const chatbotId = searchParams.get("chatbotId");

    if (!chatbotId) {
      return NextResponse.json(
        { error: "chatbotId is required" },
        { status: 400 },
      );
    }

    const chatbot = await prisma.chatbot.findFirst({
      where: { id: chatbotId, userId: session.user.id, deleted: false },
    });

    if (!chatbot) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });
    }

    const baseMessageWhere = {
      conversation: { chatbotId, deleted: false },
      deleted: false,
    };

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // --- HIGHLY PARALLELIZED DB BATCH ---
    // Executing ~12 queries concurrently to maximize speed while avoiding complex groupBy bugs
    const [
      totalConversations,
      totalMessages,
      totalUserMessages,
      totalAssistantMessages,
      uniqueSessionsGroup,
      convHistory,
      msgHistory,
      unansweredCount,
      unansweredList,
      lowConfidenceCount,
      lowConfidenceSamples,
      helpfulCount,
      unhelpfulCount,
      pricingCount,
      productCount,
      supportCount,
      otherCount,
      topSourcesResult,
    ] = await Promise.all([
      prisma.conversation.count({ where: { chatbotId, deleted: false } }),
      prisma.message.count({
        where: { ...baseMessageWhere, role: CHAT_ROLES.ASSISTANT },
      }),
      prisma.message.count({
        where: { ...baseMessageWhere, role: CHAT_ROLES.USER },
      }),
      prisma.message.count({
        where: { ...baseMessageWhere, role: CHAT_ROLES.ASSISTANT },
      }),
      prisma.conversation.groupBy({
        by: ["sessionId"],
        where: { chatbotId, deleted: false },
      }),
      prisma.conversation.findMany({
        where: { chatbotId, deleted: false, createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true },
      }),
      prisma.message.findMany({
        where: {
          ...baseMessageWhere,
          role: CHAT_ROLES.ASSISTANT,
          createdAt: { gte: thirtyDaysAgo },
        },
        select: { createdAt: true },
      }),
      prisma.message.count({
        where: {
          ...baseMessageWhere,
          role: CHAT_ROLES.ASSISTANT,
          unanswered: true,
        },
      }),
      prisma.message.findMany({
        where: {
          ...baseMessageWhere,
          role: CHAT_ROLES.ASSISTANT,
          unanswered: true,
        },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: { content: true, createdAt: true },
      }),
      prisma.message.count({
        where: {
          ...baseMessageWhere,
          role: CHAT_ROLES.ASSISTANT,
          confidence: { lt: 0.5 },
        },
      }),
      prisma.message.findMany({
        where: {
          ...baseMessageWhere,
          role: CHAT_ROLES.ASSISTANT,
          confidence: { lt: 0.5 },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: { content: true, confidence: true, createdAt: true },
      }),
      prisma.message.count({
        where: { ...baseMessageWhere, feedback: FEEDBACK_TEXT.HELPFUL },
      }),
      prisma.message.count({
        where: { ...baseMessageWhere, feedback: FEEDBACK_TEXT.UNHELPFUL },
      }),
      // Individual category counts (safer than groupBy for content strings in Mongo)
      prisma.message.count({
        where: {
          ...baseMessageWhere,
          role: CHAT_ROLES.USER,
          category: "pricing",
        },
      }),
      prisma.message.count({
        where: {
          ...baseMessageWhere,
          role: CHAT_ROLES.USER,
          category: "product",
        },
      }),
      prisma.message.count({
        where: {
          ...baseMessageWhere,
          role: CHAT_ROLES.USER,
          category: "support",
        },
      }),
      prisma.message.count({
        where: {
          ...baseMessageWhere,
          role: CHAT_ROLES.USER,
          category: "other",
        },
      }),
      prisma.message.findMany({
        where: {
          ...baseMessageWhere,
          role: CHAT_ROLES.ASSISTANT,
          sourceUrls: { isEmpty: false },
        },
        select: { sourceUrls: true },
      }),
    ]);

    // --- TOP QUESTIONS (Separate as it's the only one that needs grouping by content) ---
    const topQuestionsResult = await prisma.message
      .groupBy({
        by: ["content"],
        where: { ...baseMessageWhere, role: CHAT_ROLES.USER },
        _count: { content: true },
        orderBy: { _count: { content: "desc" } },
        take: 10,
      })
      .catch(() => []);

    // --- IN-MEMORY PROCESSING ---

    // Process Daily Activity
    const dailyConversations: Record<string, number> = {};
    convHistory.forEach((c) => {
      const date = c.createdAt.toISOString().split("T")[0];
      dailyConversations[date] = (dailyConversations[date] || 0) + 1;
    });

    const dailyMessages: Record<string, number> = {};
    msgHistory.forEach((m) => {
      const date = m.createdAt.toISOString().split("T")[0];
      dailyMessages[date] = (dailyMessages[date] || 0) + 1;
    });

    // Process Data Sources
    const sourceFrequency: Record<string, number> = {};
    topSourcesResult.forEach((m) => {
      m.sourceUrls.forEach((url) => {
        sourceFrequency[url] = (sourceFrequency[url] || 0) + 1;
      });
    });

    const topSources = Object.entries(sourceFrequency)
      .map(([url, count]) => ({ url, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const totalFeedback = helpfulCount + unhelpfulCount;

    return NextResponse.json({
      overview: {
        totalConversations,
        totalMessages,
        totalUserMessages,
        totalAssistantMessages,
        uniqueSessions: uniqueSessionsGroup.length,
      },
      dailyActivity: {
        conversations: Object.entries(dailyConversations).map(
          ([date, count]) => ({ date, count }),
        ),
        messages: Object.entries(dailyMessages).map(([date, count]) => ({
          date,
          count,
        })),
      },
      topQuestions: topQuestionsResult.map((q) => ({
        question: q.content,
        count: q._count.content,
      })),
      unanswered: {
        count: unansweredCount,
        list: unansweredList,
      },
      lowConfidence: {
        count: lowConfidenceCount,
        samples: lowConfidenceSamples,
      },
      feedback: {
        helpfulCount,
        unhelpfulCount,
        ratio: totalFeedback > 0 ? helpfulCount / totalFeedback : 0,
      },
      categories: {
        pricing: pricingCount,
        product: productCount,
        support: supportCount,
        other: otherCount,
      },
      engagement: {
        avgMessagesPerConversation:
          totalConversations > 0 ? totalMessages / totalConversations : 0,
        avgUserMessagesPerConversation:
          totalConversations > 0 ? totalUserMessages / totalConversations : 0,
      },
      successRate:
        totalUserMessages > 0
          ? (totalAssistantMessages - unansweredCount) / totalUserMessages
          : 0,
      topSources,
    });
  } catch (error) {
    console.error("Analytics API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
