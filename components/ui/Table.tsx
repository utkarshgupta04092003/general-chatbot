import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

export function Table({
  className,
  children,
  ...props
}: ComponentProps<"table"> & { children: ReactNode }) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn("w-full text-sm border-collapse", className)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function Th({
  className,
  children,
  ...props
}: ComponentProps<"th"> & { children?: ReactNode }) {
  return (
    <th
      className={cn(
        "text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground px-4 py-2.5 border-b border-border whitespace-nowrap",
        className,
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function Td({
  className,
  children,
  ...props
}: ComponentProps<"td"> & { children?: ReactNode }) {
  return (
    <td
      className={cn("px-4 py-3 border-b border-border align-middle", className)}
      {...props}
    >
      {children}
    </td>
  );
}

export function Tr({
  className,
  children,
  ...props
}: ComponentProps<"tr"> & { children: ReactNode }) {
  return (
    <tr className={cn("hover:bg-muted/50 transition-colors", className)} {...props}>
      {children}
    </tr>
  );
}
