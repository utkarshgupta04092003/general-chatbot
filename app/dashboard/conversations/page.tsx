import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatRelativeTime } from "@/lib/utils";
import { MessageSquare, ChevronDown, User, Bot } from "lucide-react";

export default async function ConversationsPage() {
  const session = await requireAuth();

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
        <p className="text-slate-400 text-sm mt-1">All chats your visitors have had with your chatbots.</p>
      </div>

      {conversations.length === 0 ? (
        <div className="text-center py-20 bg-slate-800/30 border border-white/5 rounded-2xl">
          <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-300 mb-2">No conversations yet</h3>
          <p className="text-slate-500 text-sm">Conversations will appear here once visitors start chatting with your bot.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {conversations.map((conv) => (
            <details key={conv.id} className="group bg-slate-800/50 border border-white/5 rounded-2xl overflow-hidden">
              <summary className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/3 transition-colors list-none">
                <div className="w-9 h-9 bg-indigo-500/10 rounded-xl flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-white">
                    {conv.messages[0]?.content?.slice(0, 80) ?? "Empty conversation"}
                    {(conv.messages[0]?.content?.length ?? 0) > 80 ? "..." : ""}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {conv.chatbot.name} · {conv.messages.length} messages · {formatRelativeTime(conv.createdAt)}
                  </div>
                </div>
                <ChevronDown className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform shrink-0" />
              </summary>
              <div className="border-t border-white/5 px-5 py-4 space-y-3 max-h-80 overflow-y-auto">
                {conv.messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && (
                      <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-slate-700 text-slate-200 rounded-bl-none"
                    }`}>
                      <p>{msg.content}</p>
                      <div className={`text-xs mt-1.5 ${msg.role === "user" ? "text-indigo-200" : "text-slate-500"}`}>
                        {formatRelativeTime(msg.createdAt)}
                      </div>
                    </div>
                    {msg.role === "user" && (
                      <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
