"use server";

import { createClient } from "@/lib/supabase/server";
import { generateLeagueCode } from "@/lib/codes";
import { redirect } from "next/navigation";

export async function createLeague(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  if (!name) redirect("/leagues/new?error=Name%20required");

  // Try up to 5 codes to avoid collisions
  let leagueId: string | null = null;
  for (let attempt = 0; attempt < 5 && !leagueId; attempt++) {
    const code = generateLeagueCode();
    const { data, error } = await supabase
      .from("leagues")
      .insert({ name, code, owner_id: user.id })
      .select("id")
      .single();
    if (!error && data) {
      leagueId = data.id;
      break;
    }
    if (error && !`${error.message}`.includes("duplicate")) {
      redirect(`/leagues/new?error=${encodeURIComponent(error.message)}`);
    }
  }
  if (!leagueId) redirect("/leagues/new?error=Could%20not%20create%20league");

  // Owner auto-joins the league
  const { error: joinErr } = await supabase
    .from("league_members")
    .insert({ league_id: leagueId, user_id: user.id });
  if (joinErr) {
    redirect(`/leagues/new?error=${encodeURIComponent(joinErr.message)}`);
  }

  redirect(`/leagues/${leagueId}`);
}
