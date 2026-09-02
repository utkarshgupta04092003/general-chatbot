import { auth } from "@/lib/auth";
import { ANALYTICS_EVENTS, DEFAULT_SYSTEM_PROMPT, PLAN_LIMITS, ENABLE_USAGE_LIMITS } from "@/lib/config";
import PostHogClient, { flushPostHog } from "@/lib/posthog";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const posthog = PostHogClient();
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json();

    // Check plan limit before creating
    const existingCount = await prisma.chatbot.count({
      where: { userId: session.user.id, deleted: false },
    });
    if (ENABLE_USAGE_LIMITS && existingCount >= PLAN_LIMITS.FREE.MAX_CHATBOTS) {
      return NextResponse.json(
        {
          error: "LIMIT_REACHED",
          message: `You have reached the maximum of ${PLAN_LIMITS.FREE.MAX_CHATBOTS} chatbot(s) on the Free plan.`,
        },
        { status: 403 },
      );
    }

    const chatbot = await prisma.chatbot.create({
      data: {
        userId: session.user.id,
        name: name || "AI Assistant",
        welcomeMessage: `Hello! I'm ${name || "AI Assistant"}. How can I help you today?`,
        systemPrompt: DEFAULT_SYSTEM_PROMPT,
        status: "training",
      },
    });

    posthog.capture({
      distinctId: session.user.id,
      event: ANALYTICS_EVENTS.CHATBOT_CREATED,
      properties: {
        chatbotId: chatbot.id,
        name: chatbot.name,
      },
    });

    return NextResponse.json({ chatbot });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to create chatbot";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    flushPostHog(posthog);
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chatbots = await prisma.chatbot.findMany({
      where: { userId: session.user.id, deleted: false },
      include: {
        dataSources: {
          where: { deleted: false },
          select: { url: true },
          take: 1,
        },
        _count: {
          select: {
            conversations: { where: { deleted: false } },
            dataSources: { where: { deleted: false } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ chatbots });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch chatbots";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
