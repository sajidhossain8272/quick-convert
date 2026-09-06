import { NextResponse } from "next/server";
import { evaluate, getEvaluation, newResultId, percentileLabel } from "@/challenge/evaluation";
import { getChallenge } from "@/challenge/questions";
import { appendResult, getResultsFor, type StoredResult } from "@/challenge/store";

export const runtime = "nodejs";

function sanitizeName(raw: unknown): string {
  const name = typeof raw === "string" ? raw.replace(/[^\p{L}\p{N} _.-]/gu, "").trim() : "";
  return (name || "Anonymous Dev").slice(0, 24);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { slug, code, selectedId, timeMs, runCount, name } = (body ?? {}) as {
    slug?: unknown;
    code?: unknown;
    selectedId?: unknown;
    timeMs?: unknown;
    runCount?: unknown;
    name?: unknown;
  };

  if (typeof slug !== "string") {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const challenge = getChallenge(slug);
  const config = getEvaluation(slug);
  if (!challenge || !config) {
    return NextResponse.json({ error: "Unknown challenge" }, { status: 404 });
  }

  if (typeof code !== "string" && typeof selectedId !== "string") {
    return NextResponse.json({ error: "No solution submitted" }, { status: 400 });
  }

  const safeTimeMs = Math.min(Math.max(Number(timeMs) || 0, 0), 15 * 60_000);
  const safeRunCount = Math.min(Math.max(Math.floor(Number(runCount) || 0), 0), 999);

  const evaluation = await evaluate(challenge, config, {
    code: typeof code === "string" ? code : undefined,
    selectedId: typeof selectedId === "string" ? selectedId : undefined,
  });

  const result: StoredResult = {
    id: newResultId(),
    slug: challenge.slug,
    name: sanitizeName(name),
    score: evaluation.score,
    max: evaluation.max,
    percent: evaluation.percent,
    timeMs: safeTimeMs,
    runCount: safeRunCount,
    createdAt: new Date().toISOString(),
    breakdown: evaluation.breakdown,
  };

  await appendResult(result);

  const others = (await getResultsFor(challenge.slug)).filter((r) => r.id !== result.id);

  return NextResponse.json({
    resultId: result.id,
    slug: result.slug,
    score: result.score,
    max: result.max,
    percent: result.percent,
    timeMs: result.timeMs,
    percentile: percentileLabel(result.percent, others),
  });
}
