import DemoChat from "@/components/DemoChat";
import { APP_NAME } from "@/lib/config";
import { CheckCircle } from "lucide-react";

export function DemoSection() {
  return (
    <section id="demo" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-success/10 border border-green-500/20 rounded-full text-xs text-success font-medium mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Live Demo
            </div>
            <h2 className="text-4xl font-bold mb-6">See it in action</h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              This demo chatbot is trained on our own documentation. Ask it
              anything about {APP_NAME} and see how it responds with accurate,
              context-aware answers.
            </p>
            <ul className="space-y-3">
              {[
                "Answers only from your content",
                "Instant, streaming responses",
                "Remembers conversation context",
                "Handles follow-up questions",
              ].map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-3 text-muted-foreground"
                >
                  <CheckCircle className="w-5 h-5 text-success shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <DemoChat />
          </div>
        </div>
      </div>
    </section>
  );
}
