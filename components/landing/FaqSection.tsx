import { ChevronDown } from "lucide-react";

export function FaqSection() {
  return (
    <section id="faq" className="py-24 px-4 bg-card/30">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Frequently asked questions
          </h2>
        </div>
        <div className="space-y-4">
          {[
            {
              q: "How accurate is the chatbot?",
              a: "The chatbot uses RAG (Retrieval-Augmented Generation) to answer questions directly from your content. It only answers what's in your data, so it's highly accurate and won't make things up.",
            },
            {
              q: "Do I need coding skills?",
              a: "Not at all! Paste your URL, confirm the pages, and your chatbot is ready. Embedding is one line of HTML — even a non-technical person can do it.",
            },
            {
              q: "How often is the chatbot updated?",
              a: "You can manually re-train your chatbot from the Data Sources page anytime. Pro and Enterprise plans support scheduled auto re-training.",
            },
            {
              q: "What websites does it support?",
              a: "Any publicly accessible website. We can crawl HTML pages, blog posts, documentation sites, marketing pages, and more. JavaScript-heavy SPAs may have limited support.",
            },
            {
              q: "Is my data secure?",
              a: "Yes. Your data is encrypted at rest and in transit, stored in isolated namespaces per user. We don't use your data to train our models.",
            },
            {
              q: "Can I customize the chatbot's appearance?",
              a: "Yes! You can set the chatbot name, welcome message, primary color, and tone from the Settings page. Pro plan includes full custom CSS.",
            },
          ].map((faq) => (
            <details
              key={faq.q}
              className="group bg-card border border-border rounded-xl overflow-hidden"
            >
              <summary className="flex items-center justify-between p-6 cursor-pointer font-medium text-foreground hover:text-indigo-600 dark:hover:text-indigo-500 transition-colors">
                {faq.q}
                <ChevronDown className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-6 pb-6 text-muted-foreground text-sm leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
