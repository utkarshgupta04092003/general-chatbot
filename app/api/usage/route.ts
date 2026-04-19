import { auth } from "@/lib/auth";
import { CHAT_ROLES } from "@/lib/config";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [chatbotCount, pageCount, messageCount] = await Promise.all([
      prisma.chatbot.count({
        where: { userId, deleted: false },
      }),
      prisma.dataSource.count({
        where: {
          chatbot: { userId, deleted: false },
          deleted: false,
        },
      }),
      prisma.message.count({
        where: {
          conversation: { chatbot: { userId, deleted: false } },
          role: CHAT_ROLES.ASSISTANT,
          createdAt: { gte: startOfMonth },
          deleted: false,
        },
      }),
    ]);

    return NextResponse.json({ chatbotCount, pageCount, messageCount });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch usage";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
