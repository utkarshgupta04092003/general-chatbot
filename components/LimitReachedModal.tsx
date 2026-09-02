"use client";

import { README_FILE_URL } from "@/lib/config";
import { AlertTriangle, ArrowRight, X } from "lucide-react";
import Link from "next/link";

type LimitReachedModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
};

export function LimitReachedModal({
  isOpen,
  onClose,
  title,
  description,
}: LimitReachedModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-sm animate-in fade-in duration-300 cursor-pointer"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-card border border-border rounded-lg shadow-e4 p-6 overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-card border border-border rounded-lg transition-colors text-muted-foreground cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className="w-14 h-14 bg-warning/10 border border-amber-500/20 rounded-lg flex items-center justify-center mb-5">
          <AlertTriangle className="w-7 h-7 text-warning" />
        </div>

        {/* Content */}
        <h2 className="text-xl font-bold text-foreground mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          {description}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-card border border-border border border-border rounded-md text-sm font-medium text-foreground transition-all cursor-pointer"
          >
            Cancel
          </button>
          <Link
            href={README_FILE_URL}
            onClick={onClose}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-md transition-all cursor-pointer"
          >
            Self Deploy
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
