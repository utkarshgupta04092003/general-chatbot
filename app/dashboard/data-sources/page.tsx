"use client";

import { ENDPOINTS } from "@/lib/endpoint";
import { useEffect, useState } from "react";
import { AddUrlSection } from "./_components/AddUrlSection";
import { ChatbotFilter } from "./_components/ChatbotFilter";
import { DataSourcesList } from "./_components/DataSourcesList";
import { ResyncModal } from "./_components/ResyncModal";
import { DataSource } from "./_components/types";
import { UrlSelectionModal } from "./_components/UrlSelectionModal";
import { VerificationModal } from "./_components/VerificationModal";

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

  const [scanning, setScanning] = useState(false);
  const [showUrlSelectionModal, setShowUrlSelectionModal] = useState(false);
  const [discoveredUrls, setDiscoveredUrls] = useState<string[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);

  const [showResyncModal, setShowResyncModal] = useState(false);
  const [selectedResyncId, setSelectedResyncId] = useState<string | null>(null);

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

    startCrawl(addUrl.trim());
  }

  async function startCrawl(url: string) {
    setShowUrlSelectionModal(true);
    setScanning(true);
    setError("");
    setDiscoveredUrls([]);
    setSelectedUrls([]);

    try {
      const res = await fetch(ENDPOINTS.CRAWL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to crawl website");

      setDiscoveredUrls(data.urls || []);
      setSelectedUrls(data.urls || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Crawl failed");
    } finally {
      setScanning(false);
    }
  }

  async function handleAddSelectedUrls() {
    if (selectedUrls.length === 0) return;
    setAdding(true);
    setError("");

    try {
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

      const scrapeRes = await fetch(ENDPOINTS.SCRAPE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: selectedUrls }),
      });
      const scrapeData = await scrapeRes.json();
      if (!scrapeRes.ok) throw new Error(scrapeData.error || "Scrape failed");

      const validPages = (scrapeData.pages || []).filter(
        (p: { status: string; content?: string }) =>
          p.status !== "failed" && p.content,
      );
      if (validPages.length === 0) {
        throw new Error("Failed to extract valid content from these URLs");
      }

      const embedRes = await fetch(ENDPOINTS.EMBED, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatbotId: targetChatbotId, pages: validPages }),
      });
      const embedData = await embedRes.json();
      if (!embedRes.ok) {
        throw new Error(embedData.error || "Failed to index pages");
      }

      setAddUrl("");
      setShowUrlSelectionModal(false);
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
      <UrlSelectionModal
        isOpen={showUrlSelectionModal}
        scanning={scanning}
        discoveredUrls={discoveredUrls}
        selectedUrls={selectedUrls}
        setSelectedUrls={setSelectedUrls}
        onClose={() => setShowUrlSelectionModal(false)}
        onConfirm={handleAddSelectedUrls}
        adding={adding}
        error={error}
      />

      <VerificationModal
        isOpen={showVerifyModal}
        targetUrl={targetUrl}
        verificationToken={verificationToken}
        onClose={() => setShowVerifyModal(false)}
        onVerify={handleVerify}
        onCopyToken={copyToClipboard}
        verifying={verifying}
        copied={copied}
        error={error}
      />

      <div className="mb-8">
        <h1 className="text-2xl font-bold">Data Sources</h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage the pages your chatbots are trained on.
        </p>
      </div>

      <ChatbotFilter
        sources={sources}
        selectedChatbotId={selectedChatbotId}
        setSelectedChatbotId={setSelectedChatbotId}
      />

      <AddUrlSection
        selectedChatbotId={selectedChatbotId}
        sources={sources}
        error={error}
        addUrl={addUrl}
        setAddUrl={setAddUrl}
        onAdd={handleAddUrl}
        adding={adding}
      />

      <DataSourcesList
        sources={sources}
        loading={loading}
        selectedChatbotId={selectedChatbotId}
        verifiedDomains={verifiedDomains}
        onRefresh={fetchSources}
        onDelete={handleDelete}
        onResync={(id) => {
          setSelectedResyncId(id);
          setShowResyncModal(true);
        }}
      />

      <ResyncModal
        isOpen={showResyncModal}
        dataSourceId={selectedResyncId || ""}
        onClose={() => setShowResyncModal(false)}
        onSuccess={fetchSources}
      />
    </div>
  );
}
