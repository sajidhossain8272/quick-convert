import { NextResponse } from "next/server";
import { runOnly } from "@/challenge/evaluation";

export const runtime = "nodejs";

const MAX_CODE_LENGTH = 20000;

/**
 * Limited-feedback execution for the Run button (JavaScript challenges only):
 * returns pass counts, never which tests failed — candidates can't
 * reverse-engineer the evaluator (see PLZWORK_CHALLENGE_MEMORY.md §4).
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { slug, code } = (body ?? {}) as { slug?: unknown; code?: unknown };
  if (typeof slug !== "string" || typeof code !== "string") {
    return NextResponse.json({ error: "slug and code are required" }, { status: 400 });
  }

  const feedback = await runOnly(slug, code.slice(0, MAX_CODE_LENGTH));
  if (!feedback) {
    return NextResponse.json(
      { error: "Run is preview-only for this challenge" },
      { status: 400 },
    );
  }

  return NextResponse.json(feedback);
}
