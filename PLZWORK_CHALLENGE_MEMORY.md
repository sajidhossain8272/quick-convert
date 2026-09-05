# PLZWORK CHALLENGE — BUILD MEMORY

> **Purpose:** Single source of truth extracted from the ChatGPT strategy conversation
> "Who I Am" (shared 2026-09-06, conversation id `6a9c899e-7ca0-83e8-b351-8a3ff734df32`).
> Everything needed to design + build the challenge product lives in this file.
> Raw transcript backup: `conversation_messages_only.md` (same folder).

---

## 1. CONTEXT

- **Owner:** Sajid Hossain — full-stack dev (React/Next.js/TypeScript/Node/MongoDB/Tailwind/Firebase), product builder, founder of **Plzwork** (parent company of this repo = the Quick Convert app).
- **Repo this will be built in:** `plzwork` (Next.js 15 + React 19 + Tailwind 4 + TypeScript). Existing app: Quick Convert image converter at `quickconvert.plzwork.app`. Do NOT break it.
- **Strategic goal:** Use a viral developer assessment as a **marketing/acquisition engine for plzwork.app** (Plzwork = problem→solution platform). The assessment is also the seed of a future **portable, verifiable proof-of-programming-ability credential** (employer-facing).

---

## 2. PRODUCT STRATEGY — TWO LAYERS

```
Layer 1 — VIRAL CHALLENGE (build this first)
  30–90 seconds, ONE problem, no account required initially
  Categories: HTML, CSS, JavaScript, React, C, C++, Logic/Debugging
  Immediate score → share → challenge friends → loop

Layer 2 — VERIFIED 10-MINUTE ASSESSMENT (credential product, later)
  10 questions, 10 minutes, Google login, hidden tests,
  integrity analysis, Programmer Score, public verification URL
```

Funnel: `Viral challenge → "Can you pass this?" → take challenge → score → share → friends challenge friends → Plzwork brand exposure → plzwork.app`

### Positioning pitch (for companies — NOT "catch the cheaters")
> Companies can verify a résumé, GitHub activity, and interview answers, but they still have very little evidence of how a candidate actually writes and debugs code under time constraints.

- GitHub = what they've built | LinkedIn = what they claim | Interview = what they say | **This assessment = what they can actually do**

### Naming / domain
- Product name: **PLZWORK CHALLENGE** → host at **`challenge.plzwork.app`** (chosen; keeps plzwork.app brand clean). Later: `verify.plzwork.app` for credential infra.
- URLs: `challenge.plzwork.app/challenge/<slug>` (take a challenge), `/leaderboard`, `/profile/<username>`, `/verify/[resultId]`.

---

## 3. MVP SCOPE (final agreed build prompt — build exactly this)

**Landing page headline:** **"AI Can Write Your Code. Can You?"**
Sub-line: "Take a 60-second challenge. No AI. No excuses."

Build:
- Landing page with the headline + challenge category picker
- Developer challenges for **HTML, CSS, JavaScript, React, C/C++, Logic**
- Short **30–90 second** challenges
- Browser-based code editor + **timer**
- Run/submit solution → **server-side evaluation**
- Score + percentage/**percentile** ("Top 12% of developers")
- Challenge difficulty shown
- Public **shareable result** page
- **Developer leaderboard**
- **Google login** for saving results (optional to play)
- Developer **profile** with per-category scores
- **"Challenge a Friend"** sharing
- CTA from results back to **plzwork.app**

### Question engine (NOT hardcoded pages — reusable engine)
Each challenge record:
```
question | category | difficulty | starter code | test cases |
hidden tests | time limit | points | language | explanation
```
Data flow models: `Challenge → Attempt → Submission → Result → Developer Profile`

### Future-ready (architect for, do NOT fully implement yet)
- Every verified result gets unique ID + public URL: **`/verify/[resultId]`**
- Later: GitHub OAuth integration, LinkedIn sharing, verified dev profiles, employer verification, 10-minute full assessment, integrity analysis, embeddable verification badges.

### Product philosophy
- Primarily a **viral developer challenge**, not an HR dashboard. Keep UI extremely simple + competitive.
- No browser locking / no invasive surveillance in the viral layer.

---

## 4. QUESTION ENGINE DETAILS

### Experience flow (Layer 2, 10-min assessment)
```
START TEST → Q1→Q2→Q3 → Q4→Q5 → Q6→Q7→Q8 → Q9→Q10 → RESULT
```
- Every coding question has a **real execution environment**: write → **Run** → hidden tests → **limited feedback only** (`3/5 tests passed` — never reveal failed cases, prevents reverse-engineering).
- Record the **solution process** (event timeline per question), not just final code:
  `00:00 opened → 00:04 typing → 00:21 function created → 00:47 first impl → 01:02 Run 2/5 → 01:15 modify → 01:34 Run 5/5 → 01:41 Submit`
- **Difficulty distribution:** Q1 Easy, Q2 Easy, Q3–Q8 Medium, Q9 Medium/Hard, Q10 Hard. Do NOT make the test artificially hard; differentiation = **speed + correctness + edge cases + reasoning + code evolution**.
- **Adaptive difficulty:** Easy → Medium → Hard based on performance.
- **Question banks:** 5–10 challenges per category, randomly select. Difficulty + question selection are part of the assessment algorithm.
- **Branding for Layer 2:** "10 MINUTES. NO EXCUSES. WRITE CODE." (not "10 questions to test programmers").

### Categories + subtopic tree (question bank organization)
```
HTML: semantics, accessibility, forms, document structure, browser behavior, HTML5 APIs
CSS: layout, flexbox, grid, specificity, responsive design, positioning
JavaScript: fundamentals, async, closures, objects, arrays, DOM, debugging
C: pointers, memory, arrays, structs, algorithms
C++: STL, references, RAII, OOP, memory
Assembly: registers, stack, instructions, memory
React: state, props, effects, rendering, component design
Reasoning: logic, debugging, algorithms, systems thinking
General: real programming problem
```
Also used as test categories: Syntax, Debugging, Algorithm, Data Structures, System Design, Architecture, Frontend, Backend, Security, Performance.

---

## 5. SCORING MODEL

**No simple pass/fail (never "80% = pass"). Multidimensional Programmer Score:**

```
                 Programmer Score (0–100)
                        │
        ┌───────────────┼───────────────┐
        ↓               ↓               ↓
   Correctness     Problem Solving   Code Quality
       40%              35%              25%
```
- **Correctness (40):** passed tests, edge cases, output correctness
- **Problem Solving (35):** approach, reasoning, complexity, adaptation
- **Code Quality (25):** readability, no unnecessary complexity, maintainability

Example output:
```
PROGRAMMER SCORE 87 / 100
Correctness 94 | Problem Solving 86 | Code Quality 81
Difficulty: Medium   Time: 8m 42s
```
- **NEVER weight typing speed.** Measure `thinking → implementation → correctness`, not keyboard speed.
- Percentile framing everywhere: "Better than 71% of developers", "Top 8%".

### Viral-layer result card (keep brutally simple)
```
        87%
Top 12% of developers
HTML 94%  CSS 81%  JavaScript 88%
[ Challenge a friend → ]
```

---

## 6. INTEGRITY / ANTI-CHEAT (philosophy + engine)

**Principle: don't just evaluate the final code — evaluate how the code was produced.**

### DO NOT implement
Browser locking, fullscreen enforcement, Alt+Tab blocking, copy/paste blocking, devtools blocking, aggressive surveillance, auto-DQ from a single signal. No automatic monetary penalties for integrity (false-positive + auto-charge = bad failure mode).

### DO implement — coding-session event timeline
Events: test started, code typed/changed/pasted/copied/cut/deleted, code executed, test executed, compilation errors, runtime errors, tests passed/failed, tab hidden/visible, window blurred/focused, submission, assessment completed.
- Don't store raw keystrokes forever — store **meaningful events + code snapshots/diffs**; must be able to reconstruct the development timeline.
- Privacy-conscious. Telemetry is internal; never expose in public verification.

### Integrity risk heuristics (patterns to distinguish)
- **Organic (LOW risk):** type 40 chars → run → syntax error → modify → run → 2/5 pass → modify → run → all pass → submit
- **Suspicious (HIGH risk):** 45s no activity → paste 2,300 chars → run → all pass → submit

### Integrity levels (Layer 2 result)
`VERIFIED / LOW RISK` · `REVIEW REQUIRED` · `VIOLATION` (only confirmed violations trigger consequences)

### The real moat
**Forensic timeline of how a programmer solved the problem** → eventually a **Programming Behavior Fingerprint** = problem solving + code evolution + debugging behavior + typing behavior + clipboard behavior.

---

## 7. VERIFICATION SYSTEM (Layer 2 / future credential infra)

- Every completed assessment → unique immutable result ID, e.g. **`RP-8F29A1`**
- Public URL: **`/verify/RP-8F29A1`** — anyone can verify: Developer, Assessment, Date, Score, Skills, Integrity status, Assessment ID. **Do NOT expose private telemetry.**
- Public result card example:
```
Verified Developer Assessment
Sajid Hossain
Overall Score 87/100
Problem Solving 91 | Implementation 86 | Debugging 83
Integrity: Verified
Completed: September 6, 2026 — ID: RP-8F29A1
```

### GitHub integration (design now, MVP = foundation only)
- **OAuth only** — never passwords/personal access tokens. MVP: Connect GitHub → read basic public profile → associate with dev account → store username + profile URL → generate verification/profile URL. Future: README badge `[Verified Programmer — 87/100]` linking to `/verify/RP-XXXXXX`, profile/repo badges. Never modify repos without explicit authorization.

### LinkedIn integration (MVP = simple share)
- "Add to LinkedIn" button generating pre-written shareable result text:
```
I completed a verified 10-minute programming assessment.
Programmer Score: 87/100 | Problem Solving: 91 | Debugging: 83 | Integrity: Verified
Verify: https://…/verify/RP-8F29A1
```

---

## 8. LEADERBOARD

Global + competitive. Show rank, developer, score, top sub-score.
Filters: All / JavaScript / React / C / C++ / Frontend / Backend / Full Stack. Periods: Weekly / Monthly / All Time.
- Only **verified/completed** assessments appear.
- Percentile hooks: "Can you enter the Top 10%?" / "I ranked in the Top 8% of developers."
- Viral layer leaderboard example:
```
PLZWORK DEVELOPER LEADERBOARD
#1 Alex 98%  #2 Sarah 97%  #3 Rahim 96%  #4 Sajid 94%
```

---

## 9. QUESTION CONTENT BANK (captured verbatim from the conversation)

### 9a. Viral HTML challenge (LOCKED as first prototype: "HTML-A Semantic button")
- Prompt: **"Make this a proper accessible button."** Time: **30 seconds**. Points: 10.
- Given:
```html
<div class="button" onclick="submitForm()">
  Submit
</div>
```
- Obvious answer:
```html
<button type="button" onclick="submitForm()">
  Submit
</button>
```
- Rubric: uses `<button>` 4pts · correct interactive semantics 2pts · keyboard accessibility 2pts · doesn't add unnecessary JS/ARIA 2pts.
- Explanation to teach after: a `<div>` isn't a native interactive control; `<button>` gives keyboard interaction, semantics, focus behavior, accessibility for free. **Education makes the product useful rather than ragebait.**
- Integrity value: observe `reads → thinks → types → submits` vs `opens → waits → pastes → submits`.
- Ego hook after pass: "Too easy? Try Level 2." → after L2: "HTML isn't your problem. Try JavaScript."

### 9b. HTML question bank (build 5–10, random selection)
- **HTML-A** Semantic button (above)
- **HTML-B** Form behavior — given `<form><input type="email"><button>Submit</button></form>`: why does Enter submit the form; correctly associate the input with a label
- **HTML-C** Accessibility — fix `<img src="logo.png">` for an informative image (alt text)
- **HTML-D** Document structure — fix broken heading hierarchy
- **HTML-E** Form validation — email field with native browser validation
- **HTML-F** Links vs buttons — `<a href="#" onclick="openModal()">Open</a>`: when should it be a button
- **HTML-G** Table semantics — fix a poorly structured table
- **HTML-H** Label association — `<label>Email</label><input type="email">` → make association explicit (`for`/`id`)

### 9c. 10-Minute Programmer Test v1 (Q1–Q10) — all JS-flavored, auto-gradable
- **Q1 — Debug the Array** (Easy, 45s) `return items[items.length];` → what's wrong / fix. Concept: zero-based indexing. Tests debugging + attention.
- **Q2 — Predict the Output** (Easy, 45s) `[1,2,3,4].filter(n=>n%2===0).map(n=>n*2)` → MCQ: A.[2,4] B.[4,8] C.[1,3] D.[2,3,4]. **Answer B.** Tests comprehension.
- **Q3 — Find the Duplicate** (Medium, 1 min) implement `hasDuplicate(items)`; examples `[1,2,3]→false`, `[1,2,3,2]→true`, `["a","b","a"]→true`, `[]→false`. Ideal: `Set`. Tests data structures/iteration.
- **Q4 — Fix the Async Bug** (Medium, 1 min) `async getUser()` with `const response = fetch(...)` + `const data = response.json()` both missing `await` → fix so it returns parsed JSON. Tests promises/await/API knowledge.
- **Q5 — First Unique Character** (Medium, 1.5 min) `firstUniqueChar("swiss")→"w"`, `"aabbcc"→null`, `"leetcode"→"l"`, `""→null`. Ideal O(n) hash map. **One of the main scoring questions.**
- **Q6 — Fix the Mutation** (Medium, 1 min) `addUser(users,user)` uses `users.push(user)` → must return NEW array without mutating: `return [...users, user];`. Tests immutability (React relevance).
- **Q7 — Edge Case Hunter** (Medium, 1 min) `average(numbers)` = `reduce(...)/length` → identify invalid input (`[]` → NaN) + fix (`if (numbers.length === 0) return 0;` or justified alternative). Tests edge-case awareness.
- **Q8 — Complexity Test** (Medium, 45s) nested-loop `findCommon(a,b)` → MCQ O(1)/O(log n)/O(n)/O(n²). **Answer D.** Tests complexity awareness.
- **Q9 — Real-World API Problem** (Medium/Hard, 1 min) `loadUsers()` with `await fetch` + `return response.json()` → what happens on HTTP 500? Fix with `if (!response.ok) throw new Error("Failed to load users");`. Tests production mindset; separates syntax-knowers from app-builders.
- **Q10 — The Final Problem** (Hard, 2 min, most important) `totalByUser(transactions)` aggregating `[{userId, amount}]` → `{1:125,2:75,3:75}`. Hidden tests: `[]`, `[{userId:1,amount:0}]`, negative amounts, duplicate users, large arrays. Good solution O(n) time / O(k) space. Measures map/object usage, iteration, accumulation, edge cases, code organization, requirement comprehension.

### 9d. Original 3-question demo concept (pre-MVP brainstorms, useful for viral one-offs)
1. **The Debug Test:** `uniqueItems` filter that keeps duplicates due to an `indexOf`-vs-index comparison on a mutating array — spot the bug.
2. **The Real Coding Test:** implement `firstUniqueChar` (same as Q5).
3. **The Trap:** make `uniqueUsers` dedupe by `id` preserving order — then the hidden expectation: still O(n) with `Set` when input is 100,000 users.

### 9e. "AI Mode" experiment (future engagement layer)
Two scores: **HUMAN SCORE** (no AI) vs **AI-ASSISTED SCORE** (normal AI tools) → show **AI Dependency Gap**:
```
Without AI 82% | With AI 96% | AI Dependency Gap 14%
"AI improved your score by 14 points."
```
Aggregate stats become marketing content: "10,000 developers took the challenge. Average JavaScript score: 61%. Average AI-assisted score: 84%. 23% couldn't solve the HTML challenge without assistance."

---

## 10. VIRAL MARKETING PLAYBOOK

Headline candidates (initial campaign pick: **"AI Can Write Your Code. Can You?"**):
- Aggressive: "AI Can Write Your Code. Can You?"
- More viral: "Be Honest. Could You Pass This Without AI?"
- Developer-focused: "How Much of Your Coding Ability Is Actually Yours?"
- Challenge-oriented: "You Call Yourself a Developer. Prove It."
- Plzwork-style: "PLZWORK CHALLENGE: Prove You Can Code."

Hook = **AI-dependence anxiety** ("Could I still solve this without ChatGPT?"). First test must be **ridiculously simple to understand but surprisingly easy to get wrong**. Add "90% of developers get this wrong. You have 60 seconds."

Share copy: "I scored 86% on the Plzwork Developer Challenge. Can you beat me?" / "I ranked in the Top 8% of developers."
Psychological ladder: pass L1 → "Too easy? Try Level 2." → "HTML isn't your problem. Try JavaScript." → multi-category score card → "Your Developer Score: 86" → share.
Result pages always CTA back to **plzwork.app**.

---

## 11. FULL ASSESSMENT PLATFORM MVP (35-section prompt — architecture source of truth for Layer 2)

Core purpose: *Measure whether a developer can actually solve programming problems and produce code, while generating a verifiable developer assessment profile shareable with employers via GitHub, LinkedIn, portfolios, hiring systems.*

Primary flows: Landing → Google auth → Dev profile → Start assessment → Coding environment → 10-min assessment → Automated evaluation → Integrity analysis → Result/profile → Public verification page → Leaderboard → GitHub → LinkedIn → employer verification page.
UI refs: Linear / GitHub / Vercel / HackerRank / CodeSignal — but **significantly simpler**. Do NOT overdesign MVP.

**Engineering requirements:** production-quality TypeScript; strong typing; modular architecture; reusable services; clear DB relationships; validation; error handling; logging; tests for scoring/integrity logic; clean API boundaries.
**Separate layers:** UI · API · Domain logic · Assessment engine · Scoring engine · Integrity engine · Code execution · Integrations · Database. **No business logic inside React components.**

**Deliverable order:** architecture → DB schema → auth → assessment engine → question system → coding interface → code execution → scoring → event telemetry → integrity engine → result profile → verification page → leaderboard → GitHub foundation → LinkedIn sharing → admin question management.
Post-build docs: architecture explanation, DB schema, API docs, env vars, local setup, deployment, security considerations, known limitations, roadmap.

---

## 12. NON-GOALS / CONSTRAINTS (do not violate)

1. Do NOT rebuild/break the existing Plzwork (Quick Convert) app — reuse existing stack, design system, auth, DB, components, conventions.
2. No browser locking, fullscreen enforcement, or invasive surveillance in the viral layer.
3. No hardcoded challenge pages — reusable question engine.
4. No raw-keystroke storage; events + snapshots/diffs only.
5. No GitHub PAT/password collection — OAuth only.
6. No typing-speed-weighted scoring.
7. Don't reveal failed hidden test cases to candidates.
8. Don't pitch as "catch AI cheaters" — pitch the verification gap.
9. Don't launch the serious HR product first — ship the viral layer first.

---

## 13. OPEN DECISIONS (not settled in conversation)

- Code-execution backend for C/C++/Assembly (browser JS eval is trivial; C/C++ needs sandboxed server runners — undecided).
- Exact auth provider for MVP ("Google login" named; repo currently has no auth — Prisma schema exists in repo to extend).
- Prize/monetization mechanics — explicitly deferred.
- Level-2 gate (when/how the 10-min assessment unlocks from the viral layer).

---

## 14. FILE MAP (this workspace)

- `PLZWORK_CHALLENGE_MEMORY.md` ← this file (build spec)
- `conversation_messages_only.md` ← raw user/assistant transcript (83KB)
- `raw_conversation.md` ← full transcript incl. system messages