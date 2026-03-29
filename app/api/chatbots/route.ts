import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json();

    const chatbot = await prisma.chatbot.create({
      data: {
        userId: session.user.id,
        name: name || "AI Assistant",
        welcomeMessage: `Hello! I'm ${name || "AI Assistant"}. How can I help you today?`,
        status: "training",
      },
    });

    return NextResponse.json({ chatbot });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to create chatbot";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chatbots = await prisma.chatbot.findMany({
      where: { userId: session.user.id },
      include: {
        dataSources: { select: { url: true }, take: 1 },
        _count: { select: { conversations: true, dataSources: true } },
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
