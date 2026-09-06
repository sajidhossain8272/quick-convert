"use strict";

const { parentPort } = require("node:worker_threads");

function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a === "number" && typeof b === "number") {
    return Number.isNaN(a) && Number.isNaN(b);
  }
  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") {
    return false;
  }
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => deepEqual(v, b[i]));
  }
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => deepEqual(a[k], b[k]));
}

parentPort.on("message", (msg) => {
  const { code, tests, entry } = msg;
  const verdicts = [];
  let ready = true;
  try {
    const fn = new Function(code + "\n;return " + entry + ";")();
    if (typeof fn !== "function") {
      ready = false;
    } else {
      for (const t of tests) {
        try {
          const value = fn(...t.args);
          verdicts.push(deepEqual(value, t.expected));
        } catch {
          verdicts.push(false);
        }
      }
    }
  } catch {
    ready = false;
  }
  parentPort.postMessage(ready ? verdicts : tests.map(() => false));
});