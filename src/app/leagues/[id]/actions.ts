"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function makePick(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const leagueId = String(formData.get("league_id"));
  const gameweek = Number(formData.get("gameweek"));
  const teamId = Number(formData.get("team_id"));

  if (!leagueId || !gameweek || !teamId) {
    redirect(`/leagues/${leagueId}?error=Missing%20pick%20data`);
  }

  // Verify member is still alive
  const { data: member } = await supabase
    .from("league_members")
    .select("status")
    .eq("league_id", leagueId)
    .eq("user_id", user.id)
    .single();

  if (!member || member.status !== "alive") {
    redirect(`/leagues/${leagueId}?error=You%20are%20no%20longer%20alive%20in%20this%20league`);
  }

  // Upsert by (league_id, user_id, gameweek). If the user already picked a
  // different team this GW we update it. The (league_id,user_id,team_id)
  // unique constraint protects against picking the same team twice.
  const { error } = await supabase
    .from("picks")
    .upsert(
      {
        league_id: leagueId,
        user_id: user.id,
        gameweek,
        team_id: teamId,
        result: "pending",
      },
      { onConflict: "league_id,user_id,gameweek" }
    );

  if (error) {
    const msg = `${error.message}`.includes("picks_league_id_user_id_team_id_key")
      ? "You've already picked that team in this league"
      : error.message;
    redirect(`/leagues/${leagueId}?error=${encodeURIComponent(msg)}`);
  }

  revalidatePath(`/leagues/${leagueId}`);
  redirect(`/leagues/${leagueId}?ok=1`);
}
