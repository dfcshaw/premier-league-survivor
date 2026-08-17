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

  const { data: member } = await supabase
    .from("league_members")
    .select("status")
    .eq("league_id", leagueId)
    .eq("user_id", user.id)
    .single();
  if (!member || member.status !== "alive") {
    redirect(`/leagues/${leagueId}?error=You%20are%20no%20longer%20alive%20in%20this%20league`);
  }

  // Kickoff check on the team being picked
  const { data: fixture } = await supabase
    .from("fixtures")
    .select("kickoff")
    .eq("gameweek", gameweek)
    .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
    .maybeSingle();

  if (!fixture) {
    redirect(`/leagues/${leagueId}?error=That%20team%20doesn%27t%20play%20this%20gameweek`);
  }
  if (new Date(fixture.kickoff).getTime() <= Date.now()) {
    redirect(`/leagues/${leagueId}?error=That%20match%20has%20already%20kicked%20off`);
  }

  // Kickoff check on existing pick — if they're already locked in, no swaps
  const { data: existing } = await supabase
    .from("picks")
    .select("team_id")
    .eq("league_id", leagueId)
    .eq("user_id", user.id)
    .eq("gameweek", gameweek)
    .maybeSingle();

  if (existing && existing.team_id !== teamId) {
    const { data: existingFixture } = await supabase
      .from("fixtures")
      .select("kickoff")
      .eq("gameweek", gameweek)
      .or(`home_team_id.eq.${existing.team_id},away_team_id.eq.${existing.team_id}`)
      .maybeSingle();
    if (existingFixture && new Date(existingFixture.kickoff).getTime() <= Date.now()) {
      redirect(`/leagues/${leagueId}?error=Your%20current%20pick%20has%20already%20kicked%20off`);
    }
  }

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
