"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

/**
 * Renders the Quick Convert chrome (NavBar/Footer) everywhere EXCEPT the
 * Plzwork Challenge platform routes (/challenge/*, /verify/*), which ship
 * their own standalone header/footer via src/app/challenge/layout.tsx.
 */
export default function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";
  const standalone =
    pathname.startsWith("/challenge") || pathname.startsWith("/verify");

  if (standalone) {
    return <>{children}</>;
  }

  return (
    <>
      <NavBar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}