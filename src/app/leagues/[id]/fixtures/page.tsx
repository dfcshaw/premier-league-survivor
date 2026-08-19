import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function FixturesPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: league } = await supabase
    .from("leagues")
    .select("id, name, current_gameweek")
    .eq("id", params.id)
    .maybeSingle();
  if (!league) notFound();

  const { data: me } = await supabase
    .from("league_members")
    .select("user_id")
    .eq("league_id", league.id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!me) {
    redirect("/dashboard?error=You%20are%20not%20a%20member%20of%20that%20league");
  }

  const { data: fixtures } = await supabase
    .from("fixtures")
    .select(
      "id, gameweek, kickoff, status, home_score, away_score, " +
        "home:home_team_id(name,short_name), away:away_team_id(name,short_name)"
    )
    .order("gameweek")
    .order("kickoff");

  // Group by gameweek
  const byGw = new Map<number, any[]>();
  (fixtures ?? []).forEach((f: any) => {
    if (!byGw.has(f.gameweek)) byGw.set(f.gameweek, []);
    byGw.get(f.gameweek)!.push(f);
  });
  const sortedGws = Array.from(byGw.keys()).sort((a, b) => a - b);

  return (
    <section className="space-y-6">
      <header>
        <Link
          href={`/leagues/${league.id}`}
          className="text-sm text-white/60 hover:underline"
        >
          ← Back to league
        </Link>
        <h1 className="text-3xl font-bold mt-1">{league.name} — All fixtures</h1>
        <p className="text-white/60 text-sm">
          Currently on Gameweek {league.current_gameweek}. Plan ahead.
        </p>
      </header>

      {sortedGws.length === 0 && (
        <p className="text-white/60">No fixtures scheduled yet.</p>
      )}

      {sortedGws.map((gw) => (
        <div key={gw} className="card">
          <h2 className="text-lg font-semibold">
            Gameweek {gw}
            {gw === league.current_gameweek && (
              <span className="ml-2 text-xs text-pl-accent">current</span>
            )}
          </h2>
          <ul className="mt-3 divide-y divide-white/10 text-sm">
            {byGw.get(gw)!.map((f: any) => (
              <li key={f.id} className="flex items-center justify-between py-2">
                <span>
                  {f.home?.name}{" "}
                  <span className="text-white/40">vs</span> {f.away?.name}
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
      ))}
    </section>
  );
}