import Link from "next/link";
import { ArrowRight, Braces, Brain, Clock, Code2, Palette, Trophy, Zap } from "lucide-react";
import {
  ACTIVE_CATEGORIES,
  CHALLENGES,
  UPCOMING_CATEGORIES,
  type ChallengeCategory,
  type ChallengeDifficulty,
} from "@/challenge/questions";
import LandingRecent from "./LandingRecent";

const CATEGORY_ICONS: Record<ChallengeCategory, React.ReactNode> = {
  HTML: <Code2 className="h-5 w-5" />,
  CSS: <Palette className="h-5 w-5" />,
  JavaScript: <Braces className="h-5 w-5" />,
  Logic: <Brain className="h-5 w-5" />,
  React: <Code2 className="h-5 w-5" />,
  C: <Code2 className="h-5 w-5" />,
  "C++": <Code2 className="h-5 w-5" />,
  Assembly: <Code2 className="h-5 w-5" />,
};

const DIFFICULTY_STYLES: Record<ChallengeDifficulty, string> = {
  easy: "bg-[#42b719]/10 text-[#2f9e14]",
  medium: "bg-amber-500/10 text-amber-600",
  hard: "bg-red-500/10 text-red-600",
};

export default function ChallengeLandingPage() {
  const categories = ACTIVE_CATEGORIES.map((category) => ({
    category,
    count: CHALLENGES.filter((c) => c.category === category).length,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Hero */}
      <section className="py-14 text-center sm:py-20">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#d6ded2] bg-white px-4 py-2 text-xs font-semibold text-[#30404a] shadow-2xs">
          <span className="h-2 w-2 rounded-full bg-[#42b719]" />
          Plzwork Challenge · 30–90 second developer tests
        </div>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-[#0d161c] sm:text-5xl lg:text-6xl">
          AI Can Write Your Code. <span className="text-[#42b719]">Can You?</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#5b6870] sm:text-lg">
          Take a 60-second challenge. No AI. No excuses. Instant scoring, percentile
          ranking and a public leaderboard.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`/challenge/${CHALLENGES[0].slug}`}
            className="flex items-center gap-2 rounded-xl bg-[#0e171d] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#1d2a32]"
          >
            <Zap className="h-4 w-4 text-[#42b719]" />
            Take the first challenge
          </Link>
          <Link
            href="/challenge/leaderboard"
            className="flex items-center gap-2 rounded-xl border border-[#cfd7cf] bg-white px-5 py-3.5 text-sm font-semibold text-[#142027] shadow-2xs transition hover:border-[#9fb89d]"
          >
            <Trophy className="h-4 w-4 text-[#42b719]" />
            Leaderboard
          </Link>
        </div>
        <LandingRecent />
      </section>

      {/* Categories */}
      <section className="pb-12">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categories.map(({ category, count }) => (
            <div
              key={category}
              className="rounded-2xl border border-[#dde4da] bg-white p-4 text-left shadow-2xs"
            >
              <div className="flex items-center gap-2 text-[#0d161c]">
                {CATEGORY_ICONS[category]}
                <span className="text-sm font-bold">{category}</span>
              </div>
              <p className="mt-1 text-xs text-[#5f6c74]">
                {count} challenge{count === 1 ? "" : "s"} live
              </p>
            </div>
          ))}
          {UPCOMING_CATEGORIES.map((category) => (
            <div
              key={category}
              className="rounded-2xl border border-dashed border-[#d6ded2] bg-white/50 p-4 text-left"
            >
              <div className="flex items-center gap-2 text-[#9aa7ae]">
                {CATEGORY_ICONS[category]}
                <span className="text-sm font-bold">{category}</span>
              </div>
              <p className="mt-1 text-xs text-[#9aa7ae]">Coming soon</p>
            </div>
          ))}
        </div>
      </section>

      {/* Challenge grid */}
      <section className="pb-14">
        <h2 className="text-2xl font-bold tracking-tight text-[#0d161c]">
          Pick your challenge
        </h2>
        <p className="mt-1 text-sm text-[#5f6c74]">
          Beat the clock. Get scored. Climb the leaderboard.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {CHALLENGES.map((challenge) => (
            <Link
              key={challenge.slug}
              href={`/challenge/${challenge.slug}`}
              className="group flex flex-col rounded-2xl border border-[#dde4da] bg-white p-5 shadow-2xs transition hover:-translate-y-0.5 hover:border-[#9fb89d] hover:shadow-md"
            >
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#eef2ea] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#2f9e14]">
                  {challenge.category}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${DIFFICULTY_STYLES[challenge.difficulty]}`}
                >
                  {challenge.difficulty}
                </span>
                <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-[#5f6c74]">
                  <Clock className="h-3.5 w-3.5" />
                  {challenge.timeLimitSec}s
                </span>
              </div>
              <h3 className="mt-3 text-lg font-bold text-[#0d161c]">{challenge.title}</h3>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-[#5b6870]">
                {challenge.prompt}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#8c9ba5]">
                  {challenge.maxPoints} points
                </span>
                <span className="flex items-center gap-1 text-sm font-bold text-[#2f9e14] transition group-hover:gap-2">
                  Play <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="pb-20">
        <div className="rounded-3xl border border-[#dde4da] bg-white p-8 shadow-2xs">
          <h2 className="text-center text-2xl font-bold tracking-tight text-[#0d161c]">
            How it works
          </h2>
          <div className="mt-8 grid gap-8 text-center sm:grid-cols-3">
            <div>
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#0e171d] text-sm font-bold text-[#42b719]">
                1
              </div>
              <h3 className="mt-3 font-bold text-[#0d161c]">Pick a challenge</h3>
              <p className="mt-1 text-sm text-[#5f6c74]">
                HTML, CSS, JavaScript and Logic. 30–90 seconds each.
              </p>
            </div>
            <div>
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#0e171d] text-sm font-bold text-[#42b719]">
                2
              </div>
              <h3 className="mt-3 font-bold text-[#0d161c]">Beat the clock</h3>
              <p className="mt-1 text-sm text-[#5f6c74]">
                Write code in the browser. Run it. Submit before the timer dies.
              </p>
            </div>
            <div>
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#0e171d] text-sm font-bold text-[#42b719]">
                3
              </div>
              <h3 className="mt-3 font-bold text-[#0d161c]">Get scored &amp; ranked</h3>
              <p className="mt-1 text-sm text-[#5f6c74]">
                Instant score, percentile vs other developers, shareable result.
              </p>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-[#5f6c74]">
            Something new is coming from{" "}
            <a
              href="https://plzwork.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#42b719] hover:underline"
            >
              plzwork.app
            </a>
            . Meanwhile — prove you can still code.
          </p>
        </div>
      </section>
    </div>
  );
}