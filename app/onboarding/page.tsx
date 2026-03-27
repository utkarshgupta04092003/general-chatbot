"use client";

import { PROCESSING_STEPS, STEPS } from "@/lib/onboarding-constants";
import { useState } from "react";
import { DomainVerificationStep } from "./_components/DomainVerificationStep";
import { OnboardingHeader } from "./_components/OnboardingHeader";
import { PageSelectionStep } from "./_components/PageSelectionStep";
import { PermissionStep } from "./_components/PermissionStep";
import { PreviewStep } from "./_components/PreviewStep";
import { ProcessingStep } from "./_components/ProcessingStep";
import { StepIndicator } from "./_components/StepIndicator";
import { SuccessStep } from "./_components/SuccessStep";
import { UrlInputStep } from "./_components/UrlInputStep";

import { ScrapedPage } from "@/lib/onboarding-types";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [url, setUrl] = useState("");
  const [crawledUrls, setCrawledUrls] = useState<string[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());
  const [scrapedPages, setScrapedPages] = useState<ScrapedPage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [processStep, setProcessStep] = useState(0);
  const [rootTitle, setRootTitle] = useState("");
  const [chatbotId, setChatbotId] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeRequested, setCodeRequested] = useState(false);

  // Step 1: Scan URL
  async function handleScan() {
    if (!url.trim()) {
      setError("Please enter a website URL");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const domain = url
        .trim()
        .replace(/^https?:\/\//, "")
        .split("/")[0]
        .replace(/^www\./, "");
      if (!domain) throw new Error("Invalid URL");
      setStep(2);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to process URL");
    } finally {
      setLoading(false);
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
    if (!verificationEmail.endsWith(`@${domain}`)) {
      setError(`Email must be associated with the domain: @${domain}`);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/verify-domain", {
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

  // Verify code and then crawl
  async function verifyAndCrawl() {
    if (!verificationCode.trim()) {
      setError("Please enter the verification code");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const verifyRes = await fetch("/api/verify-domain", {
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

      const crawlRes = await fetch("/api/crawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const crawlData = await crawlRes.json();
      if (!crawlRes.ok) throw new Error(crawlData.error);

      setCrawledUrls(crawlData.urls);
      setSelectedUrls(new Set(crawlData.urls));
      setRootTitle(crawlData.rootTitle);
      setStep(3);
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "Verification or scanning failed",
      );
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
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: Array.from(selectedUrls) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
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
      const chatRes = await fetch("/api/chatbots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: rootTitle || "AI Assistant" }),
      });
      const chatData = await chatRes.json();
      if (!chatRes.ok) throw new Error(chatData.error);
      const id = chatData.chatbot.id;
      setChatbotId(id);

      for (let i = 0; i < PROCESSING_STEPS.length; i++) {
        setProcessStep(i);
        await new Promise((r) => setTimeout(r, PROCESSING_STEPS[i].delay));
      }

      await fetch("/api/embed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatbotId: id, pages: scrapedPages }),
      });

      setProcessStep(PROCESSING_STEPS.length);
      setStep(7);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Processing failed");
      setStep(5);
    }
  }

  const totalWords = scrapedPages.reduce(
    (acc, p) => acc + (p.wordCount || 0),
    0,
  );
  const totalTokens = Math.ceil(totalWords * 1.3);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
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
              onVerify={verifyAndCrawl}
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
              error={error}
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
