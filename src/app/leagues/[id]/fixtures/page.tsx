import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function FixturesPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { gw?: string };
}) {
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

  const { data: gwRows } = await supabase
    .from("fixtures")
    .select("gameweek")
    .order("gameweek");
  const allGws = Array.from(new Set((gwRows ?? []).map((r: any) => r.gameweek))).sort((a, b) => a - b);

  const requested = Number(searchParams.gw);
  const selectedGw = allGws.includes(requested) ? requested : league.current_gameweek;

  const idx = allGws.indexOf(selectedGw);
  const prevGw = idx > 0 ? allGws[idx - 1] : null;
  const nextGw = idx >= 0 && idx < allGws.length - 1 ? allGws[idx + 1] : null;

  const { data: fixtures } = await supabase
    .from("fixtures")
    .select(
      "id, gameweek, kickoff, status, home_score, away_score, " +
      "home:home_team_id(name,short_name,crest_url), away:away_team_id(name,short_name,crest_url)"
    )
    .eq("gameweek", selectedGw)
    .order("kickoff");

  return (
    <section className="space-y-6">
      <header>
        <Link href={`/leagues/${league.id}`} className="text-sm text-pl-purple/60 hover:underline">
          ← Back to league
        </Link>
        <h1 className="text-3xl font-bold mt-1">{league.name} — Fixtures</h1>
        <p className="text-pl-purple/60 text-sm">Currently on Gameweek {league.current_gameweek}.</p>
      </header>

      <div className="flex gap-1 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {allGws.map((gw) => {
          const isSelected = gw === selectedGw;
          const isCurrent = gw === league.current_gameweek;
          return (
            <Link
              key={gw}
              href={`/leagues/${league.id}/fixtures?gw=${gw}`}
              className={
                "shrink-0 rounded-md border px-3 py-1.5 text-sm transition " +
                (isSelected
                  ? "border-pl-accent bg-pl-accent/10 text-pl-accent-text"
                  : isCurrent
                  ? "border-pl-purple/30 bg-pl-purple/10 text-pl-purple"
                  : "border-pl-purple/15 bg-pl-purple/5 text-pl-purple/70 hover:border-pl-purple/30")
              }
              scroll={false}
            >
              GW {gw}
              {isCurrent && <span className="ml-1 text-[10px] uppercase opacity-70">now</span>}
            </Link>
          );
        })}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold">Gameweek {selectedGw}</h2>
        {(!fixtures || fixtures.length === 0) && (
          <p className="mt-3 text-sm text-pl-purple/60">No fixtures scheduled for this gameweek.</p>
        )}
        {fixtures && fixtures.length > 0 && (
          <ul className="mt-3 divide-y divide-pl-purple/10 text-sm">
            {fixtures.map((f: any) => (
              <li key={f.id} className="flex items-center justify-between py-2">
                <span className="flex items-center gap-2">
                  {f.home?.crest_url && <img src={f.home.crest_url} alt="" className="h-4 w-4 object-contain" />}
                  <span>{f.home?.name}</span>
                  <span className="text-pl-purple/40">vs</span>
                  {f.away?.crest_url && <img src={f.away.crest_url} alt="" className="h-4 w-4 object-contain" />}
                  <span>{f.away?.name}</span>
                </span>
                <span className="text-pl-purple/60 text-xs whitespace-nowrap">
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
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center justify-between">
        {prevGw !== null ? (
          <Link href={`/leagues/${league.id}/fixtures?gw=${prevGw}`} className="btn-ghost" scroll={false}>
            ← GW {prevGw}
          </Link>
        ) : (
          <span />
        )}
        {nextGw !== null ? (
          <Link href={`/leagues/${league.id}/fixtures?gw=${nextGw}`} className="btn-ghost" scroll={false}>
            GW {nextGw} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </section>
  );
}