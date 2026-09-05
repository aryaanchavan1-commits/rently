"use client";

import { type ReactNode } from "react";
import { LangProvider } from "@/lib/lang-context";

export default function LangProviderWrap({ children }: { children: ReactNode }) {
  return <LangProvider>{children}</LangProvider>;
}
