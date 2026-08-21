import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function HistoryPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
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
  if (!me) redirect("/dashboard?error=You%20are%20not%20a%20member%20of%20that%20league");

  const { data: picks } = await supabase
    .from("picks")
    .select("gameweek, result, user_id, team:teams(name, short_name, crest_url)")
    .eq("league_id", league.id)
    .lt("gameweek", league.current_gameweek)
    .order("gameweek", { ascending: false });

  const { data: members } = await supabase
    .from("league_members")
    .select("user_id, status, profile:profiles(username)")
    .eq("league_id", league.id);

  const memberByUser = new Map<string, any>();
  (members ?? []).forEach((m: any) => memberByUser.set(m.user_id, m));

  const byGw = new Map<number, any[]>();
  (picks ?? []).forEach((p: any) => {
    if (!byGw.has(p.gameweek)) byGw.set(p.gameweek, []);
    byGw.get(p.gameweek)!.push(p);
  });
  const sortedGws = Array.from(byGw.keys()).sort((a, b) => b - a);

  const resultBadge = (result: string) => {
    const styles: Record<string, string> = {
      win: "bg-pl-accent/20 text-pl-accent-text",
      draw: "bg-yellow-400/20 text-yellow-700",
      loss: "bg-red-500/20 text-red-700",
      pending: "bg-pl-purple/10 text-pl-purple/50",
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${styles[result] ?? styles.pending}`}>
        {result}
      </span>
    );
  };

  return (
    <section className="space-y-6">
      <header>
        <Link href={`/leagues/${league.id}`} className="text-sm text-pl-purple/60 hover:underline">
          ← Back to league
        </Link>
        <h1 className="text-3xl font-bold mt-1">Pick History</h1>
        <p className="text-pl-purple/60 text-sm">
          All picks from past gameweeks, split by who&apos;s still alive.
        </p>
      </header>

      {sortedGws.length === 0 && (
        <div className="card">
          <p className="text-pl-purple/60 text-sm">
            No completed gameweeks yet. Come back after this week wraps.
          </p>
        </div>
      )}

      {sortedGws.map((gw) => {
        const gwPicks = byGw.get(gw)!;
        const alivePicks = gwPicks.filter(
          (p) => memberByUser.get(p.user_id)?.status === "alive"
        );
        const eliminatedPicks = gwPicks.filter(
          (p) => memberByUser.get(p.user_id)?.status !== "alive"
        );

        return (
          <div key={gw} className="card">
            <h2 className="text-lg font-semibold">Gameweek {gw}</h2>

            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-xs uppercase tracking-wider text-pl-purple/60 mb-2">
                  Still alive ({alivePicks.length})
                </h3>
                <ul className="space-y-2 text-sm">
                  {alivePicks.map((p, i) => {
                    const m = memberByUser.get(p.user_id);
                    return (
                      <li key={i} className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2 min-w-0">
                          {p.team?.crest_url && (
                            <img src={p.team.crest_url} alt="" className="h-4 w-4 object-contain shrink-0" />
                          )}
                          <span className="text-pl-purple">
                            {m?.profile?.username ?? "Player"}
                          </span>
                          <span className="text-pl-purple/60 text-xs">
                            picked {p.team?.short_name}
                          </span>
                        </span>
                        {resultBadge(p.result)}
                      </li>
                    );
                  })}
                  {alivePicks.length === 0 && (
                    <li className="text-pl-purple/40 text-xs">No survivors picked this week.</li>
                  )}
                </ul>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-wider text-pl-purple/60 mb-2">
                  Eliminated ({eliminatedPicks.length})
                </h3>
                <ul className="space-y-2 text-sm">
                  {eliminatedPicks.map((p, i) => {
                    const m = memberByUser.get(p.user_id);
                    return (
                      <li key={i} className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2 min-w-0">
                          {p.team?.crest_url && (
                            <img src={p.team.crest_url} alt="" className="h-4 w-4 object-contain shrink-0" />
                          )}
                          <span className="text-pl-purple/70 line-through">
                            {m?.profile?.username ?? "Player"}
                          </span>
                          <span className="text-pl-purple/60 text-xs">
                            picked {p.team?.short_name}
                          </span>
                        </span>
                        {resultBadge(p.result)}
                      </li>
                    );
                  })}
                  {eliminatedPicks.length === 0 && (
                    <li className="text-pl-purple/40 text-xs">No eliminated players picked this week.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}