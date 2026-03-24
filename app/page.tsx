import Link from "next/link";
import {
  Zap,
  Globe,
  MessageSquare,
  Code2,
  CheckCircle,
  Star,
  ArrowRight,
  ChevronDown,
  BarChart3,
  Shield,
  Sparkles,
  Play,
} from "lucide-react";
import DemoChat from "@/components/DemoChat";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" fill="white" />
              </div>
              <span className="text-lg font-bold">ChatBase</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-sm text-slate-400 hover:text-white transition-colors">How it works</a>
              <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-sm text-slate-400 hover:text-white transition-colors">Pricing</a>
              <a href="#faq" className="text-sm text-slate-400 hover:text-white transition-colors">FAQ</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm text-slate-300 hover:text-white transition-colors hidden sm:block">
                Sign in
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-all"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 hero-gradient">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-[160px] opacity-15" />
          <div className="absolute top-40 right-1/4 w-72 h-72 bg-violet-600 rounded-full blur-[160px] opacity-10" />
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-cyan-500 rounded-full blur-[120px] opacity-5" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs text-indigo-300 font-medium mb-8 animate-fade-in-up">
            <Sparkles className="w-3 h-3" />
            Powered by GPT-4 + RAG Technology
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in-up delay-100">
            Train an AI chatbot on{" "}
            <span className="gradient-text">your website</span>
            {" "}in minutes
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
            Paste your URL, and instantly create a chatbot that answers questions based on your content.{" "}
            <strong className="text-white">No coding required.</strong>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up delay-300">
            <Link
              href="/signup"
              className="group flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all text-lg shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#demo"
              className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-all"
            >
              <Play className="w-4 h-4 text-indigo-400" />
              See Demo
            </a>
          </div>

          {/* Stats bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pb-16 animate-fade-in-up delay-400">
            {[
              { value: "2 min", label: "Average setup time" },
              { value: "10K+", label: "Websites indexed" },
              { value: "99.9%", label: "Uptime guaranteed" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Hero browser mockup */}
          <div className="relative mx-auto max-w-4xl animate-fade-in-up delay-500">
            <div className="bg-slate-900 rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-indigo-500/10">
              {/* Browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 mx-4 bg-slate-700/50 rounded-lg px-3 py-1 text-xs text-slate-400">
                  app.chatbase.ai/dashboard
                </div>
              </div>
              {/* Dashboard preview */}
              <div className="p-6 grid grid-cols-3 gap-4">
                <div className="col-span-1 space-y-3">
                  {["Overview", "Conversations", "Data Sources", "Settings", "Embed"].map((item, i) => (
                    <div key={item}
                      className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${i === 0 ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-white" : "bg-slate-600"}`} />
                      {item}
                    </div>
                  ))}
                </div>
                <div className="col-span-2 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Total Conversations", value: "1,234", color: "text-indigo-400" },
                      { label: "Messages Today", value: "89", color: "text-green-400" },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-white/5 rounded-xl p-4">
                        <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                        <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-xs text-slate-400 mb-3">Recent Conversations</div>
                    {[
                      "What are your pricing plans?",
                      "How do I integrate the chatbot?",
                      "Does it support multiple languages?",
                    ].map((msg) => (
                      <div key={msg} className="flex items-center gap-2 py-1.5">
                        <div className="w-1 h-1 rounded-full bg-indigo-400" />
                        <span className="text-xs text-slate-500 truncate">{msg}</span>
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
                <span className="text-xs font-semibold text-slate-700">AI Assistant</span>
                <div className="ml-auto w-2 h-2 rounded-full bg-green-500" />
              </div>
              <div className="bg-indigo-50 rounded-lg p-2 text-xs text-slate-600">
                👋 Hi! How can I help you today?
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-12 border-y border-white/5 bg-slate-900/30">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-center text-sm text-slate-500 mb-8">Trusted by teams at</p>
          <div className="flex items-center justify-center gap-12 flex-wrap opacity-40 grayscale">
            {["Acme Corp", "TechFlow", "DataSync", "CloudBase", "NovaSoft"].map((brand) => (
              <span key={brand} className="text-lg font-bold text-white tracking-wide">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-xs text-violet-300 font-medium mb-4">
              Simple Setup
            </div>
            <h2 className="text-4xl font-bold mb-4">Ready in 3 simple steps</h2>
            <p className="text-slate-400 text-lg">No engineering team required. Set up in under 2 minutes.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Globe,
                title: "Paste your URL",
                description: "Enter your website URL and we'll automatically crawl and discover all your public pages.",
                color: "from-indigo-600 to-indigo-700",
                glow: "shadow-indigo-500/25",
              },
              {
                step: "02",
                icon: Sparkles,
                title: "AI trains instantly",
                description: "We extract, chunk, and convert your content into smart embeddings stored in our vector database.",
                color: "from-violet-600 to-violet-700",
                glow: "shadow-violet-500/25",
              },
              {
                step: "03",
                icon: Code2,
                title: "Embed on your site",
                description: "Copy one line of code and paste it on your website. The chatbot goes live instantly.",
                color: "from-cyan-600 to-cyan-700",
                glow: "shadow-cyan-500/25",
              },
            ].map((item, index) => (
              <div
                key={item.step}
                className="relative group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all h-full">
                  <div className="text-slate-600 text-sm font-mono mb-4">{item.step}</div>
                  <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-6 shadow-lg ${item.glow}`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 text-slate-600 z-10">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 bg-slate-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs text-indigo-300 font-medium mb-4">
              Everything you need
            </div>
            <h2 className="text-4xl font-bold mb-4">Powerful features, simple interface</h2>
            <p className="text-slate-400 text-lg">Built for non-technical teams who want enterprise-grade AI.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Globe, title: "Auto URL Discovery", desc: "Automatically crawl and index all public pages from your domain." },
              { icon: Sparkles, title: "GPT-4 Powered", desc: "State-of-the-art AI with retrieval-augmented generation for accurate answers." },
              { icon: MessageSquare, title: "Conversation History", desc: "Full history of every conversation your chatbot has had with visitors." },
              { icon: BarChart3, title: "Analytics Dashboard", desc: "Track queries, users, and performance with beautiful real-time charts." },
              { icon: Code2, title: "1-Line Embed", desc: "Add the chatbot to any website with a single script tag. No framework required." },
              { icon: Shield, title: "Data Privacy", desc: "Your data stays yours. SOC 2 compliant storage with enterprise security." },
            ].map((feature) => (
              <div key={feature.title} className="bg-slate-900 border border-white/5 rounded-xl p-6 hover:border-indigo-500/30 transition-all group">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo chatbot */}
      <section id="demo" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-xs text-green-300 font-medium mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Live Demo
              </div>
              <h2 className="text-4xl font-bold mb-6">See it in action</h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                This demo chatbot is trained on our own documentation. Ask it anything about ChatBase and see how it responds with accurate, context-aware answers.
              </p>
              <ul className="space-y-3">
                {[
                  "Answers only from your content",
                  "Instant, streaming responses",
                  "Remembers conversation context",
                  "Handles follow-up questions",
                ].map((point) => (
                  <li key={point} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
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

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 bg-slate-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs text-indigo-300 font-medium mb-4">
              Simple Plans
            </div>
            <h2 className="text-4xl font-bold mb-4">Start free, scale as you grow</h2>
            <p className="text-slate-400 text-lg">No credit card required to get started.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                description: "Perfect for testing",
                features: ["10 pages indexed", "100 messages/month", "1 chatbot", "Basic analytics", "Embed on 1 site"],
                cta: "Start Free",
                popular: false,
                href: "/signup",
              },
              {
                name: "Pro",
                price: "$29",
                period: "/month",
                description: "For growing businesses",
                features: ["500 pages indexed", "5,000 messages/month", "5 chatbots", "Advanced analytics", "Unlimited embeds", "Priority support", "Custom branding"],
                cta: "Start Pro Trial",
                popular: true,
                href: "/signup",
              },
              {
                name: "Enterprise",
                price: "$99",
                period: "/month",
                description: "For large organizations",
                features: ["Unlimited pages", "Unlimited messages", "Unlimited chatbots", "Custom AI model", "SSO & SAML", "SLA guarantee", "Dedicated support"],
                cta: "Contact Sales",
                popular: false,
                href: "/signup",
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? "bg-indigo-600 border-2 border-indigo-400 shadow-2xl shadow-indigo-500/30"
                    : "bg-slate-900 border border-white/5"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-indigo-600 text-xs font-bold rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <div className="mb-6">
                  <div className="text-sm text-slate-400 mb-1">{plan.name}</div>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className={`text-sm mb-1.5 ${plan.popular ? "text-indigo-200" : "text-slate-500"}`}>{plan.period}</span>
                  </div>
                  <p className={`text-sm ${plan.popular ? "text-indigo-200" : "text-slate-500"}`}>{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <CheckCircle className={`w-4 h-4 shrink-0 ${plan.popular ? "text-indigo-200" : "text-indigo-400"}`} />
                      <span className={plan.popular ? "text-indigo-100" : "text-slate-300"}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`block text-center py-3 rounded-xl font-medium text-sm transition-all ${
                    plan.popular
                      ? "bg-white text-indigo-600 hover:bg-indigo-50"
                      : "bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Loved by teams worldwide</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Chen",
                role: "Head of CX at TechFlow",
                content: "We reduced support tickets by 60% in the first month. Setup took literally 3 minutes.",
                rating: 5,
              },
              {
                name: "Marcus Rodriguez",
                role: "Founder at DataSync",
                content: "Our customers love getting instant answers 24/7. ChatBase paid for itself in week one.",
                rating: 5,
              },
              {
                name: "Emily Watson",
                role: "Product Lead at Acme Corp",
                content: "I was skeptical about AI accuracy, but it answers questions from our docs perfectly.",
                rating: 5,
              },
            ].map((testimonial) => (
              <div key={testimonial.name} className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">&ldquo;{testimonial.content}&rdquo;</p>
                <div>
                  <div className="font-medium text-sm">{testimonial.name}</div>
                  <div className="text-xs text-slate-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4 bg-slate-900/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Frequently asked questions</h2>
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
              <details key={faq.q} className="group bg-slate-900 border border-white/5 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-medium text-white hover:text-indigo-300 transition-colors">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/50 to-violet-700/50" />
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-white rounded-full blur-[100px] opacity-10" />
            <div className="relative">
              <h2 className="text-4xl font-bold mb-4">Ready to build your chatbot?</h2>
              <p className="text-indigo-100 text-lg mb-8">
                Join thousands of companies using ChatBase to answer customer questions 24/7.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-all text-lg"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-indigo-200 text-sm mt-4">No credit card required · Set up in 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" fill="white" />
              </div>
              <span className="font-bold">ChatBase</span>
            </div>
            <div className="flex gap-8 text-sm text-slate-500">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Blog</a>
              <a href="#" className="hover:text-white transition-colors">Docs</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
            <div className="text-sm text-slate-600">
              © 2026 ChatBase. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
