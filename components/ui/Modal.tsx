"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl";
  footer?: ReactNode;
  children: ReactNode;
};

const sizes = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function Modal({
  open,
  onClose,
  title,
  description,
  size = "md",
  footer,
  children,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previous = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const nodes = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((n) => n.offsetParent !== null);
      if (nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative w-full bg-card border border-border rounded-lg shadow-e4 max-h-[85vh] flex flex-col animate-fade-in-up",
          sizes[size],
        )}
      >
        {title && (
          <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-border shrink-0">
            <div className="min-w-0">
              <h2 className="text-sm font-semibold">{title}</h2>
              {description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="text-muted-foreground hover:text-foreground shrink-0 -mr-1 -mt-1 p-1 rounded-sm"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="px-5 py-4 overflow-y-auto min-h-0">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-border shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
