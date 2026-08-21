import Link from "next/link";
import KickoffRefresher from "@/components/KickoffRefresher";
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

  const { data: members } = await supabase
    .from("league_members")
    .select("user_id, status, eliminated_gameweek, profile:profiles(username)")
    .eq("league_id", league.id)
    .order("status", { ascending: true });

  const { data: teams } = await supabase
    .from("teams")
    .select("id, name, short_name")
    .order("name");

  const { data: myPicks } = await supabase
    .from("picks")
    .select("gameweek, team_id, result, team:teams(name, short_name)")
    .eq("league_id", league.id)
    .eq("user_id", user.id)
    .order("gameweek");

  const { data: fixtures } = await supabase
    .from("fixtures")
    .select(
      "id, gameweek, kickoff, status, home_score, away_score, " +
           "home:home_team_id(name,short_name,crest_url), away:away_team_id(name,short_name,crest_url), " +
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

  // Teams whose GW match has already kicked off — can't be picked/changed
  const now = Date.now();
  const lockedTeamIds: number[] = [];
  (fixtures ?? []).forEach((f: any) => {
    if (f.kickoff && new Date(f.kickoff).getTime() <= now) {
      lockedTeamIds.push(f.home_team_id, f.away_team_id);
    }
  });
  const currentPickLocked =
    !!myCurrentPick && lockedTeamIds.includes(myCurrentPick.team_id);

  // ---- Real-time survivor computation (Feature 3) ----
  const { data: allCurrentPicks } = await supabase
    .from("picks")
    .select("user_id, team_id")
    .eq("league_id", league.id)
    .eq("gameweek", league.current_gameweek);

  const pickByUser = new Map<string, number>();
  (allCurrentPicks ?? []).forEach((p: any) =>
    pickByUser.set(p.user_id, p.team_id)
  );

  function resultForTeam(teamId: number): "win" | "draw" | "loss" | null {
    for (const f of (fixtures ?? []) as any[]) {
      if (f.status !== "finished") continue;
      if (f.home_team_id === teamId) {
        if (f.home_score > f.away_score) return "win";
        if (f.home_score === f.away_score) return "draw";
        return "loss";
      }
      if (f.away_team_id === teamId) {
        if (f.away_score > f.home_score) return "win";
        if (f.away_score === f.home_score) return "draw";
        return "loss";
      }
    }
    return null;
  }

  const allFixturesFinished =
    (fixtures ?? []).length > 0 &&
    (fixtures ?? []).every((f: any) => f.status === "finished");

  const provisionalMembers = (members ?? []).map((m: any) => {
    if (m.status !== "alive") {
      return { ...m, provisional: "eliminated" as const };
    }
    const teamId = pickByUser.get(m.user_id);
    if (!teamId) {
      return {
        ...m,
        provisional: (allFixturesFinished ? "eliminated" : "alive") as
          | "eliminated"
          | "alive",
        note: allFixturesFinished ? "no pick" : "no pick yet",
      };
    }
    const r = resultForTeam(teamId);
    if (r === null) return { ...m, provisional: "alive" as const, note: "pending" };
    if (r === "win") return { ...m, provisional: "alive" as const, note: "won" };
    return {
      ...m,
      provisional: "eliminated" as const,
      note: r === "draw" ? "drew" : "lost",
    };
  });

  const provisionalAliveCount = provisionalMembers.filter(
    (m: any) => m.provisional === "alive"
  ).length;	
  const picksPerTeam = new Map<number, number>();
  (allCurrentPicks ?? []).forEach((p: any) => {
    picksPerTeam.set(p.team_id, (picksPerTeam.get(p.team_id) ?? 0) + 1);
  });

  return (
    <section className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link href="/dashboard" className="text-sm text-pl-purple/60 hover:underline">
            ← All leagues
          </Link>
          <h1 className="text-3xl font-bold mt-1">{league.name}</h1>
          <p className="text-pl-purple/60 text-sm">
            Gameweek <strong>{league.current_gameweek}</strong> · {provisionalAliveCount}{" "}
            still alive · code{" "}
            <code className="text-pl-accent-text">{league.code}</code>
          </p>
<Link
  href={`/leagues/${league.id}/fixtures`}
  className="inline-block text-sm text-pl-accent-text hover:underline mt-2"
>
  View all fixtures →
</Link>
<Link
  href={`/leagues/${league.id}/records`}
  className="inline-block text-sm text-pl-accent-text hover:underline mt-2 ml-4"
>
  Pool history & records →
</Link>
        </div>
        {isOwner && (
          <form action={`/api/leagues/${league.id}/advance`} method="post">
            <button className="btn-ghost" type="submit">
              Score & advance gameweek
            </button>
          </form>
        )}
      </header>
	<KickoffRefresher
        kickoffs={(fixtures ?? []).map((f: any) => f.kickoff).filter(Boolean)}
      />

      {searchParams.error && (
        <div className="card border-red-500/40 text-red-700 text-sm">
          {searchParams.error}
        </div>
      )}
      {searchParams.ok && (
        <div className="card border-pl-accent/40 text-pl-accent-text text-sm">
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
              <p className="mt-2 text-pl-purple/70 text-sm">
                You were eliminated in GW {me.eliminated_gameweek ?? "?"}. You can still watch how the league unfolds.
              </p>
            ) : league.status === "completed" ? (
              <p className="mt-2 text-pl-purple/70 text-sm">
                This league has finished.
              </p>
            ) : (
              <PickForm
                leagueId={league.id}
                gameweek={league.current_gameweek}
                teams={teams ?? []}
                usedTeamIds={[...usedTeamIds]}
                lockedTeamIds={lockedTeamIds}
                currentPickTeamId={myCurrentPick?.team_id ?? null}
                currentPickLocked={currentPickLocked}
              />
            )}
          </div>

          {fixtures && fixtures.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold">
                GW {league.current_gameweek} fixtures
              </h2>
                            <ul className="mt-3 divide-y divide-pl-purple/10 text-sm">
                {fixtures.map((f: any) => {
                  const kickedOff =
                    f.kickoff && new Date(f.kickoff).getTime() <= Date.now();
                  const homeCount = picksPerTeam.get(f.home_team_id) ?? 0;
                  const awayCount = picksPerTeam.get(f.away_team_id) ?? 0;
                  return (
                    <li key={f.id} className="grid grid-cols-[1fr_220px] items-center py-2">
                      <div className="flex items-center justify-between">
                                                <span className="flex items-center gap-2">
                          {f.home?.crest_url && (
                            <img
                              src={f.home.crest_url}
                              alt=""
                              className="h-4 w-4 object-contain"
                            />
                          )}
                          <span>{f.home?.name}</span>
                          <span className="text-pl-purple/60 text-xs pl-8 whitespace-nowrap">
                          {f.away?.crest_url && (
                            <img
                              src={f.away.crest_url}
                              alt=""
                              className="h-4 w-4 object-contain"
                            />
                          )}
                          <span>{f.away?.name}</span>
                        </span>
                        <span className="text-pl-purple/60 text-xs text-right whitespace-nowrap">
                          {f.status === "finished"
                            ? `${f.home_score}–${f.away_score}`
                            : f.kickoff
                            ? new Date(f.kickoff).toLocaleString("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/New_York",
  timeZoneName: "short",
})
                            : "TBD"}
                        </span>
                      </div>
                      {kickedOff && (homeCount > 0 || awayCount > 0) && (
                        <div className="text-xs text-pl-purple/50 mt-1">
                          {homeCount} pick{homeCount !== 1 ? "s" : ""} for{" "}
                          {f.home?.short_name} · {awayCount} pick
                          {awayCount !== 1 ? "s" : ""} for {f.away?.short_name}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <PastPicks picks={(myPicks ?? []) as any} />
        </div>

          <MembersTable members={provisionalMembers as any} />
      </div>
    </section>
  );
}