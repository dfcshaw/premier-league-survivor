"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function KickoffRefresher({ kickoffs }: { kickoffs: string[] }) {
  const router = useRouter();
  useEffect(() => {
    const nextKickoff = kickoffs
      .map((k) => new Date(k).getTime())
      .filter((t) => t > Date.now())
      .sort((a, b) => a - b)[0];
    if (!nextKickoff) return;
    const timer = setTimeout(() => router.refresh(), nextKickoff - Date.now() + 1000);
    return () => clearTimeout(timer);
  }, [kickoffs, router]);
  return null;
}
