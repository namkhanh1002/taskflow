"use client";

import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps {
  checked: boolean;
  onCheckedChange: () => void;
  "aria-label": string;
  disabled?: boolean;
  pending?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function Checkbox({
  checked,
  onCheckedChange,
  disabled,
  pending,
  size = "md",
  className,
  ...props
}: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={props["aria-label"]}
      disabled={disabled || pending}
      onClick={onCheckedChange}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md border-2 transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-60",
        size === "sm" ? "size-5" : "size-[22px]",
        checked
          ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
          : "border-border bg-card hover:border-primary/60 hover:bg-primary/5",
        className,
      )}
    >
      {pending ? (
        <Loader2 className="size-3.5 animate-spin" aria-hidden />
      ) : checked ? (
        <Check className={size === "sm" ? "size-3.5" : "size-4"} strokeWidth={3} aria-hidden />
      ) : null}
    </button>
  );
}
