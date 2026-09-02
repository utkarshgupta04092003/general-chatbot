import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton h-4 w-full", className)} />;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center px-6 py-14 border border-dashed border-border rounded-lg",
        className,
      )}
    >
      {icon && (
        <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center text-muted-foreground mb-3">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-semibold">{title}</h3>
      {description && (
        <p className="text-xs text-muted-foreground mt-1.5 max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-4 mb-6",
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
