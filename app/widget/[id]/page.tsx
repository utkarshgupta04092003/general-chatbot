import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ChatWidget from "@/components/ChatWidget";

export default async function WidgetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chatbot = await prisma.chatbot.findUnique({ where: { id } });
  if (!chatbot) notFound();

  return (
    <div className="min-h-screen bg-transparent">
      <ChatWidget
        chatbotId={chatbot.id}
        chatbotName={chatbot.name}
        welcomeMessage={chatbot.welcomeMessage}
        primaryColor={chatbot.primaryColor}
      />
    </div>
  );
}
