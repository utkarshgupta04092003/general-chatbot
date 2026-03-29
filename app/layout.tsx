import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { APP_NAME } from "@/lib/config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: APP_NAME,
  description:
    "Train an AI chatbot on your website in minutes. Paste your URL, and instantly create a chatbot that answers questions based on your content.",
  keywords: ["AI chatbot", "website chatbot", "knowledge base", "RAG", "SaaS"],
  openGraph: {
    title: `${APP_NAME} — AI Chatbot for Your Website`,
    description: "Train an AI chatbot on your website in minutes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
