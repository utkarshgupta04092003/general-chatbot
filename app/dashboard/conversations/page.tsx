import { ANALYTICS_EVENTS } from "@/lib/config";
import PostHogClient from "@/lib/posthog";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { ConversationsList } from "./_components/ConversationsList";

export default async function ConversationsPage() {
  const session = await requireAuth();

  const posthog = PostHogClient();
  posthog.capture({
    distinctId: session.user.id,
    event: ANALYTICS_EVENTS.CONVERSATIONS_VIEWED,
  });
  await posthog.shutdown();

  const conversations = await prisma.conversation.findMany({
    where: { chatbot: { userId: session.user.id, deleted: false } },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
      chatbot: { select: { name: true, id: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Conversations</h1>
        <p className="text-muted-foreground text-sm mt-1">
          All chats your visitors have had with your chatbots.
        </p>
      </div>

      <ConversationsList conversations={conversations} />
    </div>
  );
}
