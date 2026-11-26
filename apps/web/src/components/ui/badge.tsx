import * as React from "react";
import { cn } from "./button";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "destructive";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-ember-600/20 text-ember-400 border border-ember-600/30",
    secondary: "bg-charcoal-800 text-neutral-300 border border-charcoal-700",
    outline: "border border-neutral-700 text-neutral-300",
    success: "bg-emerald-950/40 text-emerald-400 border border-emerald-800/40",
    warning: "bg-amber-950/40 text-amber-400 border border-amber-800/40",
    destructive: "bg-red-950/40 text-red-400 border border-red-800/40",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
