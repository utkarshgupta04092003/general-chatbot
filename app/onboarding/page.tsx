"use client";

import { LimitReachedModal } from "@/components/LimitReachedModal";
import { useUsage } from "@/components/providers/usage-provider";
import {
  ANALYTICS_EVENTS,
  ENABLE_USAGE_LIMITS,
  PLAN_LIMITS,
} from "@/lib/config";
import { ENDPOINTS } from "@/lib/endpoint";
import {
  isTestVerificationEmail,
  PROCESSING_STEPS,
  STEPS,
} from "@/lib/onboarding-constants";
import { ScrapedPage } from "@/lib/onboarding-types";
import { getDomain } from "@/lib/utils";
import Link from "next/link";
import { usePostHog } from "posthog-js/react";
import { useEffect, useState } from "react";
import { DomainVerificationStep } from "./_components/DomainVerificationStep";
import { OnboardingHeader } from "./_components/OnboardingHeader";
import { PageSelectionStep } from "./_components/PageSelectionStep";
import { PermissionStep } from "./_components/PermissionStep";
import { PreviewStep } from "./_components/PreviewStep";
import { ProcessingStep } from "./_components/ProcessingStep";
import { StepIndicator } from "./_components/StepIndicator";
import { SuccessStep } from "./_components/SuccessStep";
import { UrlInputStep } from "./_components/UrlInputStep";

interface ChatbotWithSources {
  id: string;
  dataSources?: { url: string }[];
}

export default function OnboardingPage() {
  const posthog = usePostHog();
  const { pageCount, mutate: mutateUsage } = useUsage();
  const [step, setStep] = useState(1);
  const [url, setUrl] = useState("");
  const [crawledUrls, setCrawledUrls] = useState<string[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());
  const [scrapedPages, setScrapedPages] = useState<ScrapedPage[]>([]);
  const [loading, setLoading] = useState(false);
  const [crawling, setCrawling] = useState(false);
  const [error, setError] = useState<string | React.ReactNode>("");
  const [processStep, setProcessStep] = useState(0);
  const [rootTitle, setRootTitle] = useState("");
  const [chatbotId, setChatbotId] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeRequested, setCodeRequested] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [limitType, setLimitType] = useState<"chatbot" | "page">("chatbot");
  // Counts reported by the API when a limit is hit; the useUsage() hook can
  // still be loading (0) at the moment the modal opens.
  const [limitPageCount, setLimitPageCount] = useState<number | null>(null);

  // Track initial onboarding start
  useEffect(() => {
    posthog.capture(ANALYTICS_EVENTS.ONBOARDING_STARTED);
  }, [posthog]);

  // Track step changes
  useEffect(() => {
    if (step > 1) {
      posthog.capture(ANALYTICS_EVENTS.ONBOARDING_STEP_COMPLETED, {
        step: step - 1,
        stepName: STEPS[step - 2]?.label || "Unknown",
      });
    }
  }, [step, posthog]);

  // Step 1: Scan URL
  async function handleScan() {
    if (!url.trim()) {
      setError("Please enter a website URL");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const fullUrl = url.trim().startsWith("http")
        ? url.trim()
        : "https://" + url.trim();
      const currentDomain = getDomain(fullUrl);

      // Fetch existing chatbots to check domain only
      const res = await fetch(ENDPOINTS.CHATBOTS);
      const data = await res.json();
      const existingChatbots: ChatbotWithSources[] = data.chatbots || [];

      const duplicate = existingChatbots.find((c) =>
        c.dataSources?.some((ds) => getDomain(ds.url) === currentDomain),
      );

      if (duplicate) {
        setError(
          <p>
            You have already created a chatbot for this website. Try{" "}
            <Link
              href="/dashboard/data-sources"
              className="underline font-medium hover:text-foreground transition-colors"
            >
              adding new sources
            </Link>{" "}
            instead.
          </p>,
        );
        return;
      }
      setUrl(fullUrl);
      setStep(2);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to process URL");
    } finally {
      setLoading(false);
    }
  }

  // Trigger crawl when entering step 3
  async function handleCrawl(force = false) {
    if (!force && crawledUrls.length > 0) return;
    setCrawling(true);
    if (force) {
      setCrawledUrls([]);
      setSelectedUrls(new Set());
    }
    setError("");
    try {
      const crawlRes = await fetch(ENDPOINTS.CRAWL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const crawlData = await crawlRes.json();
      if (!crawlRes.ok) throw new Error(crawlData.error);

      setCrawledUrls(crawlData.urls);
      setSelectedUrls(new Set(crawlData.urls));
      setRootTitle(crawlData.rootTitle);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Website scanning failed");
    } finally {
      setCrawling(false);
    }
  }

  // Request verification code
  async function requestVerificationCode() {
    if (!verificationEmail.trim()) {
      setError("Please enter an email address");
      return;
    }
    const domain = url
      .trim()
      .replace(/^https?:\/\//, "")
      .split("/")[0]
      .replace(/^www\./, "");
    // TODO: Remove the test-email bypass after testing
    if (
      !verificationEmail.endsWith(`@${domain}`) &&
      !isTestVerificationEmail(verificationEmail)
    ) {
      setError(`Email must be associated with the domain: @${domain}`);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch(ENDPOINTS.VERIFY_DOMAIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          action: "request-code",
          email: verificationEmail,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCodeRequested(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to send code");
    } finally {
      setLoading(false);
    }
  }

  // Verify code only
  async function handleVerifyOnly() {
    if (!verificationCode.trim()) {
      setError("Please enter the verification code");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const verifyRes = await fetch(ENDPOINTS.VERIFY_DOMAIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          action: "verify-code",
          code: verificationCode,
        }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error);

      setStep(3);
      handleCrawl();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  function toggleUrl(u: string) {
    setSelectedUrls((prev) => {
      const next = new Set(prev);
      if (next.has(u)) {
        next.delete(u);
      } else {
        next.add(u);
      }
      return next;
    });
  }

  async function handleScrape() {
    if (
      ENABLE_USAGE_LIMITS &&
      pageCount + selectedUrls.size > PLAN_LIMITS.FREE.MAX_PAGES
    ) {
      setLimitType("page");
      setLimitReached(true);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch(ENDPOINTS.SCRAPE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: Array.from(selectedUrls) }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.error === "LIMIT_REACHED") {
          setLimitType("page");
          setLimitPageCount(data.pageCount ?? null);
          setLimitReached(true);
          return;
        }
        throw new Error(data.message || data.error);
      }

      setScrapedPages(data.pages);
      setStep(5);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to extract content");
    } finally {
      setLoading(false);
    }
  }

  async function handleProcess() {
    setStep(6);
    setProcessStep(0);
    setError("");

    try {
      const chatRes = await fetch(ENDPOINTS.CHATBOTS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: rootTitle || "AI Assistant" }),
      });
      const chatData = await chatRes.json();

      if (!chatRes.ok) {
        if (chatData.error === "LIMIT_REACHED") {
          setLimitType("chatbot");
          setLimitReached(true);
          return;
        }
        throw new Error(chatData.error);
      }
      const id = chatData.chatbot.id;
      setChatbotId(id);

      for (let i = 0; i < PROCESSING_STEPS.length; i++) {
        setProcessStep(i);
        await new Promise((r) => setTimeout(r, PROCESSING_STEPS[i].delay));
      }

      const embedRes = await fetch(ENDPOINTS.EMBED, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatbotId: id, pages: scrapedPages }),
      });
      const embedData = await embedRes.json();

      // Without this check a failed embed still advanced to "Done!", leaving the
      // chatbot stuck on status "training" with no indexed content.
      if (!embedRes.ok) {
        if (embedData.error === "LIMIT_REACHED") {
          setLimitType("page");
          setLimitPageCount(embedData.pageCount ?? null);
          setLimitReached(true);
          return;
        }
        throw new Error(
          embedData.message || embedData.error || "Failed to index content",
        );
      }

      setProcessStep(PROCESSING_STEPS.length);
      setStep(7);
      // Refresh global usage counts so AddChatbotButton stays in sync
      mutateUsage();
      posthog.capture("onboarding_completed", {
        chatbotId: id,
        pageCount: scrapedPages.length,
        totalWords,
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Processing failed");
      setStep(5);
    }
  }

  // Prefer the count the server reported with the limit error; fall back to the
  // usage hook, which may still be loading when the modal first renders.
  const effectivePageCount = limitPageCount ?? pageCount;

  const totalWords = scrapedPages.reduce(
    (acc, p) => acc + (p.wordCount || 0),
    0,
  );
  const totalTokens = Math.ceil(totalWords * 1.3);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <LimitReachedModal
        isOpen={limitReached}
        onClose={() => setLimitReached(false)}
        title={
          limitType === "chatbot"
            ? "Chatbot Limit Reached"
            : "Page Limit Reached"
        }
        description={
          limitType === "chatbot"
            ? `You've used all ${PLAN_LIMITS.FREE.MAX_CHATBOTS} chatbot slot(s) available on the Free plan. Delete an existing chatbot or upgrade your plan to create more.`
            : `You have already indexed ${effectivePageCount} page(s). You can add ${Math.max(
                0,
                PLAN_LIMITS.FREE.MAX_PAGES - effectivePageCount,
              )} more page(s) on this Free plan. Please restart or upgrade your plan.`
        }
      />
      <OnboardingHeader step={step} totalSteps={STEPS.length} />
      <StepIndicator steps={STEPS} currentStep={step} />

      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          {step === 1 && (
            <UrlInputStep
              url={url}
              setUrl={setUrl}
              onScan={handleScan}
              loading={loading}
              error={error}
            />
          )}

          {step === 2 && (
            <DomainVerificationStep
              url={url}
              verificationEmail={verificationEmail}
              setVerificationEmail={setVerificationEmail}
              verificationCode={verificationCode}
              setVerificationCode={setVerificationCode}
              codeRequested={codeRequested}
              setCodeRequested={setCodeRequested}
              onRequestCode={requestVerificationCode}
              onVerify={handleVerifyOnly}
              onBack={() => setStep(1)}
              loading={loading}
              error={error}
            />
          )}

          {step === 3 && (
            <PageSelectionStep
              crawledUrls={crawledUrls}
              selectedUrls={selectedUrls}
              toggleUrl={toggleUrl}
              setSelectedUrls={setSelectedUrls}
              onBack={() => setStep(2)}
              onContinue={() => setStep(4)}
              loading={crawling}
              onRescan={() => handleCrawl(true)}
              error={error}
              domain={
                url
                  .trim()
                  .replace(/^https?:\/\//, "")
                  .split("/")[0]
                  .replace(/^www\./, "") || "website"
              }
            />
          )}

          {step === 4 && (
            <PermissionStep
              selectedUrls={selectedUrls}
              onScrape={handleScrape}
              onBack={() => setStep(3)}
              loading={loading}
            />
          )}

          {step === 5 && (
            <PreviewStep
              scrapedPages={scrapedPages}
              totalWords={totalWords}
              totalTokens={totalTokens}
              onBack={() => setStep(4)}
              onTrain={handleProcess}
            />
          )}

          {step === 6 && (
            <ProcessingStep
              processStep={processStep}
              processingSteps={PROCESSING_STEPS}
            />
          )}

          {step === 7 && (
            <SuccessStep
              scrapedPages={scrapedPages}
              totalWords={totalWords}
              chatbotId={chatbotId}
            />
          )}
        </div>
      </div>
    </div>
  );
}
