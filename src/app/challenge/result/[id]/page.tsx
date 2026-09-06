import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Check, Clock, ExternalLink, Repeat, ShieldCheck, Trophy, X } from "lucide-react";
import { percentileLabel } from "@/challenge/evaluation";
import { getChallenge } from "@/challenge/questions";
import { getAllResults, getResult } from "@/challenge/store";
import ShareButtons from "./ShareButtons";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Result ${id}` };
}

function formatTime(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

export default async function ChallengeResultPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getResult(id);
  if (!result) notFound();

  const challenge = getChallenge(result.slug);
  const others = (await getAllResults()).filter(
    (r) => r.id !== result.id && r.slug === result.slug,
  );
  const percentile = percentileLabel(result.percent, others);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {/* Score hero */}
      <div className="rounded-3xl border border-[#dde4da] bg-white p-8 text-center shadow-md sm:p-12">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#d6ded2] px-4 py-2 text-xs font-semibold text-[#30404a]">
          <span className="h-2 w-2 rounded-full bg-[#42b719]" />
          {challenge ? challenge.category : result.slug} ·{" "}
          {challenge ? challenge.title : result.slug}
        </div>
        <div className="mt-6 text-7xl font-extrabold tracking-tight text-[#0d161c] sm:text-8xl">
          {result.percent}
          <span className="text-3xl text-[#8c9ba5]">%</span>
        </div>
        <p className="mt-3 flex items-center justify-center gap-2 text-lg font-bold text-[#2f9e14]">
          <Trophy className="h-5 w-5" />
          {percentile}
        </p>
        <p className="mt-4 text-sm text-[#5f6c74]">
          Score {result.score}/{result.max} · {result.name}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#5f6c74]">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {formatTime(result.timeMs)}
          </span>
          <span className="flex items-center gap-1.5">
            <Repeat className="h-3.5 w-3.5" />
            {result.runCount} run{result.runCount === 1 ? "" : "s"}
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-[#42b719]" />
            {result.id}
          </span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="mt-6 rounded-3xl border border-[#dde4da] bg-white p-6 shadow-2xs sm:p-8">
        <h2 className="text-lg font-bold text-[#0d161c]">Breakdown</h2>
        <ul className="mt-4 space-y-2.5">
          {result.breakdown.map((item) => (
            <li key={item.id} className="flex items-start gap-3">
              {item.passed ? (
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#42b719]" />
              ) : (
                <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              )}
              <span className="flex-1 text-sm text-[#33424a]">{item.label}</span>
              <span
                className={`text-sm font-bold ${item.passed ? "text-[#2f9e14]" : "text-[#8c9ba5]"}`}
              >
                {Math.round(item.points * 10) / 10}/{Math.round(item.max * 10) / 10}
              </span>
            </li>
          ))}
        </ul>
        {challenge && (
          <div className="mt-6 rounded-2xl bg-[#f7f7f4] p-4 text-sm leading-relaxed text-[#5b6870]">
            <span className="font-bold text-[#0d161c]">Why it matters: </span>
            {challenge.explanation}
          </div>
        )}
      </div>

      {/* Share / challenge a friend */}
      <div className="mt-6 rounded-3xl border border-[#dde4da] bg-white p-6 shadow-2xs sm:p-8">
        <h2 className="text-lg font-bold text-[#0d161c]">Challenge a friend</h2>
        <p className="mt-1 text-sm text-[#5f6c74]">
          Think they can beat {result.percent}%? Send it over.
        </p>
        <div className="mt-4">
          <ShareButtons
            resultId={result.id}
            percent={result.percent}
            challengeTitle={challenge ? challenge.title : result.slug}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          href={`/challenge/${result.slug}`}
          className="rounded-xl bg-[#0e171d] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#1d2a32]"
        >
          Try again
        </Link>
        <Link
          href="/challenge/leaderboard"
          className="rounded-xl border border-[#cfd7cf] bg-white px-5 py-3 text-sm font-semibold text-[#142027] shadow-2xs transition hover:border-[#9fb89d]"
        >
          Leaderboard
        </Link>
        <Link
          href={`/verify/${result.id}`}
          className="flex items-center gap-1.5 rounded-xl border border-[#cfd7cf] bg-white px-5 py-3 text-sm font-semibold text-[#142027] shadow-2xs transition hover:border-[#9fb89d]"
        >
          <ExternalLink className="h-4 w-4 text-[#42b719]" />
          Public verify page
        </Link>
        <a
          href="https://plzwork.app"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-sm font-semibold text-[#42b719] hover:underline"
        >
          Something new is coming at plzwork.app ↗
        </a>
      </div>
    </div>
  );
}