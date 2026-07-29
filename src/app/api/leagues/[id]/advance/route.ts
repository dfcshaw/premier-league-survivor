import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { resultForTeam, survivesStandardRule } from "@/lib/survivor";

/**
 * POST /api/leagues/[id]/advance
 *
 * League-owner action. For the league's current gameweek:
 *   1. Score every member's pick against finished fixtures.
 *   2. Eliminate members whose team drew, lost, or who didn't pick.
 *   3. Advance the league's current_gameweek by 1 (or mark completed).
 *
 * For MVP, fixture results live in the `fixtures` table and are entered
 * manually (by the owner via Supabase Studio) or by the optional cron
 * that pulls from an external API.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login", _req.url), { status: 303 });
  }

  const { data: league, error: lErr } = await supabase
    .from("leagues")
    .select("id, owner_id, current_gameweek, status")
    .eq("id", params.id)
    .single();

  if (lErr || !league) {
    return NextResponse.json({ error: "League not found" }, { status: 404 });
  }
  if (league.owner_id !== user.id) {
    return NextResponse.json({ error: "Only the owner can advance" }, { status: 403 });
  }
  if (league.status === "completed") {
    return NextResponse.redirect(new URL(`/leagues/${league.id}?error=Already%20completed`, _req.url), { status: 303 });
  }

  const gw = league.current_gameweek;

  // Pull fixtures for this gameweek
  const { data: fixtures } = await supabase
    .from("fixtures")
    .select("home_team_id, away_team_id, home_score, away_score, status")
    .eq("gameweek", gw);

  if (!fixtures || fixtures.length === 0) {
    return NextResponse.redirect(
      new URL(`/leagues/${league.id}?error=No%20fixtures%20found%20for%20GW%20${gw}`, _req.url),
      { status: 303 }
    );
  }

  // Pull alive members
  const { data: members } = await supabase
    .from("league_members")
    .select("user_id")
    .eq("league_id", league.id)
    .eq("status", "alive");

  // Pull picks for this gameweek
  const { data: picks } = await supabase
    .from("picks")
    .select("user_id, team_id")
    .eq("league_id", league.id)
    .eq("gameweek", gw);

  const pickByUser = new Map<string, number>();
  (picks ?? []).forEach((p: any) => pickByUser.set(p.user_id, p.team_id));

  const eliminatedUserIds: string[] = [];
  const pickUpdates: { user_id: string; team_id: number; result: "win" | "draw" | "loss" }[] = [];

  for (const m of members ?? []) {
    const teamId = pickByUser.get(m.user_id);
    if (!teamId) {
      // No pick made → eliminated
      eliminatedUserIds.push(m.user_id);
      continue;
    }
    const r = resultForTeam(teamId, fixtures as any);
    if (r === null) {
      // Fixture not finished yet — refuse to score
      return NextResponse.redirect(
        new URL(`/leagues/${league.id}?error=Some%20GW%20${gw}%20matches%20aren%27t%20finished%20yet`, _req.url),
        { status: 303 }
      );
    }
    pickUpdates.push({ user_id: m.user_id, team_id: teamId, result: r });
    if (!survivesStandardRule(r)) {
      eliminatedUserIds.push(m.user_id);
    }
  }

  // Persist pick results
  for (const u of pickUpdates) {
    await supabase
      .from("picks")
      .update({ result: u.result })
      .eq("league_id", league.id)
      .eq("user_id", u.user_id)
      .eq("gameweek", gw);
  }

  // Eliminate losers/drawers/non-pickers
  if (eliminatedUserIds.length) {
    await supabase
      .from("league_members")
      .update({ status: "eliminated", eliminated_gameweek: gw })
      .eq("league_id", league.id)
      .in("user_id", eliminatedUserIds);
  }

  // Re-check survivors to decide league status
  const { data: stillAlive } = await supabase
    .from("league_members")
    .select("user_id")
    .eq("league_id", league.id)
    .eq("status", "alive");

  const aliveCount = stillAlive?.length ?? 0;

  if (aliveCount <= 1) {
    await supabase
      .from("leagues")
      .update({ status: "completed", current_gameweek: gw })
      .eq("id", league.id);
  } else {
    await supabase
      .from("leagues")
      .update({ current_gameweek: gw + 1 })
      .eq("id", league.id);
  }

  return NextResponse.redirect(
    new URL(`/leagues/${league.id}?ok=1`, _req.url),
    { status: 303 }
  );
}
