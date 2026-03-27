import { Database, FileText, Globe, Sparkles } from "lucide-react";

export const STEPS = [
  { id: 1, label: "Enter URL" },
  { id: 2, label: "Verify Domain" },
  { id: 3, label: "Select Pages" },
  { id: 4, label: "Permission" },
  { id: 5, label: "Preview" },
  { id: 6, label: "Processing" },
  { id: 7, label: "Done!" },
];

export const PROCESSING_STEPS = [
  { label: "Scraping content", icon: Globe, delay: 1500 },
  { label: "Cleaning data", icon: FileText, delay: 1500 },
  { label: "Chunking text", icon: FileText, delay: 1500 },
  { label: "Generating embeddings", icon: Sparkles, delay: 2000 },
  { label: "Storing in vector database", icon: Database, delay: 2000 },
];
