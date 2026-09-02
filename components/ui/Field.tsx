import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

const control =
  "w-full bg-card border border-input rounded-md text-sm text-foreground placeholder:text-muted-foreground transition-colors hover:border-muted-foreground/40 focus:border-primary focus:outline-none disabled:opacity-50 disabled:bg-muted";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(control, "h-9 px-3", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(control, "px-3 py-2 resize-y leading-relaxed", className)}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: ComponentProps<"select"> & { children: ReactNode }) {
  return (
    <select className={cn(control, "h-9 px-3 pr-8", className)} {...props}>
      {children}
    </select>
  );
}

export function Label({
  className,
  children,
  ...props
}: ComponentProps<"label"> & { children: ReactNode }) {
  return (
    <label
      className={cn("block text-xs font-medium text-foreground mb-1.5", className)}
      {...props}
    >
      {children}
    </label>
  );
}

export function Field({
  label,
  hint,
  error,
  htmlFor,
  className,
  children,
}: {
  label?: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("w-full", className)}>
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
