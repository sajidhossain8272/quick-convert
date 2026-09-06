"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Linkedin, Twitter } from "lucide-react";

export default function ShareButtons({
  resultId,
  percent,
  challengeTitle,
}: {
  resultId: string;
  percent: number;
  challengeTitle: string;
}) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(`${window.location.origin}/challenge/result/${resultId}`);
  }, [resultId]);

  const shareText = `I scored ${percent}% on the Plzwork Developer Challenge (${challengeTitle}). Can you beat me?`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={copy}
        className="flex items-center gap-2 rounded-xl border border-[#cfd7cf] bg-white px-4 py-2.5 text-sm font-semibold text-[#142027] shadow-2xs transition hover:border-[#9fb89d]"
      >
        {copied ? (
          <Check className="h-4 w-4 text-[#42b719]" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
        {copied ? "Link copied!" : "Copy link"}
      </button>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}${
          url ? `&url=${encodeURIComponent(url)}` : ""
        }`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-xl border border-[#cfd7cf] bg-white px-4 py-2.5 text-sm font-semibold text-[#142027] shadow-2xs transition hover:border-[#9fb89d]"
      >
        <Twitter className="h-4 w-4 text-[#1DA1F2]" />
        Share on X
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-xl border border-[#cfd7cf] bg-white px-4 py-2.5 text-sm font-semibold text-[#142027] shadow-2xs transition hover:border-[#9fb89d]"
      >
        <Linkedin className="h-4 w-4 text-[#0A66C2]" />
        LinkedIn
      </a>
    </div>
  );
}