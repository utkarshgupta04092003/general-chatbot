import { APP_NAME } from "@/lib/config";
import { ArrowRight, MessageSquare, Play, Sparkles } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";

export function HeroSection({ session }: { session: Session | null }) {
  return (
    <section className="relative pt-[8rem] pb-[6rem] px-[1.5rem] md:px-[3rem] hero-gradient overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[5rem] left-1/4 w-[24rem] h-[24rem] bg-indigo-600 rounded-full blur-[10rem] opacity-15" />
        <div className="absolute top-[10rem] right-1/4 w-[18rem] h-[18rem] bg-violet-600 rounded-full blur-[10rem] opacity-10" />
        <div className="absolute -bottom-[5rem] left-1/2 -translate-x-1/2 w-[37.5rem] h-[2.5rem] bg-cyan-500 rounded-full blur-[7.5rem] opacity-5" />
      </div>

      <div className="w-full max-w-[80rem] mx-auto text-center relative">
        <div className="inline-flex items-center gap-[0.5rem] px-[0.75rem] py-[0.375rem] bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[0.75rem] text-indigo-500 font-medium mb-[2rem] animate-fade-in-up">
          <Sparkles className="w-3 h-3" />
          Powered by Gemini-3 + RAG Technology
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight animate-fade-in-up delay-100">
          Build your own <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            AI Chatbot
          </span>{" "}
          in minutes
        </h1>

        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in-up delay-200">
          {APP_NAME} makes it easy to train a custom AI on your own data and add
          it to your website in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up delay-300">
          <Link
            href={session ? "/dashboard" : "/signup"}
            className="group flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all text-lg shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
          >
            {session ? "Go to Dashboard" : "Try It Out"}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="#demo"
            className="flex items-center gap-2 px-8 py-4 hover:bg-accent/50 bg-muted/30 hover:bg-accent/50 border border-border text-foreground font-medium rounded-xl transition-all"
          >
            <Play className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            See Demo
          </Link>
        </div>

        {/* Stats bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pb-16 animate-fade-in-up delay-400">
          {[
            { value: "2 min", label: "Average setup time" },
            { value: "10K+", label: "Websites indexed" },
            { value: "99.9%", label: "Uptime guaranteed" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold gradient-text">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Hero browser mockup */}
        <div className="relative mx-auto w-full max-w-[64rem] animate-fade-in-up delay-500 hidden md:block px-[1.5rem] lg:px-0">
          <div className="bg-card rounded-[1rem] border border-border overflow-hidden shadow-2xl shadow-indigo-500/10">
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 mx-4 bg-accent/50 rounded-lg px-3 py-1 text-xs text-muted-foreground">
                app.{APP_NAME.toLowerCase()}.ai/dashboard
              </div>
            </div>
            {/* Dashboard preview */}
            <div className="p-6 grid grid-cols-3 gap-4">
              <div className="col-span-1 space-y-3">
                {[
                  "Overview",
                  "Conversations",
                  "Data Sources",
                  "Settings",
                  "Embed",
                ].map((item, i) => (
                  <div
                    key={item}
                    className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${i === 0 ? "bg-indigo-600 text-white" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-white" : "bg-secondary"}`}
                    />
                    {item}
                  </div>
                ))}
              </div>
              <div className="col-span-2 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      label: "Total Conversations",
                      value: "1,234",
                      color: "text-indigo-400",
                    },
                    {
                      label: "Messages Today",
                      value: "89",
                      color: "text-green-400",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="hover:bg-accent/50 bg-muted/30 rounded-xl p-4"
                    >
                      <div className={`text-2xl font-bold ${stat.color}`}>
                        {stat.value}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="hover:bg-accent/50 bg-muted/30 rounded-xl p-4">
                  <div className="text-xs text-muted-foreground mb-3">
                    Recent Conversations
                  </div>
                  {[
                    "How do I setup the chatbot?",
                    "How do I integrate the chatbot?",
                    "Does it support multiple languages?",
                  ].map((msg) => (
                    <div key={msg} className="flex items-center gap-2 py-1.5">
                      <div className="w-1 h-1 rounded-full bg-indigo-400" />
                      <span className="text-xs text-muted-foreground truncate">
                        {msg}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating chat widget preview */}
          <div className="absolute -right-4 -bottom-4 bg-white rounded-2xl shadow-2xl shadow-black/30 w-48 p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                <MessageSquare className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-semibold text-slate-700">
                AI Assistant
              </span>
              <div className="ml-auto w-2 h-2 rounded-full bg-green-500" />
            </div>
            <div className="bg-indigo-50 rounded-lg p-2 text-xs text-slate-600">
              👋 Hi! How can I help you today?
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
