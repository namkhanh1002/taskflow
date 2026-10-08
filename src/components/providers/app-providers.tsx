"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";
import { useHydrated } from "@/hooks/use-hydrated";

function AppToaster() {
  const { resolvedTheme } = useTheme();
  const hydrated = useHydrated();

  if (!hydrated) return null;

  return (
    <Toaster
      position="top-right"
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      richColors
      closeButton
      duration={3500}
      gap={10}
    />
  );
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
      <AppToaster />
    </ThemeProvider>
  );
}
