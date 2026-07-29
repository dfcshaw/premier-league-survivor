import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type LeagueRow = {
  id: string;
  name: string;
  code: string;
  current_gameweek: number;
  status: string;
  member_status: string;
  member_count: number;
};

export default async function Dashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  // Leagues this user belongs to
  const { data: memberships } = await supabase
    .from("league_members")
    .select(
      "status, league:leagues(id, name, code, current_gameweek, status)"
    )
    .eq("user_id", user.id);

  // We also count members per league
  const leagueIds = (memberships ?? [])
    .map((m: any) => m.league?.id)
    .filter(Boolean);
  let countsByLeague: Record<string, number> = {};
  if (leagueIds.length) {
    const { data: counts } = await supabase
      .from("league_members")
      .select("league_id")
      .in("league_id", leagueIds);
    countsByLeague = (counts ?? []).reduce<Record<string, number>>(
      (acc, row: any) => {
        acc[row.league_id] = (acc[row.league_id] ?? 0) + 1;
        return acc;
      },
      {}
    );
  }

  const rows: LeagueRow[] = (memberships ?? [])
    .filter((m: any) => m.league)
    .map((m: any) => ({
      id: m.league.id,
      name: m.league.name,
      code: m.league.code,
      current_gameweek: m.league.current_gameweek,
      status: m.league.status,
      member_status: m.status,
      member_count: countsByLeague[m.league.id] ?? 1,
    }));

  return (
    <section className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome{profile?.username ? `, ${profile.username}` : ""}.
          </h1>
          <p className="text-white/70 text-sm">Pick wisely. Pick once.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/leagues/new" className="btn">New league</Link>
          <Link href="/leagues/join" className="btn-ghost">Join with code</Link>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Your leagues</h2>
        {rows.length === 0 ? (
          <div className="card text-white/70">
            You&apos;re not in any leagues yet. Create one and share the code,
            or join one with a friend&apos;s code.
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {rows.map((l) => (
              <li key={l.id}>
                <Link href={`/leagues/${l.id}`} className="card block hover:border-pl-accent transition">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{l.name}</span>
                    <span
                      className={
                        "text-xs px-2 py-0.5 rounded-full " +
                        (l.member_status === "alive"
                          ? "bg-pl-accent/20 text-pl-accent"
                          : "bg-red-500/20 text-red-300")
                      }
                    >
                      {l.member_status}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-white/60">
                    GW {l.current_gameweek} · {l.member_count} player
                    {l.member_count === 1 ? "" : "s"} · code{" "}
                    <code className="text-pl-accent">{l.code}</code>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
