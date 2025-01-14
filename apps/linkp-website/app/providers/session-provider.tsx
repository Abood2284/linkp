"use client";

import { SessionProvider } from "next-auth/react";

export default function SessionProviderClient({
  children,
}: {
  children: React.ReactNode;
    }) {
    console.log("Providers component mounting");
  return <SessionProvider>{children}</SessionProvider>;
}
