import { Code2, Globe, Sparkles } from "lucide-react";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4">
      <div className="max-w-[70rem] mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs text-primary font-medium mb-4">
            Simple Setup
          </div>
          <h2 className="text-4xl font-bold mb-4">Ready in 3 simple steps</h2>
          <p className="text-muted-foreground text-lg">
            No engineering team required. Set up in under 2 minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              icon: Globe,
              title: "Paste your URL",
              description:
                "Enter your website URL and we'll automatically crawl and discover all your public pages.",
              color: "bg-primary",
            },
            {
              step: "02",
              icon: Sparkles,
              title: "AI trains instantly",
              description:
                "We extract, chunk, and convert your content into smart embeddings stored in our vector database.",
              color: "bg-primary",
            },
            {
              step: "03",
              icon: Code2,
              title: "Embed on your site",
              description:
                "Copy one line of code and paste it on your website. The chatbot goes live instantly.",
              color: "bg-primary",
            },
          ].map((item, index) => (
            <div
              key={item.step}
              className="relative group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-card border border-border rounded-lg p-8 hover:border-border transition-all h-full">
                <div className="text-muted-foreground text-sm font-mono mb-4">
                  {item.step}
                </div>
                <div
                  className={`w-10 h-10 ${item.color} rounded-md flex items-center justify-center mb-5`}
                >
                  <item.icon className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
              {index < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 text-muted-foreground z-10">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
