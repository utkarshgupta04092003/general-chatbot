"use client";

export const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--success))",
  "hsl(var(--warning))",
  "hsl(var(--danger))",
  "hsl(var(--muted-foreground))",
];

export const axisProps = {
  stroke: "hsl(var(--muted-foreground))",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
} as const;

export const gridProps = {
  stroke: "hsl(var(--border))",
  strokeDasharray: "3 3",
  vertical: false,
} as const;

export const tooltipProps = {
  contentStyle: {
    background: "hsl(var(--popover))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "var(--radius-md)",
    fontSize: "12px",
    color: "hsl(var(--popover-foreground))",
    boxShadow: "var(--shadow-e3)",
  },
  labelStyle: { color: "hsl(var(--muted-foreground))", marginBottom: 4 },
  cursor: { fill: "hsl(var(--accent))" },
} as const;
