// Plzwork Challenge — server-side evaluation engine.
// SERVER ONLY: contains answers, hidden tests and the node:vm runner.
// Never import this module from a client component.

import { randomBytes } from "node:crypto";
import { Worker } from "node:worker_threads";
import path from "node:path";
import type { ChallengeMeta } from "./questions";

const WORKER_PATH = path.join(process.cwd(), "src", "challenge", "runner.cjs");

export interface RubricRule {
  id: string;
  label: string;
  points: number;
  /** Regex source that must match somewhere in the submission. */
  pattern?: string;
  /** Every pattern here must match. */
  all?: string[];
  /** No pattern here may match. */
  none?: string[];
}

export interface JsTest {
  label: string;
  args: unknown[];
  expected: unknown;
}

export type EvaluationConfig =
  | { kind: "rubric"; rules: RubricRule[] }
  | { kind: "js"; entry: string; tests: JsTest[] }
  | { kind: "mcq"; correctId: string };

export interface ScoredRule {
  id: string;
  label: string;
  points: number;
  max: number;
  passed: boolean;
}

export interface EvaluationResult {
  score: number;
  max: number;
  percent: number;
  breakdown: ScoredRule[];
}

export interface Submission {
  code?: string;
  selectedId?: string;
}

const EVALUATIONS: Record<string, EvaluationConfig> = {
  "html-semantic-button": {
    kind: "rubric",
    rules: [
      {
        id: "uses-button",
        label: "Replaces the div with a native <button> element",
        points: 4,
        pattern: "<button\\b",
      },
      {
        id: "semantics",
        label: "Button wraps the Submit label with safe semantics",
        points: 2,
        all: ["<button[^>]*>\\s*Submit\\s*</button>"],
        none: ["<button[^>]*type\\s*=\\s*[\"']submit[\"']"],
      },
      {
        id: "keyboard",
        label: "Keyboard accessibility comes from the native element",
        points: 2,
        all: ["<button\\b"],
        none: ["role\\s*=\\s*[\"']button[\"']", "tabindex\\s*="],
      },
      {
        id: "minimal",
        label: "No unnecessary ARIA, tabindex or extra key handlers",
        points: 2,
        none: ["aria-\\w+\\s*=", "tabindex\\s*=", "on(key|dblclick)\\w*\\s*="],
      },
    ],
  },
  "html-image-alt": {
    kind: "rubric",
    rules: [
      {
        id: "has-alt",
        label: "Adds a non-empty alt attribute",
        points: 4,
        pattern: "<img[^>]*\\salt\\s*=\\s*[\"'][^\"']+[\"']",
      },
      {
        id: "meaningful",
        label: "alt describes the content (not generic or the filename)",
        points: 2,
        none: [
          "alt\\s*=\\s*[\"']\\s*(image|img|picture|photo|graphic|spacer|untitled|logo\\.png)\\s*[\"']",
        ],
      },
      {
        id: "src-kept",
        label: "Keeps the original image source",
        points: 2,
        pattern: "<img[^>]*src\\s*=\\s*[\"']logo\\.png[\"']",
      },
      {
        id: "not-hidden",
        label: "Doesn't hide the image from assistive technology",
        points: 2,
        none: ["aria-hidden\\s*=\\s*[\"']true[\"']", "role\\s*=\\s*[\"']presentation[\"']"],
      },
    ],
  },
  "html-label-association": {
    kind: "rubric",
    rules: [
      {
        id: "label-for",
        label: "Label uses the for attribute",
        points: 3,
        pattern: "<label[^>]*\\sfor\\s*=\\s*[\"'][^\"']+[\"']",
      },
      {
        id: "input-id",
        label: "Input gets an id",
        points: 3,
        pattern: "<input[^>]*\\sid\\s*=\\s*[\"'][^\"']+[\"']",
      },
      {
        id: "linked",
        label: "for and id values match",
        points: 2,
        pattern: "for\\s*=\\s*[\"']([\\w-]+)[\"'][\\s\\S]*?id\\s*=\\s*[\"']\\1[\"']",
      },
      {
        id: "email-kept",
        label: "Keeps the email input type",
        points: 2,
        pattern: "<input[^>]*type\\s*=\\s*[\"']email[\"']",
      },
    ],
  },
  "html-links-vs-buttons": {
    kind: "rubric",
    rules: [
      { id: "uses-button", label: "Uses a <button> for the action", points: 5, pattern: "<button\\b" },
      {
        id: "no-hash",
        label: "Removes the href=\"#\" link placeholder",
        points: 2,
        none: ["<a\\s[^>]*href\\s*=\\s*[\"']#[\"']"],
      },
      {
        id: "keeps-label",
        label: "Preserves the Open label",
        points: 2,
        pattern: "<button[^>]*>\\s*Open\\s*</button>",
      },
      {
        id: "keeps-action",
        label: "Wires the modal action (openModal)",
        points: 1,
        pattern: "openModal\\s*\\(",
      },
    ],
  },
  "css-flexbox-center": {
    kind: "rubric",
    rules: [
      {
        id: "flex",
        label: "Makes .container a flex container",
        points: 4,
        pattern: "\\.container\\s*{[^}]*display\\s*:\\s*flex",
      },
      {
        id: "justify",
        label: "Centers the main axis (justify-content: center)",
        points: 3,
        pattern: "\\.container\\s*{[^}]*justify-content\\s*:\\s*center",
      },
      {
        id: "align",
        label: "Centers the cross axis (align-items: center)",
        points: 3,
        pattern: "\\.container\\s*{[^}]*align-items\\s*:\\s*center",
      },
    ],
  },
  "js-find-duplicate": {
    kind: "js",
    entry: "hasDuplicate",
    tests: [
      { label: "Test 1 — [1, 2, 3] → false", args: [[1, 2, 3]], expected: false },
      { label: "Test 2 — [1, 2, 3, 2] → true", args: [[1, 2, 3, 2]], expected: true },
      { label: "Test 3 — [\"a\", \"b\", \"a\"] → true", args: [["a", "b", "a"]], expected: true },
      { label: "Test 4 — [] → false", args: [[]], expected: false },
      { label: "Test 5 (hidden) — [1.5, \"1.5\", 1.5] → true", args: [[1.5, "1.5", 1.5]], expected: true },
    ],
  },
  "js-first-unique-char": {
    kind: "js",
    entry: "firstUniqueChar",
    tests: [
      { label: "Test 1 — \"swiss\" → \"w\"", args: ["swiss"], expected: "w" },
      { label: "Test 2 — \"aabbcc\" → null", args: ["aabbcc"], expected: null },
      { label: "Test 3 — \"leetcode\" → \"l\"", args: ["leetcode"], expected: "l" },
      { label: "Test 4 (hidden) — \"\" → null", args: [""], expected: null },
      { label: "Test 5 (hidden) — \"aA\" → \"a\"", args: ["aA"], expected: "a" },
    ],
  },
  "logic-predict-output": {
    kind: "mcq",
    correctId: "B",
  },
};

export function getEvaluation(slug: string): EvaluationConfig | undefined {
  return EVALUATIONS[slug];
}

function matches(pattern: string, code: string): boolean {
  return new RegExp(pattern, "i").test(code);
}

function rulePassed(rule: RubricRule, code: string): boolean {
  if (rule.pattern && !matches(rule.pattern, code)) return false;
  if (rule.all && !rule.all.every((p) => matches(p, code))) return false;
  if (rule.none && rule.none.some((p) => matches(p, code))) return false;
  return true;
}

function evalRubric(code: string, max: number, rules: RubricRule[]): EvaluationResult {
  const breakdown: ScoredRule[] = rules.map((rule) => {
    const passed = rulePassed(rule, code);
    return { id: rule.id, label: rule.label, points: passed ? rule.points : 0, max: rule.points, passed };
  });
  const score = breakdown.reduce((sum, r) => sum + r.points, 0);
  return { score, max, percent: Math.round((score / max) * 100), breakdown };
}

const VM_TIMEOUT_MS = 1500;
const MAX_CODE_LENGTH = 20000;

/**
 * Runs one candidate's JavaScript solution against every test inside an
 * isolated worker thread with a hard terminate() timeout. This guarantees:
 *  - the main event loop is never blocked by user code
 *  - a runaway (infinite loop, deep recursion) is forcibly killed
 *  - hidden test results are never leaked — only the verdict comes back
 */
function runInWorker(code: string, tests: JsTest[], entry: string): Promise<boolean[]> {
  return new Promise((resolve) => {
    const worker = new Worker(WORKER_PATH);

    const timer = setTimeout(() => {
      worker.terminate();
      resolve(tests.map(() => false));
    }, VM_TIMEOUT_MS);

    worker.on("message", (verdicts: boolean[]) => {
      clearTimeout(timer);
      worker.terminate().catch(() => {});
      resolve(verdicts ?? tests.map(() => false));
    });

    worker.on("error", () => {
      clearTimeout(timer);
      resolve(tests.map(() => false));
    });

    worker.postMessage({ code, tests, entry });
  });
}

async function evalJs(
  code: string,
  max: number,
  entry: string,
  tests: JsTest[],
): Promise<EvaluationResult> {
  const verdicts = await runInWorker(code.slice(0, MAX_CODE_LENGTH), tests, entry);
  const perTest = tests.length > 0 ? max / tests.length : 0;
  const breakdown: ScoredRule[] = tests.map((t, i) => {
    const passed = verdicts[i] ?? false;
    return {
      id: t.label,
      label: t.label,
      points: passed ? perTest : 0,
      max: perTest,
      passed,
    };
  });
  const score = Math.round(breakdown.reduce((sum, r) => sum + r.points, 0));
  return { score, max, percent: Math.round((score / max) * 100), breakdown };
}

async function runOnlyAsync(
  slug: string,
  code: string,
): Promise<{ passed: number; total: number } | null> {
  const config = EVALUATIONS[slug];
  if (!config || config.kind !== "js") return null;
  const result = await evalJs(code.slice(0, MAX_CODE_LENGTH), config.tests.length, config.entry, config.tests);
  return {
    passed: result.breakdown.filter((r) => r.passed).length,
    total: config.tests.length,
  };
}

function evalMcq(selectedId: string | undefined, max: number, correctId: string): EvaluationResult {
  const passed = selectedId === correctId;
  return {
    score: passed ? max : 0,
    max,
    percent: passed ? 100 : 0,
    breakdown: [
      {
        id: "correct-option",
        label: "Correct answer",
        points: passed ? max : 0,
        max,
        passed,
      },
    ],
  };
}

export async function evaluate(
  challenge: Pick<ChallengeMeta, "slug" | "maxPoints" | "kind">,
  config: EvaluationConfig,
  submission: Submission,
): Promise<EvaluationResult> {
  const code = (submission.code ?? "").slice(0, MAX_CODE_LENGTH);
  if (config.kind === "rubric") {
    return evalRubric(code, challenge.maxPoints, config.rules);
  }
  if (config.kind === "js") {
    return evalJs(code, challenge.maxPoints, config.entry, config.tests);
  }
  return evalMcq(submission.selectedId, challenge.maxPoints, config.correctId);
}

/** Limited feedback for the Run button: counts only, never reveals which tests. */
export async function runOnly(
  slug: string,
  code: string,
): Promise<{ passed: number; total: number } | null> {
  const config = EVALUATIONS[slug];
  if (!config || config.kind !== "js") return null;
  return runOnlyAsync(slug, code);
}

/** Result ids look like PC-8F29A1 (future /verify/[resultId] support). */
export function newResultId(): string {
  return `PC-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export function percentileLabel(percent: number, others: { percent: number }[]): string {
  if (others.length === 0) return "First developer to take this challenge";
  const better = others.filter((o) => o.percent < percent).length;
  const pct = Math.round((better / others.length) * 100);
  return `Better than ${pct}% of developers`;
}
