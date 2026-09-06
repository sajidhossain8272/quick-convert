import Link from "next/link";
import type { Metadata } from "next";
import { Trophy } from "lucide-react";
import { getChallenge, type ChallengeCategory } from "@/challenge/questions";
import { getAllResults } from "@/challenge/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Leaderboard",
};

const FILTERS: ("All" | ChallengeCategory)[] = [
  "All",
  "HTML",
  "CSS",
  "JavaScript",
  "Logic",
];

function formatTime(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function LeaderboardPage({ searchParams }: PageProps) {
  const { category } = await searchParams;
  const active = FILTERS.includes(category as ChallengeCategory)
    ? (category as "All" | ChallengeCategory)
    : "All";

  const all = await getAllResults();
  const rows = all
    .map((r) => ({
      ...r,
      challengeTitle: getChallenge(r.slug)?.title ?? r.slug,
      challengeCategory: getChallenge(r.slug)?.category,
    }))
    .filter((r) => active === "All" || r.challengeCategory === active)
    .sort((a, b) => b.percent - a.percent || a.timeMs - b.timeMs)
    .slice(0, 25);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-3">
        <Trophy className="h-7 w-7 text-[#42b719]" />
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0d161c]">
          Leaderboard
        </h1>
      </div>
      <p className="mt-2 text-sm text-[#5f6c74]">
        {all.length} attempt{all.length === 1 ? "" : "s"} recorded so far. Only the
        boldest make the top 25.
      </p>

      {/* Category filters */}
      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f}
            href={f === "All" ? "/challenge/leaderboard" : `/challenge/leaderboard?category=${f}`}
            className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
              active === f
                ? "bg-[#0e171d] text-white"
                : "border border-[#dde4da] bg-white text-[#5f6c74] hover:border-[#9fb89d]"
            }`}
          >
            {f}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-[#dde4da] bg-white shadow-2xs">
        {rows.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-lg font-bold text-[#0d161c]">No results yet</p>
            <p className="mt-1 text-sm text-[#5f6c74]">
              Be the first to put a score on the board.
            </p>
            <Link
              href="/challenge"
              className="mt-4 inline-block rounded-xl bg-[#0e171d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1d2a32]"
            >
              Take a challenge
            </Link>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#dde4da] bg-[#f7f7f4] text-[11px] uppercase tracking-wider text-[#5f6c74]">
                <th className="px-4 py-3 font-bold">#</th>
                <th className="px-4 py-3 font-bold">Developer</th>
                <th className="hidden px-4 py-3 font-bold sm:table-cell">Challenge</th>
                <th className="px-4 py-3 text-right font-bold">Score</th>
                <th className="hidden px-4 py-3 text-right font-bold sm:table-cell">Time</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={row.id}
                  className="border-b border-[#eef2ea] last:border-0 hover:bg-[#f7f7f4]"
                >
                  <td className="px-4 py-3 font-bold text-[#0d161c]">
                    {index === 0
                      ? "🥇"
                      : index === 1
                        ? "🥈"
                        : index === 2
                          ? "🥉"
                          : index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/challenge/result/${row.id}`}
                      className="font-semibold text-[#0d161c] hover:text-[#2f9e14]"
                    >
                      {row.name}
                    </Link>
                    <span className="block text-xs text-[#8c9ba5] sm:hidden">
                      {row.challengeTitle}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-[#5f6c74] sm:table-cell">
                    {row.challengeTitle}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-[#2f9e14]">
                    {row.percent}%
                  </td>
                  <td className="hidden px-4 py-3 text-right text-[#5f6c74] sm:table-cell">
                    {formatTime(row.timeMs)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="mt-4 text-xs text-[#8c9ba5]">
        Think you belong here?{" "}
        <Link href="/challenge" className="font-semibold text-[#42b719] hover:underline">
          Take a challenge →
        </Link>
      </p>
    </div>
  );
}