import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getChallenge } from "@/challenge/questions";
import ChallengeClient from "./ChallengeClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const challenge = getChallenge(slug);
  return { title: challenge ? challenge.title : "Challenge" };
}

export default async function ChallengePlayPage({ params }: PageProps) {
  const { slug } = await params;
  const challenge = getChallenge(slug);
  if (!challenge) notFound();

  return <ChallengeClient challenge={challenge} />;
}