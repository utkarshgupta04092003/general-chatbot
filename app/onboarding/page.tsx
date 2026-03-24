"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Globe, CheckSquare, Square, AlertCircle, ArrowRight, ArrowLeft,
  Loader2, CheckCircle, Zap, FileText, Database, Sparkles, ShieldCheck, Flag
} from "lucide-react";

const STEPS = [
  { id: 1, label: "Enter URL" },
  { id: 2, label: "Select Pages" },
  { id: 3, label: "Permission" },
  { id: 4, label: "Preview" },
  { id: 5, label: "Processing" },
  { id: 6, label: "Done!" },
];

const PROCESSING_STEPS = [
  { label: "Scraping content", icon: Globe, delay: 1500 },
  { label: "Cleaning data", icon: FileText, delay: 1500 },
  { label: "Chunking text", icon: FileText, delay: 1500 },
  { label: "Generating embeddings", icon: Sparkles, delay: 2000 },
  { label: "Storing in vector database", icon: Database, delay: 2000 },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [url, setUrl] = useState("");
  const [crawledUrls, setCrawledUrls] = useState<string[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());
  const [scrapedPages, setScrapedPages] = useState<{ url: string; title: string; content: string; wordCount: number; status: string }[]>([]);
  const [chatbotId, setChatbotId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [processStep, setProcessStep] = useState(0);
  const [rootTitle, setRootTitle] = useState("");
  const [preview, setPreview] = useState("");

  // Step 1: Scan URL
  async function handleScan() {
    if (!url.trim()) { setError("Please enter a website URL"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCrawledUrls(data.urls);
      setSelectedUrls(new Set(data.urls));
      setRootTitle(data.rootTitle);
      setPreview(data.preview);
      setStep(2);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to scan URL");
    } finally {
      setLoading(false);
    }
  }

  // Toggle URL selection
  function toggleUrl(u: string) {
    setSelectedUrls((prev) => {
      const next = new Set(prev);
      next.has(u) ? next.delete(u) : next.add(u);
      return next;
    });
  }

  // Step 4: Scrape
  async function handleScrape() {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: Array.from(selectedUrls) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setScrapedPages(data.pages);
      setStep(4);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to extract content");
    } finally {
      setLoading(false);
    }
  }

  // Step 5: Process (create chatbot + embed)
  async function handleProcess() {
    setStep(5);
    setProcessStep(0);
    setError("");

    try {
      // Create chatbot
      const res = await fetch("/api/chatbots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: rootTitle || "AI Assistant" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const id = data.chatbot.id;
      setChatbotId(id);

      // Simulate processing steps
      for (let i = 0; i < PROCESSING_STEPS.length; i++) {
        setProcessStep(i);
        await new Promise((r) => setTimeout(r, PROCESSING_STEPS[i].delay));
      }

      // Embed content
      await fetch("/api/embed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatbotId: id, pages: scrapedPages }),
      });

      setProcessStep(PROCESSING_STEPS.length);
      setStep(6);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Processing failed");
      setStep(4);
    }
  }

  const totalWords = scrapedPages.reduce((acc, p) => acc + p.wordCount, 0);
  const totalTokens = Math.ceil(totalWords * 1.3);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" fill="white" />
          </div>
          <span className="font-bold">ChatBase</span>
        </div>
        <div className="text-sm text-slate-400">Step {step} of {STEPS.length}</div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-900 h-1">
        <div
          className="bg-gradient-to-r from-indigo-600 to-violet-600 h-1 transition-all duration-500"
          style={{ width: `${(step / STEPS.length) * 100}%` }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-center gap-4 py-6 px-4">
        {STEPS.map((s) => (
          <div key={s.id} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step > s.id ? "bg-indigo-600 text-white" :
              step === s.id ? "bg-indigo-600/30 border-2 border-indigo-500 text-indigo-300" :
              "bg-slate-800 text-slate-600"
            }`}>
              {step > s.id ? <CheckCircle className="w-4 h-4" /> : s.id}
            </div>
            <span className={`text-xs hidden sm:block ${step === s.id ? "text-white" : "text-slate-600"}`}>{s.label}</span>
            {s.id < STEPS.length && <div className="w-8 h-px bg-slate-800 hidden sm:block" />}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-2xl">

          {/* Step 1: Enter URL */}
          {step === 1 && (
            <div className="animate-fade-in-up">
              <h1 className="text-3xl font-bold mb-2">Enter your website URL</h1>
              <p className="text-slate-400 mb-8">We'll scan your site and find all public pages to train your chatbot.</p>

              {error && (
                <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl mb-6">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">Website URL</label>
                <div className="flex gap-3">
                  <div className="flex-1 flex items-center bg-white/5 border border-white/10 rounded-xl px-4 gap-3 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                    <Globe className="w-5 h-5 text-slate-400 shrink-0" />
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleScan()}
                      placeholder="https://yourwebsite.com"
                      className="flex-1 py-3 bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleScan}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-medium rounded-xl transition-all whitespace-nowrap"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                    {loading ? "Scanning..." : "Scan Website"}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-3">
                  We'll discover up to 10 pages (free plan). Upgrade for unlimited page scanning.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { icon: Globe, label: "Auto Discovery", desc: "We find all your pages" },
                  { icon: Sparkles, label: "Smart Extraction", desc: "Clean text only" },
                  { icon: ShieldCheck, label: "Privacy First", desc: "Public pages only" },
                ].map((item) => (
                  <div key={item.label} className="bg-slate-900/50 border border-white/5 rounded-xl p-4 text-center">
                    <item.icon className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                    <div className="text-sm font-medium mb-1">{item.label}</div>
                    <div className="text-xs text-slate-500">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Pages */}
          {step === 2 && (
            <div className="animate-fade-in-up">
              <h1 className="text-3xl font-bold mb-2">Select pages to train on</h1>
              <p className="text-slate-400 mb-8">We found {crawledUrls.length} pages. Select which ones to include.</p>

              {error && (
                <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl mb-6">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden mb-6">
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-slate-800/50">
                  <span className="text-sm font-medium">{selectedUrls.size} of {crawledUrls.length} selected</span>
                  <div className="flex gap-3">
                    <button onClick={() => setSelectedUrls(new Set(crawledUrls))} className="text-xs text-indigo-400 hover:text-indigo-300">Select all</button>
                    <button onClick={() => setSelectedUrls(new Set())} className="text-xs text-slate-500 hover:text-slate-300">Clear</button>
                  </div>
                </div>
                <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
                  {crawledUrls.map((u) => (
                    <label key={u} className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/3 cursor-pointer transition-colors">
                      <button onClick={() => toggleUrl(u)} className="shrink-0">
                        {selectedUrls.has(u)
                          ? <CheckSquare className="w-5 h-5 text-indigo-400" />
                          : <Square className="w-5 h-5 text-slate-600" />}
                      </button>
                      <Globe className="w-4 h-4 text-slate-500 shrink-0" />
                      <span className="text-sm text-slate-300 truncate">{u}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm transition-all">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={selectedUrls.size === 0}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl text-sm font-medium transition-all"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Permission */}
          {step === 3 && (
            <div className="animate-fade-in-up">
              <h1 className="text-3xl font-bold mb-2">Review & Confirm</h1>
              <p className="text-slate-400 mb-8">Please confirm before we extract content from the selected pages.</p>

              <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 mb-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Data Extraction Notice</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      We will extract text content from{" "}
                      <strong className="text-white">{selectedUrls.size} selected pages</strong> to train your AI chatbot.
                      Only publicly accessible text content will be extracted. We respect robots.txt and privacy guidelines.
                    </p>
                  </div>
                </div>
                {[
                  "Only public page content will be used",
                  "No personal data or forms will be collected",
                  "Content is stored securely and privately",
                  "You can delete your data anytime",
                ].map((point) => (
                  <div key={point} className="flex items-center gap-2 py-1.5">
                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                    <span className="text-sm text-slate-300">{point}</span>
                  </div>
                ))}
              </div>

              <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 text-sm text-indigo-300 mb-6">
                <strong>Pages to be indexed:</strong>
                <ul className="mt-2 space-y-1">
                  {Array.from(selectedUrls).slice(0, 3).map((u) => (
                    <li key={u} className="text-slate-400 truncate">• {u}</li>
                  ))}
                  {selectedUrls.size > 3 && <li className="text-slate-500">+ {selectedUrls.size - 3} more</li>}
                </ul>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm transition-all">
                  <ArrowLeft className="w-4 h-4" /> Cancel
                </button>
                <button
                  onClick={handleScrape}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl text-sm font-medium transition-all"
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Extracting...</> : <>Allow & Continue <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Preview */}
          {step === 4 && (
            <div className="animate-fade-in-up">
              <h1 className="text-3xl font-bold mb-2">Data Extraction Preview</h1>
              <p className="text-slate-400 mb-8">Here's what we extracted from your website.</p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Pages indexed", value: scrapedPages.filter(p => p.status !== "failed").length },
                  { label: "Total words", value: totalWords.toLocaleString() },
                  { label: "Est. tokens", value: totalTokens.toLocaleString() },
                ].map((stat) => (
                  <div key={stat.label} className="bg-slate-900 border border-white/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-indigo-400">{stat.value}</div>
                    <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden mb-6">
                <div className="px-5 py-3 border-b border-white/5 bg-slate-800/30 text-sm font-medium">
                  Extracted Pages
                </div>
                <div className="divide-y divide-white/5 max-h-60 overflow-y-auto">
                  {scrapedPages.map((p) => (
                    <div key={p.url} className="flex items-center gap-3 px-5 py-3">
                      {p.status === "failed"
                        ? <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                        : <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-slate-300 truncate">{p.title || p.url}</div>
                        <div className="text-xs text-slate-500">{p.wordCount} words · {p.url}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {scrapedPages.length > 0 && scrapedPages[0].content && (
                <div className="bg-slate-900 border border-white/5 rounded-xl p-4 mb-6">
                  <div className="text-xs text-slate-500 mb-2 uppercase tracking-wide">Content preview</div>
                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-4">
                    {scrapedPages[0].content.slice(0, 400)}...
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm transition-all">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleProcess}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-medium transition-all"
                >
                  Train Chatbot <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Processing */}
          {step === 5 && (
            <div className="animate-fade-in-up text-center">
              <div className="w-20 h-20 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                <Sparkles className="w-10 h-10 text-indigo-400" />
                <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Training your chatbot...</h1>
              <p className="text-slate-400 mb-12">This takes about 30 seconds. Please don't close this tab.</p>

              <div className="max-w-sm mx-auto space-y-4 text-left mb-8">
                {PROCESSING_STEPS.map((s, i) => (
                  <div key={s.label} className={`flex items-center gap-4 transition-all duration-300 ${
                    i < processStep ? "opacity-100" : i === processStep ? "opacity-100" : "opacity-30"
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      i < processStep ? "bg-green-500" :
                      i === processStep ? "bg-indigo-600" :
                      "bg-slate-700"
                    }`}>
                      {i < processStep
                        ? <CheckCircle className="w-4 h-4 text-white" />
                        : i === processStep
                        ? <Loader2 className="w-4 h-4 text-white animate-spin" />
                        : <div className="w-2 h-2 bg-slate-500 rounded-full" />}
                    </div>
                    <span className={`text-sm ${i <= processStep ? "text-white" : "text-slate-500"}`}>{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="max-w-sm mx-auto bg-slate-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((processStep / PROCESSING_STEPS.length) * 100, 100)}%` }}
                />
              </div>
              <div className="text-sm text-slate-500 mt-3">
                {Math.round(Math.min((processStep / PROCESSING_STEPS.length) * 100, 100))}% complete
              </div>
            </div>
          )}

          {/* Step 6: Done! */}
          {step === 6 && (
            <div className="animate-fade-in-up text-center">
              <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                <span className="text-5xl">🎉</span>
                <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-ping opacity-20" />
              </div>
              <h1 className="text-4xl font-bold mb-3">Your chatbot is ready!</h1>
              <p className="text-slate-400 text-lg mb-10 max-w-md mx-auto">
                Your AI chatbot has been trained and is ready to answer questions based on your content.
              </p>

              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-10">
                {[
                  { label: "Pages trained", value: scrapedPages.filter(p => p.status !== "failed").length },
                  { label: "Words indexed", value: totalWords.toLocaleString() },
                  { label: "Status", value: "Live ✓" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-slate-900 border border-white/5 rounded-xl p-4">
                    <div className="text-xl font-bold text-indigo-400">{stat.value}</div>
                    <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={`/dashboard`}
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-all"
                >
                  Go to Dashboard
                </a>
                <a
                  href={`/dashboard`}
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-medium transition-all"
                >
                  <Flag className="w-4 h-4" />
                  Test Chatbot
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
