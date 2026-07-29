"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function joinLeague(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  if (!code) redirect("/leagues/join?error=Code%20required");

  // SECURITY DEFINER RPC: lookup-and-join in one shot, bypassing RLS
  const { data: leagueId, error } = await supabase.rpc("join_league_by_code", {
    _code: code,
  });

  if (error || !leagueId) {
    const msg = error?.message ?? "No league with that code";
    redirect(`/leagues/join?error=${encodeURIComponent(msg)}`);
  }

  redirect(`/leagues/${leagueId}`);
}
