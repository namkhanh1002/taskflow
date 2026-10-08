"use client";

import { useState, type KeyboardEvent } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputClasses } from "@/components/ui/input";

export function TagInput({
  value,
  onChange,
  maxTags = 10,
  disabled,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  disabled?: boolean;
}) {
  const [draft, setDraft] = useState("");

  function addTag(raw: string) {
    const tag = raw.trim().replace(/^#+/, "");
    if (!tag) return;
    if (value.some((item) => item.toLowerCase() === tag.toLowerCase())) {
      setDraft("");
      return;
    }
    if (value.length >= maxTags) return;
    onChange([...value, tag]);
    setDraft("");
  }

  function removeTag(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag(draft);
    } else if (event.key === "Backspace" && !draft && value.length > 0) {
      removeTag(value.length - 1);
    }
  }

  return (
    <div
      className={cn(
        inputClasses,
        "flex min-h-11 flex-wrap items-center gap-1.5 py-1.5",
        disabled && "opacity-60",
      )}
    >
      {value.map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
        >
          #{tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            aria-label={`Xóa tag ${tag}`}
            disabled={disabled}
            className="rounded-sm text-primary/70 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <X className="size-3" aria-hidden />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addTag(draft)}
        disabled={disabled || value.length >= maxTags}
        placeholder={value.length === 0 ? "Nhập tag rồi nhấn Enter" : "Thêm tag..."}
        aria-label="Thêm tag"
        className="min-w-32 flex-1 bg-transparent px-1 py-0.5 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
      />
      {draft ? (
        <button
          type="button"
          onClick={() => addTag(draft)}
          aria-label="Thêm tag"
          className="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="size-3" aria-hidden />
          Thêm
        </button>
      ) : null}
    </div>
  );
}
