import { ANALYTICS_EVENTS } from "@/lib/config";
import PostHogClient from "@/lib/posthog";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { MessageSquare } from "lucide-react";
import { ConversationItem } from "./_components/ConversationItem";

export default async function ConversationsPage() {
  const session = await requireAuth();

  const posthog = PostHogClient();
  posthog.capture({
    distinctId: session.user.id,
    event: ANALYTICS_EVENTS.CONVERSATIONS_VIEWED,
  });
  await posthog.shutdown();

  const conversations = await prisma.conversation.findMany({
    where: { chatbot: { userId: session.user.id } },
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
        <p className="text-slate-400 text-sm mt-1">
          All chats your visitors have had with your chatbots.
        </p>
      </div>

      {conversations.length === 0 ? (
        <div className="text-center py-20 bg-slate-800/30 border border-white/5 rounded-2xl">
          <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-300 mb-2">
            No conversations yet
          </h3>
          <p className="text-slate-500 text-sm">
            Conversations will appear here once visitors start chatting with
            your bot.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {conversations.map((conv) => (
            <ConversationItem key={conv.id} conversation={conv} />
          ))}
        </div>
      )}
    </div>
  );
}
