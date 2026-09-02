import { auth } from "@/lib/auth";
import { ANALYTICS_EVENTS } from "@/lib/config";
import PostHogClient, { flushPostHog } from "@/lib/posthog";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const posthog = PostHogClient();
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();

    await prisma.chatbot.updateMany({
      where: { id, userId: session.user.id, deleted: false },
      data: {
        name: body.name,
        welcomeMessage: body.welcomeMessage,
        tone: body.tone,
        systemPrompt: body.systemPrompt,
        agentType: body.agentType,
        primaryColor: body.primaryColor,
        assistantLogo: body.assistantLogo,
        websiteLogo: body.websiteLogo,
        supportEmail: body.supportEmail,
        supportPhone: body.supportPhone,
        supportWhatsapp: body.supportWhatsapp,
        contactPageLink: body.contactPageLink,
        theme: body.theme,
        model: body.model,
      },
    });

    posthog.capture({
      distinctId: session.user.id,
      event: ANALYTICS_EVENTS.CHATBOT_SETTINGS_UPDATED,
      properties: {
        chatbotId: id,
        updatedFields: Object.keys(body),
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    flushPostHog(posthog);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const posthog = PostHogClient();
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    await prisma.chatbot.updateMany({
      where: { id, userId: session.user.id },
      data: { deleted: true },
    });

    posthog.capture({
      distinctId: session.user.id,
      event: ANALYTICS_EVENTS.CHATBOT_DELETED,
      properties: {
        chatbotId: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    flushPostHog(posthog);
  }
}
