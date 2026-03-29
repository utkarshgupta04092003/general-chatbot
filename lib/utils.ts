import { type ClassValue, clsx } from "clsx";
import OpenAI, { AzureOpenAI } from "openai";
import { twMerge } from "tailwind-merge";
import { API_VERSIONS, GEMINI_3_1_PRO, GPT_5_2 } from "./config";
import { QAModel } from "./declaration";
import { logger } from "./logger";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function estimateTokens(text: string): number {
  return Math.ceil(text.split(/\s+/).length * 1.3);
}

export function getDomain(url: string): string {
  try {
    const urlWithProtocol = url.match(/^https?:\/\//) ? url : `https://${url}`;
    const { hostname } = new URL(urlWithProtocol);
    return hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function getSafeFolder(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
}

export const getAIClient = (model: QAModel) => {
  if (model === GEMINI_3_1_PRO) {
    const client = new OpenAI({
      apiKey: process.env.GEMINI_API_KEY_MB_AI,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    });
    logger.debug("Using Gemini client for model:", model);
    return client;
  } else if (model === GPT_5_2) {
    const client = new AzureOpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY_EAST_US,
      endpoint: process.env.AZURE_OPENAI_ENDPOINT_EAST_US,
      deployment: model,
      apiVersion: API_VERSIONS[model],
    });
    logger.debug("Using Azure OpenAI East US client for model:", model);
    return client;
  } else {
    // Grok-4 Fast Reasoning, Mistral Large 3, GPT-5-mini
    const client = new AzureOpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY,
      endpoint: process.env.AZURE_OPENAI_ENDPOINT,
      deployment: model,
      apiVersion: API_VERSIONS[model],
    });
    logger.debug("Using Azure OpenAI client for model:", model);
    return client;
  }
};
