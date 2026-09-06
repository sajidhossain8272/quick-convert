import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { getChallenge } from "@/challenge/questions";
import { getResult } from "@/challenge/store";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Verify ${id}` };
}

/**
 * Public, shareable verification page (future credential infrastructure —
 * see PLZWORK_CHALLENGE_MEMORY.md §7). Shows only public data; never telemetry.
 */
export default async function VerifyResultPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getResult(id);
  if (!result) notFound();

  const challenge = getChallenge(result.slug);
  const completed = new Date(result.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f7f4] px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-[#dde4da] bg-white p-8 shadow-md">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-[#42b719]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#2f9e14]">
            Verified result · Plzwork Challenge
          </span>
        </div>

        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-[#0d161c]">
          {result.name}
        </h1>
        <p className="mt-1 text-sm text-[#5f6c74]">
          {challenge ? `${challenge.category} — ${challenge.title}` : result.slug}
        </p>

        <div className="mt-6 flex items-end justify-between rounded-2xl bg-[#f7f7f4] p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8c9ba5]">
              Score
            </p>
            <p className="text-4xl font-extrabold text-[#0d161c]">
              {result.score}
              <span className="text-lg text-[#8c9ba5]">/{result.max}</span>
            </p>
          </div>
          <p className="text-4xl font-extrabold text-[#42b719]">{result.percent}%</p>
        </div>

        <dl className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-[#5f6c74]">Completed</dt>
            <dd className="font-semibold text-[#0d161c]">{completed}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[#5f6c74]">Result ID</dt>
            <dd className="font-mono font-semibold text-[#0d161c]">{result.id}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[#5f6c74]">Status</dt>
            <dd className="font-semibold text-[#2f9e14]">Verified</dd>
          </div>
        </dl>

        <div className="mt-8 flex items-center justify-between text-sm">
          <Link
            href={`/challenge/result/${result.id}`}
            className="font-semibold text-[#42b719] hover:underline"
          >
            View full result →
          </Link>
          <a
            href="https://plzwork.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5f6c74] hover:text-[#0d161c]"
          >
            plzwork.app ↗
          </a>
        </div>
      </div>
    </div>
  );
}