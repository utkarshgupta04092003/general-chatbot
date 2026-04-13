"use client";

import { ANALYTICS_EVENTS } from "@/lib/config";
import { ENDPOINTS } from "@/lib/endpoint";
import { usePostHog } from "posthog-js/react";
import { useEffect, useState } from "react";

import { getDomain } from "@/lib/utils";
import { AddUrlSection } from "./_components/AddUrlSection";
import { ChatbotFilter } from "./_components/ChatbotFilter";
import { DataSourcesList } from "./_components/DataSourcesList";
import { ResyncModal } from "./_components/ResyncModal";
import { SelectChatbotModal } from "./_components/SelectChatbotModal";
import { DataSource } from "./_components/types";
import { UrlSelectionModal } from "./_components/UrlSelectionModal";
import { VerificationModal } from "./_components/VerificationModal";

export default function DataSourcesPage() {
  const posthog = usePostHog();
  const [sources, setSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [addUrl, setAddUrl] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [verifiedDomains, setVerifiedDomains] = useState<string[]>([]);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [targetUrl, setTargetUrl] = useState("");
  const [selectedChatbotId, setSelectedChatbotId] = useState<string>("all");

  const [showSelectChatbotModal, setShowSelectChatbotModal] = useState(false);
  const [targetChatbotIdForAdd, setTargetChatbotIdForAdd] =
    useState<string>("");
  const [chatbotDomain, setChatbotDomain] = useState<string | null>(null);

  const [scanning, setScanning] = useState(false);
  const [showUrlSelectionModal, setShowUrlSelectionModal] = useState(false);
  const [discoveredUrls, setDiscoveredUrls] = useState<string[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);

  const [showResyncModal, setShowResyncModal] = useState(false);
  const [selectedResyncId, setSelectedResyncId] = useState<string | null>(null);

  useEffect(() => {
    posthog.capture(ANALYTICS_EVENTS.DATA_SOURCES_VIEWED);
  }, [posthog]);

  useEffect(() => {
    fetchSources();
    fetchVerifiedDomains();
  }, []);

  useEffect(() => {
    if (selectedChatbotId !== "all") {
      posthog.capture(ANALYTICS_EVENTS.DATA_SOURCE_FILTER_CHANGED, {
        chatbotId: selectedChatbotId,
      });
    }
  }, [selectedChatbotId, posthog]);

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

    try {
      new URL(addUrl.trim());
    } catch {
      setError("Please enter a valid URL");
      return;
    }

    if (selectedChatbotId === "all") {
      setShowSelectChatbotModal(true);
    } else {
      checkDomainAndProceed(selectedChatbotId, addUrl.trim());
    }
  }

  function checkDomainAndProceed(chatbotId: string, urlStr: string) {
    const newDomain = getDomain(urlStr);
    setTargetChatbotIdForAdd(chatbotId);

    const chatbotSources = sources.filter((s) => s.chatbotId === chatbotId);
    const cDomain =
      chatbotSources.length > 0 ? getDomain(chatbotSources[0].url) : null;

    if (cDomain && newDomain !== cDomain) {
      setTargetUrl(urlStr);
      setChatbotDomain(cDomain);
      setShowVerifyModal(true);
      return;
    }

    if (!verifiedDomains.includes(newDomain)) {
      setTargetUrl(urlStr);
      setChatbotDomain(null);
      setShowVerifyModal(true);
      return;
    }

    processAddUrls([urlStr], chatbotId);
  }

  async function processAddUrls(urls: string[], chatbotId: string) {
    setAdding(true);
    setError("");

    try {
      let targetChatbotId = chatbotId;
      if (targetChatbotId === "all") {
        targetChatbotId = sources[0]?.chatbotId;
      }
      if (!targetChatbotId) {
        const res = await fetch(ENDPOINTS.CHATBOTS);
        const data = await res.json();
        if (data.chatbots?.length > 0) {
          targetChatbotId = data.chatbots[0].id;
        } else {
          throw new Error("No chatbot found. Please create one first.");
        }
      }

      const scrapeRes = await fetch(ENDPOINTS.SCRAPE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls }),
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

  async function handleAddSelectedUrls() {
    if (selectedUrls.length === 0) return;
    const targetChatbotId = targetChatbotIdForAdd || selectedChatbotId;
    await processAddUrls(selectedUrls, targetChatbotId);
  }

  return (
    <div>
      <SelectChatbotModal
        isOpen={showSelectChatbotModal}
        onClose={() => setShowSelectChatbotModal(false)}
        onSelect={(chatbotId) => {
          setShowSelectChatbotModal(false);
          checkDomainAndProceed(chatbotId, addUrl.trim());
        }}
      />

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
        chatbotDomain={chatbotDomain}
        onClose={() => setShowVerifyModal(false)}
        onSuccess={() => {
          setShowVerifyModal(false);
          fetchVerifiedDomains();
          processAddUrls(
            [targetUrl],
            targetChatbotIdForAdd || selectedChatbotId,
          );
        }}
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
