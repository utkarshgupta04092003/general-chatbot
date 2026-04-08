import ChatWidget from "@/components/ChatWidget";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function WidgetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chatbot = await prisma.chatbot.findUnique({ where: { id } });
  if (!chatbot) notFound();

  return (
    <div className="min-h-screen bg-transparent">
      <style
        dangerouslySetInnerHTML={{
          __html: "html, body { background-color: transparent !important; }",
        }}
      />
      <ChatWidget
        chatbotId={chatbot.id}
        chatbotName={chatbot.name}
        welcomeMessage={chatbot.welcomeMessage}
        primaryColor={chatbot.primaryColor}
        assistantLogo={chatbot.assistantLogo}
        websiteLogo={chatbot.websiteLogo}
      />
    </div>
  );
}
