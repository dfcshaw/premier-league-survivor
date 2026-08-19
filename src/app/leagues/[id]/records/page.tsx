import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const PAST_WINNERS = [
  { season: "23/24", winners: ["Aaron Schoenfeld", "Paul Garlick"] },
  { season: "24/25", winners: ["Justin Baker", "Dylan Castanheira"] },
  { season: "25/26", winners: ["Alex Don", "Simon Weis"] },
];

const RECORDS = [
  { label: "Biggest Prize", value: "$335", context: "25/26 Round 1" },
  { label: "Longest Run", value: "17 weeks", context: "25/26 Round 1" },
  { label: "Shortest Run", value: "6 weeks", context: "24/25 Round 2" },
];

export default async function RecordsPage({
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
    .select("id, name")
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

  return (
    <section className="space-y-6">
      <header>
        <Link
          href={`/leagues/${league.id}`}
          className="text-sm text-pl-purple/60 hover:underline"
        >
          ← Back to league
        </Link>
        <h1 className="text-3xl font-bold mt-1">Survivor Pool History</h1>
        <p className="text-pl-purple/60 text-sm">
          All-time records and past champions.
        </p>
      </header>

      <div className="card">
        <h2 className="text-lg font-semibold">Past winners</h2>
        <ul className="mt-4 space-y-3">
          {PAST_WINNERS.map((w) => (
            <li key={w.season} className="flex items-baseline gap-4">
              <span className="text-2xl font-bold text-pl-purple w-20">
                {w.season}
              </span>
              <span className="text-pl-purple">{w.winners.join(" · ")}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold">Records</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-3">
          {RECORDS.map((r) => (
            <li
              key={r.label}
              className="rounded-lg border border-pl-purple/10 bg-pl-bg p-4"
            >
              <div className="text-xs uppercase tracking-wider text-pl-purple/60">
                {r.label}
              </div>
              <div className="mt-1 text-2xl font-bold text-pl-accent-text">
                {r.value}
              </div>
              <div className="text-xs text-pl-purple/60 mt-1">{r.context}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}