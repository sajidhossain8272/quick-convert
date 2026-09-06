import { unlink } from "node:fs/promises";
import os from "node:os";
import path from "path";
import { randomUUID } from "crypto";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import {
  evaluate,
  getEvaluation,
  newResultId,
  percentileLabel,
  runOnly,
  type Submission,
} from "./evaluation";
import { CHALLENGES, getChallenge } from "./questions";
import { appendResult, getAllResults, getResult, readStore } from "./store";

describe("Plzwork Challenge — question bank integrity", () => {
  it("has an evaluation config for every challenge", () => {
    for (const challenge of CHALLENGES) {
      expect(getEvaluation(challenge.slug), challenge.slug).toBeDefined();
    }
  });

  it("rubric rule points sum to maxPoints", () => {
    for (const challenge of CHALLENGES) {
      const config = getEvaluation(challenge.slug);
      if (config?.kind === "rubric") {
        const sum = config.rules.reduce((acc, r) => acc + r.points, 0);
        expect(sum, challenge.slug).toBe(challenge.maxPoints);
      }
      if (config?.kind === "js") {
        expect(config.tests.length, challenge.slug).toBeGreaterThan(0);
      }
    }
  });

  it("locked prototype html-semantic-button has the 30s / 10pt spec", () => {
    const challenge = getChallenge("html-semantic-button");
    expect(challenge).toBeDefined();
    expect(challenge?.timeLimitSec).toBe(30);
    expect(challenge?.maxPoints).toBe(10);
    expect(challenge?.starterCode).toContain('<div class="button"');
  });
});

describe("Plzwork Challenge — rubric evaluation", () => {
  const challenge = getChallenge("html-semantic-button")!;
  const config = getEvaluation("html-semantic-button")!;
  const run = async (code: string) => evaluate(challenge, config, { code } as Submission);

  it("scores the model answer full marks", async () => {
    const result = await run('<button type="button" onclick="submitForm()">Submit</button>');
    expect(result.score).toBe(10);
    expect(result.percent).toBe(100);
    expect(result.breakdown.every((r) => r.passed)).toBe(true);
  });

  it("accepts a native button without explicit type", async () => {
    expect((await run('<button onclick="submitForm()">Submit</button>')).score).toBe(10);
  });

  it("gives the original starter code a low score", async () => {
    expect((await run(challenge.starterCode ?? "")).score).toBeLessThanOrEqual(2);
  });

  it("rejects ARIA role hacks", async () => {
    expect((await run('<div role="button" tabindex="0">Submit</div>')).score).toBeLessThan(5);
  });

  it("rewards partial fixes", async () => {
    const result = await run('<button type="button" onclick="submitForm()">Click</button>');
    expect(result.score).toBeGreaterThan(4);
    expect(result.score).toBeLessThan(10);
  });
});

describe("Plzwork Challenge — html-image-alt", () => {
  const challenge = getChallenge("html-image-alt")!;
  const config = getEvaluation("html-image-alt")!;
  const run = async (code: string) => evaluate(challenge, config, { code });

  it("scores a meaningful alt full marks", async () => {
    expect((await run('<img src="logo.png" alt="Plzwork logo">')).score).toBe(10);
  });

  it("penalizes generic alt text", async () => {
    expect((await run('<img src="logo.png" alt="image">')).score).toBe(8);
  });

  it("penalizes hiding the image", async () => {
    expect((await run('<img src="logo.png" alt="Plzwork logo" aria-hidden="true">')).score).toBe(8);
  });
});

describe("Plzwork Challenge — html-label-association", () => {
  const challenge = getChallenge("html-label-association")!;
  const config = getEvaluation("html-label-association")!;
  const run = async (code: string) => evaluate(challenge, config, { code });

  it("scores a correct for/id pair full marks", async () => {
    expect(
      (await run('<label for="email">Email</label>\n<input type="email" id="email">')).score,
    ).toBe(10);
  });

  it("catches mismatched for/id values", async () => {
    expect(
      (await run('<label for="email">Email</label>\n<input type="email" id="mail">')).score,
    ).toBe(8);
  });
});

describe("Plzwork Challenge — html-links-vs-buttons", () => {
  const challenge = getChallenge("html-links-vs-buttons")!;
  const config = getEvaluation("html-links-vs-buttons")!;
  const run = async (code: string) => evaluate(challenge, config, { code });

  it("scores the proper button full marks", async () => {
    expect((await run('<button type="button" onclick="openModal()">Open</button>')).score).toBe(10);
  });

  it("keeps punishing the anchor version", async () => {
    expect((await run('<a href="#" onclick="openModal()">Open</a>')).score).toBeLessThanOrEqual(1);
  });
});

describe("Plzwork Challenge — css-flexbox-center", () => {
  const challenge = getChallenge("css-flexbox-center")!;
  const config = getEvaluation("css-flexbox-center")!;
  const run = async (code: string) => evaluate(challenge, config, { code });

  it("scores the flexbox recipe full marks", async () => {
    expect(
      (await run(".container { display: flex; justify-content: center; align-items: center; }"))
        .score,
    ).toBe(10);
  });

  it("awards partial credit for one-axis centering", async () => {
    expect((await run(".container { display: flex; justify-content: center; }")).score).toBe(7);
  });
});

describe("Plzwork Challenge — JavaScript sandbox evaluation", () => {
  const dup = getChallenge("js-find-duplicate")!;
  const dupConfig = getEvaluation("js-find-duplicate")!;
  const runDup = async (code: string) => evaluate(dup, dupConfig, { code });

  it("scores the Set-based solution full marks", async () => {
    const result = await runDup(
      "function hasDuplicate(items) { return new Set(items).size !== items.length; }",
    );
    expect(result.score).toBe(10);
    expect(result.percent).toBe(100);
  });

  it("gives partial credit for a wrong-but-running solution", async () => {
    const result = await runDup("function hasDuplicate(items) { return items.length > 3; }");
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThan(10);
  });

  it("fails safely on syntax errors", async () => {
    expect((await runDup("function hasDuplicate(items) { return")).score).toBe(0);
  });

  it("terminates runaway loops via worker timeout without hanging", async () => {
    expect(
      (await runDup("function hasDuplicate(items) { while (true) {} }")).score,
    ).toBe(0);
  });

  it("reports limited run feedback (counts only, no which-test)", async () => {
    await expect(
      runOnly(
        "js-find-duplicate",
        "function hasDuplicate(items) { return new Set(items).size !== items.length; }",
      ),
    ).resolves.toEqual({ passed: 5, total: 5 });
    await expect(runOnly("html-semantic-button", "<button>Submit</button>")).resolves.toBeNull();
  });

  const fuc = getChallenge("js-first-unique-char")!;
  const fucConfig = getEvaluation("js-first-unique-char")!;

  it("scores the O(n) firstUniqueChar solution full marks", async () => {
    const result = await evaluate(fuc, fucConfig, {
      code: [
        "function firstUniqueChar(str) {",
        "  const counts = new Map();",
        "  for (const ch of str) counts.set(ch, (counts.get(ch) || 0) + 1);",
        "  for (const ch of str) if (counts.get(ch) === 1) return ch;",
        "  return null;",
        "}",
      ].join("\n"),
    });
    expect(result.score).toBe(10);
  });
});

describe("Plzwork Challenge — MCQ evaluation", () => {
  const challenge = getChallenge("logic-predict-output")!;
  const config = getEvaluation("logic-predict-output")!;

  it("scores the correct option full marks", async () => {
    const result = await evaluate(challenge, config, { selectedId: "B" });
    expect(result.score).toBe(10);
    expect(result.percent).toBe(100);
  });

  it("scores a wrong option zero", async () => {
    expect((await evaluate(challenge, config, { selectedId: "A" })).score).toBe(0);
  });
});

describe("Plzwork Challenge — ids & percentile", () => {
  it("generates PC-XXXXXX style ids", () => {
    expect(newResultId()).toMatch(/^PC-[0-9A-F]{6}$/);
  });

  it("labels percentile correctly", () => {
    expect(percentileLabel(90, [])).toBe("First developer to take this challenge");
    const others = [{ percent: 10 }, { percent: 50 }, { percent: 100 }];
    expect(percentileLabel(90, others)).toBe("Better than 67% of developers");
    expect(percentileLabel(0, others)).toBe("Better than 0% of developers");
  });
});

describe("Plzwork Challenge — JSON file store", () => {
  const tmpFile = path.join(os.tmpdir(), `pc-store-test-${randomUUID()}.json`);

  beforeEach(async () => {
    process.env.CHALLENGE_DATA_FILE = tmpFile;
    await unlink(tmpFile).catch(() => {});
  });

  afterAll(async () => {
    await unlink(tmpFile).catch(() => {});
  });

  it("starts empty and persists appended results", async () => {
    expect(await readStore()).toEqual({ version: 1, results: [] });

    await appendResult({
      id: "PC-000001",
      slug: "html-semantic-button",
      name: "Sajid",
      score: 10,
      max: 10,
      percent: 100,
      timeMs: 12000,
      runCount: 1,
      createdAt: new Date().toISOString(),
      breakdown: [],
    });
    await appendResult({
      id: "PC-000002",
      slug: "html-semantic-button",
      name: "Dev Two",
      score: 8,
      max: 10,
      percent: 80,
      timeMs: 20000,
      runCount: 2,
      createdAt: new Date().toISOString(),
      breakdown: [],
    });

    expect(await getAllResults()).toHaveLength(2);
    expect(await getResult("PC-000001")).toMatchObject({ name: "Sajid", percent: 100 });
    expect(await getResult("NOPE")).toBeNull();
  });
});