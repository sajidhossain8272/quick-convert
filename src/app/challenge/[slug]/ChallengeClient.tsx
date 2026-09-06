"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Loader2, Play, Send, Timer } from "lucide-react";
import type { ChallengeMeta } from "@/challenge/questions";

const NAME_STORAGE_KEY = "pc_display_name";
const LAST_RESULT_KEY = "pc_last_result";

interface RunFeedback {
  passed: number;
  total: number;
}

export default function ChallengeClient({ challenge }: { challenge: ChallengeMeta }) {
  const router = useRouter();
  const isCode = challenge.kind === "code";
  const isJs = challenge.kind === "code" && challenge.category === "JavaScript";

  const [code, setCode] = useState(challenge.starterCode ?? "");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(challenge.timeLimitSec);
  const [runCount, setRunCount] = useState(0);
  const [runFeedback, setRunFeedback] = useState<RunFeedback | null>(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const submittedRef = useRef(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(NAME_STORAGE_KEY);
      if (saved) setName(saved);
    } catch {
      // ignore
    }
  }, []);

  const submit = useCallback(
    async (autoSubmitted: boolean) => {
      if (submittedRef.current) return;
      if (challenge.kind === "mcq" && !selectedId && !autoSubmitted) return;
      submittedRef.current = true;
      setSubmitting(true);
      setError(null);
      try {
        const timeMs = (challenge.timeLimitSec - secondsLeft) * 1000;
        const res = await fetch("/api/challenge/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: challenge.slug,
            code: isCode ? code : undefined,
            selectedId: challenge.kind === "mcq" ? selectedId : undefined,
            timeMs,
            runCount,
            name: name.trim(),
          }),
        });
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(body.error || "Submission failed");
        }
        const data = (await res.json()) as { resultId: string; percent: number };
        try {
          window.localStorage.setItem(NAME_STORAGE_KEY, name.trim());
          window.localStorage.setItem(
            LAST_RESULT_KEY,
            JSON.stringify({ id: data.resultId, percent: data.percent, slug: challenge.slug }),
          );
        } catch {
          // ignore
        }
        router.push(`/challenge/result/${data.resultId}`);
      } catch (err) {
        submittedRef.current = false;
        setSubmitting(false);
        setError(err instanceof Error ? err.message : "Submission failed");
      }
    },
    [challenge, code, isCode, name, router, runCount, secondsLeft, selectedId],
  );

  // Countdown timer — auto-submits when time runs out.
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          void submit(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const run = useCallback(async () => {
    if (!isJs || running || submitting) return;
    setRunning(true);
    setError(null);
    try {
      const res = await fetch("/api/challenge/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: challenge.slug, code }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || "Run failed");
      }
      const data = (await res.json()) as RunFeedback;
      setRunFeedback(data);
      setRunCount((c) => c + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Run failed");
    } finally {
      setRunning(false);
    }
  }, [challenge.slug, code, isJs, running, submitting]);

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const { selectionStart, selectionEnd, value } = target;
      const next = `${value.slice(0, selectionStart)}  ${value.slice(selectionEnd)}`;
      setCode(next);
      requestAnimationFrame(() => {
        target.selectionStart = selectionStart + 2;
        target.selectionEnd = selectionStart + 2;
      });
    }
  };

  const timeRatio = secondsLeft / challenge.timeLimitSec;
  const barColor =
    timeRatio > 0.33 ? "bg-[#42b719]" : timeRatio > 0.15 ? "bg-amber-500" : "bg-red-500";
  const timerColor =
    timeRatio > 0.33 ? "text-[#2f9e14]" : timeRatio > 0.15 ? "text-amber-600" : "text-red-600";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/challenge"
          className="flex items-center gap-1 text-sm font-semibold text-[#5f6c74] transition hover:text-[#0d161c]"
        >
          <ArrowLeft className="h-4 w-4" />
          All challenges
        </Link>
        <span className="rounded-full bg-[#eef2ea] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#2f9e14]">
          {challenge.category}
        </span>
        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#5f6c74] shadow-2xs border border-[#dde4da]">
          {challenge.difficulty}
        </span>
        <span className="ml-auto flex items-center gap-1.5 text-sm font-bold">
          <Timer className={`h-4 w-4 ${timerColor}`} />
          <span className={timerColor}>{secondsLeft}s</span>
        </span>
      </div>

      {/* Timer bar */}
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#e3e8df]">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${barColor}`}
          style={{ width: `${Math.max(timeRatio * 100, 0)}%` }}
        />
      </div>

      <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-[#0d161c] sm:text-3xl">
        {challenge.title}
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5b6870] sm:text-base">
        {challenge.prompt}
      </p>

      {/* MCQ options */}
      {challenge.kind === "mcq" && challenge.options && (
        <div className="mt-6 space-y-2">
          {challenge.options.map((option) => {
            const selected = selectedId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => !submitting && setSelectedId(option.id)}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left font-mono text-sm transition ${
                  selected
                    ? "border-[#42b719] bg-[#42b719]/5 ring-1 ring-[#42b719]"
                    : "border-[#dde4da] bg-white hover:border-[#9fb89d]"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    selected ? "bg-[#42b719] text-white" : "bg-[#eef2ea] text-[#5f6c74]"
                  }`}
                >
                  {option.id}
                </span>
                <span className="text-[#0d161c]">{option.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Code editor */}
      {isCode && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-[#1d2a32] bg-[#0d161c] shadow-md">
          <div className="flex items-center justify-between border-b border-[#1d2a32] px-4 py-2">
            <span className="text-xs font-semibold text-gray-400">
              {challenge.category === "JavaScript" ? "solution.js" : "index.html"}
            </span>
            <span className="text-xs text-gray-500">{code.length} chars</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleEditorKeyDown}
            spellCheck={false}
            readOnly={submitting || secondsLeft === 0}
            rows={Math.max(10, code.split("\n").length + 2)}
            className="w-full resize-y bg-[#0d161c] p-4 font-mono text-[13px] leading-6 text-[#e6edf3] outline-none"
          />
        </div>
      )}

      {/* Live preview (HTML/CSS) */}
      {isCode && (challenge.category === "HTML" || challenge.category === "CSS") && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-[#dde4da] bg-white shadow-2xs">
          <div className="border-b border-[#dde4da] px-4 py-2 text-xs font-semibold text-[#5f6c74]">
            Live preview
          </div>
          <iframe title="Preview" sandbox="" srcDoc={code} className="h-64 w-full bg-white" />
        </div>
      )}

      {/* Run feedback (JavaScript) */}
      {isJs && runFeedback && (
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-[#dde4da] bg-white px-4 py-3 text-sm shadow-2xs">
          <Check className="h-4 w-4 text-[#42b719]" />
          <span className="font-semibold text-[#0d161c]">
            {runFeedback.passed}/{runFeedback.total} tests passed
          </span>
          <span className="text-xs text-[#8c9ba5]">
            Hidden tests included — keep refining or submit.
          </span>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {isJs && (
          <button
            type="button"
            onClick={run}
            disabled={running || submitting || secondsLeft === 0}
            className="flex items-center gap-2 rounded-xl border border-[#cfd7cf] bg-white px-5 py-3 text-sm font-semibold text-[#142027] shadow-2xs transition hover:border-[#9fb89d] disabled:opacity-50"
          >
            {running ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4 text-[#42b719]" />
            )}
            Run tests
          </button>
        )}
        <button
          type="button"
          onClick={() => submit(false)}
          disabled={submitting || secondsLeft === 0 || (challenge.kind === "mcq" && !selectedId)}
          className="flex items-center gap-2 rounded-xl bg-[#0e171d] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#1d2a32] disabled:opacity-50"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4 text-[#42b719]" />
          )}
          Submit solution
        </button>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={24}
          placeholder="Display name (optional)"
          className="ml-auto w-48 rounded-xl border border-[#cfd7cf] bg-white px-3.5 py-3 text-sm text-[#0d161c] shadow-2xs outline-none transition focus:border-[#42b719]"
        />
      </div>

      {secondsLeft === 0 && (
        <p className="mt-4 text-sm font-semibold text-red-600">
          Time&apos;s up — submitting whatever you had.
        </p>
      )}
    </div>
  );
}