// Plzwork Challenge — result store.
// Zero-dependency JSON file persistence (works with `next start` on a VM).
// On ephemeral/serverless hosts data is per-instance — swap this module for a
// database later without touching callers (see PLZWORK_CHALLENGE_MEMORY.md).

import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import type { ScoredRule } from "./evaluation";

export interface StoredResult {
  id: string;
  slug: string;
  name: string;
  score: number;
  max: number;
  percent: number;
  timeMs: number;
  runCount: number;
  createdAt: string;
  breakdown: ScoredRule[];
}

interface StoreShape {
  version: 1;
  results: StoredResult[];
}

function dataFile(): string {
  return (
    process.env.CHALLENGE_DATA_FILE ??
    path.join(process.cwd(), "data", "challenge-results.json")
  );
}

const EMPTY_STORE: StoreShape = { version: 1, results: [] };

/** Single-writer queue so concurrent submissions never clobber each other. */
let queue: Promise<unknown> = Promise.resolve();
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export async function readStore(): Promise<StoreShape> {
  try {
    const raw = await fsp.readFile(dataFile(), "utf8");
    const parsed = JSON.parse(raw) as StoreShape;
    if (parsed && Array.isArray(parsed.results)) {
      return parsed;
    }
    return EMPTY_STORE;
  } catch {
    return EMPTY_STORE;
  }
}

export async function appendResult(result: StoredResult): Promise<void> {
  await withLock(async () => {
    const store = await readStore();
    store.results.push(result);
    await fsp.mkdir(path.dirname(dataFile()), { recursive: true });
    await fsp.writeFile(dataFile(), JSON.stringify(store, null, 2), "utf8");
  });
}

export async function getResult(id: string): Promise<StoredResult | null> {
  const store = await readStore();
  return store.results.find((r) => r.id === id) ?? null;
}

export async function getResultsFor(slug: string): Promise<StoredResult[]> {
  const store = await readStore();
  return store.results.filter((r) => r.slug === slug);
}

export async function getAllResults(): Promise<StoredResult[]> {
  return readStore().then((s) => s.results);
}

export function storeExists(): boolean {
  try {
    return fs.existsSync(dataFile());
  } catch {
    return false;
  }
}