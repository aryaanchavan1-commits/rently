"use client";

import { type ReactNode } from "react";
import { AuthProvider } from "@/lib/auth-context";

export default function AuthProviderWrap({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
