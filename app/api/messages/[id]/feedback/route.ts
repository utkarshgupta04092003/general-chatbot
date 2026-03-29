import { FEEDBACK_TEXT } from "@/lib/config";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { feedback } = await req.json(); // "helpful", "unhelpful", or null

    if (
      feedback !== FEEDBACK_TEXT.HELPFUL &&
      feedback !== FEEDBACK_TEXT.UNHELPFUL &&
      feedback !== null
    ) {
      return NextResponse.json({ error: "Invalid feedback" }, { status: 400 });
    }

    await prisma.message.update({
      where: { id },
      data: { feedback },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Feedback failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
