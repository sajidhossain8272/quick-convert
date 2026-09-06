import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "Plzwork Challenge — AI Can Write Your Code. Can You?",
    template: "%s · Plzwork Challenge",
  },
  description:
    "Take a 60-second developer challenge. No AI. No excuses. Instant scoring, percentile ranking and a public leaderboard.",
};

export default function ChallengeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f7f4] text-[#0f171d]">
      <header className="sticky top-0 z-40 border-b border-[#e3e8df] bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/challenge" className="flex items-baseline gap-1.5">
            <span className="text-lg font-extrabold tracking-tight text-[#0d161c]">
              PLZWORK
            </span>
            <span className="text-lg font-extrabold tracking-tight text-[#42b719]">
              CHALLENGE
            </span>
          </Link>
          <nav className="flex items-center gap-2 text-sm font-semibold">
            <Link
              href="/challenge"
              className="rounded-full px-3 py-1.5 text-[#33424a] transition hover:bg-[#eef2ea] hover:text-[#0d161c]"
            >
              Challenges
            </Link>
            <Link
              href="/challenge/leaderboard"
              className="rounded-full px-3 py-1.5 text-[#33424a] transition hover:bg-[#eef2ea] hover:text-[#0d161c]"
            >
              Leaderboard
            </Link>
            <a
              href="https://plzwork.app"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 hidden rounded-full bg-[#0d161c] px-4 py-1.5 text-white transition hover:bg-[#1d2a32] sm:block"
            >
              plzwork.app ↗
            </a>
          </nav>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="border-t border-[#e3e8df] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-[#8c9ba5] sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} Plzwork Challenge — prove you can code.</span>
          <span>
            Part of the{" "}
            <a
              href="https://plzwork.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#42b719] hover:underline"
            >
              Plzwork
            </a>{" "}
            ecosystem.
          </span>
        </div>
      </footer>
    </div>
  );
}