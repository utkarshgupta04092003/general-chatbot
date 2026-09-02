import { ANALYTICS_EVENTS } from "@/lib/config";
import { PageHeader } from "@/components/ui";
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
        <PageHeader title="Conversations" description={"All chats your visitors have had with your chatbots."} />
      </div>

      <ConversationsList conversations={conversations} />
    </div>
  );
}
