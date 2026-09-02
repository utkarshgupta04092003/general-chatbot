import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

export function Card({
  className,
  interactive,
  children,
  ...props
}: ComponentProps<"div"> & { interactive?: boolean; children: ReactNode }) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-lg",
        interactive && "transition-colors hover:border-muted-foreground/30",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: ComponentProps<"div"> & { children: ReactNode }) {
  return (
    <div
      className={cn("px-5 py-4 border-b border-border", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: ComponentProps<"h3"> & { children: ReactNode }) {
  return (
    <h3 className={cn("text-sm font-semibold", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: ComponentProps<"p"> & { children: ReactNode }) {
  return (
    <p className={cn("text-xs text-muted-foreground mt-1", className)} {...props}>
      {children}
    </p>
  );
}

export function CardBody({
  className,
  children,
  ...props
}: ComponentProps<"div"> & { children: ReactNode }) {
  return (
    <div className={cn("p-5", className)} {...props}>
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("bg-card border border-border rounded-lg p-4", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <div className="mt-2 text-2xl font-semibold tabular-nums">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}
