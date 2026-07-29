import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PickForm from "@/components/PickForm";
import MembersTable from "@/components/MembersTable";
import PastPicks from "@/components/PastPicks";

export default async function LeaguePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string; ok?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: league } = await supabase
    .from("leagues")
    .select("id, name, code, current_gameweek, owner_id, status")
    .eq("id", params.id)
    .maybeSingle();

  if (!league) notFound();

  const { data: me } = await supabase
    .from("league_members")
    .select("status, eliminated_gameweek")
    .eq("league_id", league.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!me) {
    redirect("/dashboard?error=You%20are%20not%20a%20member%20of%20that%20league");
  }

  // Members
  const { data: members } = await supabase
    .from("league_members")
    .select("user_id, status, eliminated_gameweek, profile:profiles(username)")
    .eq("league_id", league.id)
    .order("status", { ascending: true });

  // Teams reference
  const { data: teams } = await supabase
    .from("teams")
    .select("id, name, short_name")
    .order("name");

  // Picks the current user has already made in this league (used for "used teams" + history)
  const { data: myPicks } = await supabase
    .from("picks")
    .select("gameweek, team_id, result, team:teams(name, short_name)")
    .eq("league_id", league.id)
    .eq("user_id", user.id)
    .order("gameweek");

  // Current GW fixtures (for context)
  const { data: fixtures } = await supabase
    .from("fixtures")
    .select(
      "id, gameweek, kickoff, status, home_score, away_score, " +
        "home:home_team_id(name,short_name), away:away_team_id(name,short_name), " +
        "home_team_id, away_team_id"
    )
    .eq("gameweek", league.current_gameweek)
    .order("kickoff");

  const usedTeamIds = new Set((myPicks ?? []).map((p) => p.team_id));
  const myCurrentPick = (myPicks ?? []).find(
    (p) => p.gameweek === league.current_gameweek
  );

  const isOwner = league.owner_id === user.id;
  const aliveCount = (members ?? []).filter((m) => m.status === "alive").length;

  return (
    <section className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link href="/dashboard" className="text-sm text-white/60 hover:underline">
            ← All leagues
          </Link>
          <h1 className="text-3xl font-bold mt-1">{league.name}</h1>
          <p className="text-white/60 text-sm">
            Gameweek <strong>{league.current_gameweek}</strong> · {aliveCount}{" "}
            still alive · code{" "}
            <code className="text-pl-accent">{league.code}</code>
          </p>
        </div>
        {isOwner && (
          <form action={`/api/leagues/${league.id}/advance`} method="post">
            <button className="btn-ghost" type="submit">
              Score & advance gameweek
            </button>
          </form>
        )}
      </header>

      {searchParams.error && (
        <div className="card border-red-500/40 text-red-300 text-sm">
          {searchParams.error}
        </div>
      )}
      {searchParams.ok && (
        <div className="card border-pl-accent/40 text-pl-accent text-sm">
          Pick saved.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold">
              GW {league.current_gameweek} pick
            </h2>
            {me.status !== "alive" ? (
              <p className="mt-2 text-white/70 text-sm">
                You were eliminated in GW {me.eliminated_gameweek ?? "?"}.
                You can still watch how the league unfolds.
              </p>
            ) : league.status === "completed" ? (
              <p className="mt-2 text-white/70 text-sm">
                This league has finished.
              </p>
            ) : (
              <PickForm
                leagueId={league.id}
                gameweek={league.current_gameweek}
                teams={teams ?? []}
                usedTeamIds={[...usedTeamIds]}
                currentPickTeamId={myCurrentPick?.team_id ?? null}
              />
            )}
          </div>

          {fixtures && fixtures.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold">
                GW {league.current_gameweek} fixtures
              </h2>
              <ul className="mt-3 divide-y divide-white/10 text-sm">
                {fixtures.map((f: any) => (
                  <li key={f.id} className="flex items-center justify-between py-2">
                    <span>
                      {f.home?.name} <span className="text-white/40">vs</span>{" "}
                      {f.away?.name}
                    </span>
                    <span className="text-white/60 text-xs">
                      {f.status === "finished"
                        ? `${f.home_score}–${f.away_score}`
                        : f.kickoff
                        ? new Date(f.kickoff).toLocaleString()
                        : "TBD"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <PastPicks picks={(myPicks ?? []) as any} />
        </div>

        <MembersTable members={(members ?? []) as any} />
      </div>
    </section>
  );
}
