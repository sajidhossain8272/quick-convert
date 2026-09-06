"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface LastResult {
  id: string;
  percent: number;
  slug: string;
}

/** Shows "your last attempt" chip if the visitor played before (localStorage). */
export default function LandingRecent() {
  const [last, setLast] = useState<LastResult | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("pc_last_result");
      if (raw) setLast(JSON.parse(raw) as LastResult);
    } catch {
      // ignore
    }
  }, []);

  if (!last) return null;

  return (
    <div className="mt-6">
      <Link
        href={`/challenge/result/${last.id}`}
        className="inline-flex items-center gap-2 rounded-full border border-[#d6ded2] bg-white px-4 py-2 text-xs font-semibold text-[#30404a] shadow-2xs transition hover:border-[#9fb89d]"
      >
        <span className="h-2 w-2 rounded-full bg-[#42b719]" />
        Your last attempt: {last.percent}% — view result
      </Link>
    </div>
  );
}