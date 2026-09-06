// Plzwork Challenge — public question metadata.
// This module is safe to import from client components: it contains no answers,
// rubrics or hidden tests. Server-side evaluation config lives in evaluation.ts.

export type ChallengeCategory =
  | "HTML"
  | "CSS"
  | "JavaScript"
  | "Logic"
  | "React"
  | "C"
  | "C++"
  | "Assembly";

export type ChallengeDifficulty = "easy" | "medium" | "hard";
export type ChallengeKind = "code" | "mcq";

export interface ChallengeOption {
  id: string;
  label: string;
}

export interface ChallengeMeta {
  slug: string;
  title: string;
  category: ChallengeCategory;
  kind: ChallengeKind;
  difficulty: ChallengeDifficulty;
  timeLimitSec: number;
  maxPoints: number;
  prompt: string;
  explanation: string;
  starterCode?: string;
  options?: ChallengeOption[];
}

export const CHALLENGES: ChallengeMeta[] = [
  {
    slug: "html-semantic-button",
    title: "Semantic Button",
    category: "HTML",
    kind: "code",
    difficulty: "easy",
    timeLimitSec: 30,
    maxPoints: 10,
    prompt:
      "This \"button\" is a fraud — it is a styled <div>. Turn it into a proper, accessible button without losing the click handler.",
    explanation:
      "A <div> is not a native interactive control. <button> gives you keyboard interaction, semantic meaning, focus behavior and accessibility support for free — no ARIA role hacks or manual key handlers needed. type=\"button\" prevents accidental form submission.",
    starterCode: `<div class="button" onclick="submitForm()">
  Submit
</div>`,
  },
  {
    slug: "html-image-alt",
    title: "Invisible Image",
    category: "HTML",
    kind: "code",
    difficulty: "easy",
    timeLimitSec: 45,
    maxPoints: 10,
    prompt:
      "Screen reader users hear nothing for this logo. Make the image accessible as an informative image.",
    explanation:
      "Informative images need a meaningful alt that describes the content — not the file name and not a generic word like \"image\". Decorative images should use an empty alt (\"\") instead of being hidden with aria-hidden.",
    starterCode: `<img src="logo.png">`,
  },
  {
    slug: "html-label-association",
    title: "Label the Field",
    category: "HTML",
    kind: "code",
    difficulty: "medium",
    timeLimitSec: 60,
    maxPoints: 10,
    prompt:
      "This label and input are only next to each other. Associate them explicitly so screen readers announce the field correctly.",
    explanation:
      "Clicking a <label> only focuses its input when they are programmatically associated. Use for=\"email\" on the label and id=\"email\" on the input (or wrap the input inside the label).",
    starterCode: `<label>Email</label>
<input type="email">`,
  },
  {
    slug: "html-links-vs-buttons",
    title: "Links vs Buttons",
    category: "HTML",
    kind: "code",
    difficulty: "medium",
    timeLimitSec: 45,
    maxPoints: 10,
    prompt:
      "This opens a modal — it is an action, not navigation. Use the right element without losing the behavior.",
    explanation:
      "<a> is for navigation; <button> is for actions. href=\"#\" pollutes the URL history and is announced as a link to screen readers. Use <button> (type=\"button\") for in-page actions.",
    starterCode: `<a href="#" onclick="openModal()">Open</a>`,
  },
  {
    slug: "css-flexbox-center",
    title: "Perfectly Centered",
    category: "CSS",
    kind: "code",
    difficulty: "medium",
    timeLimitSec: 60,
    maxPoints: 10,
    prompt:
      "Center the box horizontally AND vertically inside .container using flexbox.",
    explanation:
      "display: flex on the parent, justify-content: center for the main axis and align-items: center for the cross axis — the canonical two-axis centering recipe.",
    starterCode: `<style>
  .container {
    width: 100%;
    height: 200px;
    border: 2px dashed #dde4da;
  }
  .box {
    width: 120px;
    padding: 16px;
    background: #0e171d;
    color: #ffffff;
    text-align: center;
  }
</style>

<div class="container">
  <div class="box">Center me</div>
</div>`,
  },
  {
    slug: "js-find-duplicate",
    title: "Find the Duplicate",
    category: "JavaScript",
    kind: "code",
    difficulty: "medium",
    timeLimitSec: 60,
    maxPoints: 10,
    prompt:
      "Implement hasDuplicate(items) — return true if any value appears more than once, otherwise false. Hidden test cases check edge cases.",
    explanation:
      "A Set tracks seen values in O(n): new Set(items).size !== items.length. Nested loops also work but cost O(n²).",
    starterCode: `function hasDuplicate(items) {
  // your code
}`,
  },
  {
    slug: "js-first-unique-char",
    title: "First Unique Character",
    category: "JavaScript",
    kind: "code",
    difficulty: "hard",
    timeLimitSec: 90,
    maxPoints: 10,
    prompt:
      "Implement firstUniqueChar(str) — return the first character that appears exactly once, or null if there is none. Aim for O(n).",
    explanation:
      "Two passes: count occurrences in a Map, then walk the string again and return the first character with count 1. O(n) time, O(k) space.",
    starterCode: `function firstUniqueChar(str) {
  // your code
}`,
  },
  {
    slug: "logic-predict-output",
    title: "Predict the Output",
    category: "Logic",
    kind: "mcq",
    difficulty: "easy",
    timeLimitSec: 45,
    maxPoints: 10,
    prompt: "No running this one — predict the output.",
    explanation:
      "filter keeps the even numbers [2, 4], then map doubles them → [4, 8]. Chained array methods evaluate left to right.",
    options: [
      { id: "A", label: "[2, 4]" },
      { id: "B", label: "[4, 8]" },
      { id: "C", label: "[1, 3]" },
      { id: "D", label: "[2, 3, 4]" },
    ],
  },
];

export function getChallenge(slug: string): ChallengeMeta | undefined {
  return CHALLENGES.find((c) => c.slug === slug);
}

export function challengesByCategory(category: ChallengeCategory): ChallengeMeta[] {
  return CHALLENGES.filter((c) => c.category === category);
}

/** Categories that have playable challenges today. */
export const ACTIVE_CATEGORIES: ChallengeCategory[] = ["HTML", "CSS", "JavaScript", "Logic"];

/** Categories announced on the landing page but not playable yet. */
export const UPCOMING_CATEGORIES: ChallengeCategory[] = ["React", "C", "C++", "Assembly"];