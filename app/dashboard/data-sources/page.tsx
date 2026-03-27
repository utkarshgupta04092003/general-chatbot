"use client";

import { formatDate } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Copy,
  Globe,
  Loader2,
  Plus,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ENDPOINTS } from "@/lib/endpoint";

type DataSource = {
  id: string;
  url: string;
  title: string;
  wordCount: number;
  status: string;
  createdAt: string;
  chatbotId: string;
  chatbot: {
    name: string;
  };
};

export default function DataSourcesPage() {
  const [sources, setSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [addUrl, setAddUrl] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [verifiedDomains, setVerifiedDomains] = useState<string[]>([]);
  const [verificationToken, setVerificationToken] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [targetUrl, setTargetUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedChatbotId, setSelectedChatbotId] = useState<string>("all");

  useEffect(() => {
    fetchSources();
    fetchVerifiedDomains();
  }, []);

  async function fetchVerifiedDomains() {
    try {
      const res = await fetch(ENDPOINTS.VERIFY_DOMAIN);
      const data = await res.json();
      if (data.domains) {
        setVerifiedDomains(
          data.domains
            .filter((d: { verified: boolean; domain: string }) => d.verified)
            .map((d: { domain: string }) => d.domain),
        );
      }
      if (data.verificationToken) {
        setVerificationToken(data.verificationToken);
      }
    } catch (err) {
      console.error("Failed to fetch verified domains", err);
    }
  }

  async function fetchSources() {
    try {
      const res = await fetch(ENDPOINTS.DATA_SOURCES);
      const data = await res.json();
      setSources(data.sources ?? []);
    } catch {
      setError("Failed to load data sources");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (
      !confirm(
        "Remove this data source? This may affect your chatbot's responses.",
      )
    )
      return;
    await fetch(ENDPOINTS.DATA_SOURCE_BY_ID(id), { method: "DELETE" });
    setSources((prev) => prev.filter((s) => s.id !== id));
  }

  async function handleAddUrl() {
    if (!addUrl.trim()) return;

    // Check if domain is verified
    let domain = "";
    try {
      domain = new URL(addUrl.trim()).hostname;
    } catch {
      setError("Please enter a valid URL");
      return;
    }

    if (!verifiedDomains.includes(domain)) {
      setTargetUrl(addUrl.trim());
      setShowVerifyModal(true);
      return;
    }

    setAdding(true);
    setError("");

    try {
      // 1. Get chatbot ID
      let targetChatbotId =
        selectedChatbotId !== "all" ? selectedChatbotId : sources[0]?.chatbotId;
      if (!targetChatbotId) {
        const res = await fetch(ENDPOINTS.CHATBOTS);
        const data = await res.json();
        if (data.chatbots?.length > 0) {
          targetChatbotId = data.chatbots[0].id;
        } else {
          throw new Error("No chatbot found. Please complete onboarding.");
        }
      }

      // 2. Scrape the URL
      const scrapeRes = await fetch(ENDPOINTS.SCRAPE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: [addUrl.trim()] }),
      });
      const scrapeData = await scrapeRes.json();
      if (!scrapeRes.ok) throw new Error(scrapeData.error || "Scrape failed");

      const page = scrapeData.pages[0];
      if (page.status === "failed")
        throw new Error("Failed to extract content from this URL");

      // 3. Embed the content
      const embedRes = await fetch(ENDPOINTS.EMBED, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatbotId: targetChatbotId, pages: [page] }),
      });
      const embedData = await embedRes.json();
      if (!embedRes.ok)
        throw new Error(embedData.error || "Failed to index page");

      // 4. Update UI
      setAddUrl("");
      fetchSources();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setAdding(false);
    }
  }

  async function handleVerify() {
    setVerifying(true);
    setError("");
    try {
      const res = await fetch(ENDPOINTS.VERIFY_DOMAIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setShowVerifyModal(false);
        fetchVerifiedDomains();
        // Automatically proceed to add the URL after verification
        setAddUrl(targetUrl);
        setTimeout(() => handleAddUrl(), 100);
      } else {
        setError(data.error || "Verification failed");
      }
    } catch {
      setError("Failed to verify domain");
    } finally {
      setVerifying(false);
    }
  }

  const copyToClipboard = () => {
    const code = `<meta name="chatbot-verification" content="${verificationToken}" />`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Verify Ownership
                </h2>
              </div>
              <p className="text-slate-400 text-sm">
                To comply with safety regulations, you must verify that you own
                or are authorized to use <b>{new URL(targetUrl).hostname}</b>.
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
                    1
                  </span>
                  Add this meta tag to your site
                </h3>
                <p className="text-xs text-slate-400 pl-7">
                  Copy and paste this code into the{" "}
                  <code className="text-indigo-300">{"<head>"}</code> section of
                  your website&apos;s home page.
                </p>
                <div className="ml-7 flex items-center gap-2 bg-black/40 border border-white/5 rounded-xl px-4 py-3 group">
                  <code className="text-xs text-indigo-300 flex-1 truncate">
                    {`<meta name="chatbot-verification" content="${verificationToken || "..."}" />`}
                  </code>
                  <button
                    onClick={copyToClipboard}
                    className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all"
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
                    2
                  </span>
                  Verify deployment
                </h3>
                <p className="text-xs text-slate-400 pl-7">
                  Once you&apos;ve added the tag, click verify. We&apos;ll check
                  for the tag on your site.
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 text-red-300 px-3 py-2.5 rounded-xl text-xs">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Verification failed</p>
                    <p className="opacity-80">{error}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-white/2 flex gap-3">
              <button
                onClick={() => setShowVerifyModal(false)}
                className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleVerify}
                disabled={verifying}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {verifying ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                {verifying ? "Verifying..." : "Verify Now"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold">Data Sources</h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage the pages your chatbots are trained on.
        </p>
      </div>

      {/* Chatbot Filter Tabs */}
      {sources.length > 0 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedChatbotId("all")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all shrink-0 ${
              selectedChatbotId === "all"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                : "bg-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            All Sources
          </button>
          {Array.from(new Set(sources.map((s) => s.chatbotId))).map((id) => {
            const name = sources.find((s) => s.chatbotId === id)?.chatbot.name;
            return (
              <button
                key={id}
                onClick={() => setSelectedChatbotId(id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all shrink-0 ${
                  selectedChatbotId === id
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>
      )}

      {/* Add URL */}
      <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-5 mb-6">
        <h2 className="text-sm font-semibold mb-3">
          {selectedChatbotId === "all"
            ? "Add to primary chatbot"
            : `Add to ${sources.find((s) => s.chatbotId === selectedChatbotId)?.chatbot.name}`}
        </h2>
        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-300 px-3 py-2 rounded-lg text-sm mb-3">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
        <div className="flex gap-3">
          <div className="flex-1 flex items-center bg-white/5 border border-white/10 rounded-xl px-4 gap-2 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
            <Globe className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="url"
              value={addUrl}
              onChange={(e) => setAddUrl(e.target.value)}
              placeholder="https://yoursite.com/new-page"
              className="flex-1 py-2.5 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
          </div>
          <button
            onClick={handleAddUrl}
            disabled={adding || !addUrl.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all"
          >
            {adding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {adding ? "Adding..." : "Add URL"}
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Free plan: up to 10 pages total
        </p>
      </div>

      {/* Sources list */}
      <div className="bg-slate-800/50 border border-white/5 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h2 className="font-semibold text-sm">
            {
              sources
                .filter(
                  (s) =>
                    selectedChatbotId === "all" ||
                    s.chatbotId === selectedChatbotId,
                )
                .filter((s) => s.status === "indexed").length
            }{" "}
            indexed pages
          </h2>
          <button
            onClick={fetchSources}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
        ) : sources.length === 0 ? (
          <div className="text-center py-16">
            <Globe className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-sm">No pages indexed yet.</p>
            <p className="text-slate-500 text-xs mt-1">
              Complete the onboarding to train your chatbot.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {sources
              .filter(
                (s) =>
                  selectedChatbotId === "all" ||
                  s.chatbotId === selectedChatbotId,
              )
              .map((source) => (
                <div
                  key={source.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-white/2 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      source.status === "indexed"
                        ? "bg-green-500/10"
                        : source.status === "failed"
                          ? "bg-red-500/10"
                          : "bg-yellow-500/10"
                    }`}
                  >
                    {source.status === "indexed" ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : source.status === "failed" ? (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    ) : (
                      <Clock className="w-4 h-4 text-yellow-400 animate-pulse" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">
                      {source.title || source.url}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 truncate">
                      {source.url}
                      {verifiedDomains.includes(
                        new URL(source.url).hostname,
                      ) && (
                        <span className="flex items-center gap-0.5 text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded-md font-medium">
                          <ShieldCheck className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                      {selectedChatbotId === "all" && (
                        <span className="flex items-center gap-1.5 text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-white/5">
                          <Plus className="w-2.5 h-2.5 rotate-45" />
                          {source.chatbot.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 hidden sm:block">
                    {source.wordCount.toLocaleString()} words
                  </div>
                  <div className="text-xs text-slate-500 hidden md:block">
                    {formatDate(source.createdAt)}
                  </div>
                  <div
                    className={`hidden sm:flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                      source.status === "indexed"
                        ? "bg-green-500/10 text-green-400"
                        : source.status === "failed"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {source.status}
                  </div>
                  <button
                    onClick={() => handleDelete(source.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
