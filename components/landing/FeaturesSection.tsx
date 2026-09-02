import {
  BarChart3,
  Code2,
  Globe,
  MessageSquare,
  Shield,
  Sparkles,
} from "lucide-react";

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4 bg-card/30">
      <div className="max-w-[70rem] mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-subtle border border-primary/20 rounded-full text-xs text-primary font-medium mb-4">
            Everything you need
          </div>
          <h2 className="text-4xl font-bold mb-4">
            Powerful features, simple interface
          </h2>
          <p className="text-muted-foreground text-lg">
            Built for non-technical teams who want enterprise-grade AI.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Globe,
              title: "Auto URL Discovery",
              desc: "Automatically crawl and index all public pages from your domain.",
            },
            {
              icon: Sparkles,
              title: "Gemini-3 Powered",
              desc: "State-of-the-art AI with retrieval-augmented generation for accurate answers.",
            },
            {
              icon: MessageSquare,
              title: "Conversation History",
              desc: "Full history of every conversation your chatbot has had with visitors.",
            },
            {
              icon: BarChart3,
              title: "Analytics Dashboard",
              desc: "Track queries, users, and performance with beautiful real-time charts.",
            },
            {
              icon: Code2,
              title: "1-Line Embed",
              desc: "Add the chatbot to any website with a single script tag. No framework required.",
            },
            {
              icon: Shield,
              title: "Data Privacy",
              desc: "Your data stays yours. SOC 2 compliant storage with enterprise security.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-card border border-border rounded-md p-6 hover:border-primary/30 transition-all group"
            >
              <div className="w-10 h-10 bg-primary-subtle rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-subtle transition-colors">
                <feature.icon className="w-5 h-5 text-primary dark:text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
