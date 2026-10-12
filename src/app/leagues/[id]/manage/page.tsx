import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { togglePayment } from "./actions";

export default async function ManagePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: league } = await supabase
    .from("leagues")
    .select("id, name, owner_id")
    .eq("id", params.id)
    .maybeSingle();
  if (!league) notFound();
  if (league.owner_id !== user.id) {
    redirect(`/leagues/${params.id}?error=Only%20the%20owner%20can%20manage`);
  }

  const { data: members } = await supabase
    .from("league_members")
    .select("user_id, has_paid, profile:profiles(username, name_confirmed)")
    .eq("league_id", league.id);

  const sorted = (members ?? []).sort((a: any, b: any) =>
    (a.profile?.username ?? "").localeCompare(b.profile?.username ?? "")
  );

  return (
    <section className="space-y-6">
      <header>
        <Link href={`/leagues/${league.id}`} className="text-sm text-pl-purple/60 hover:underline">
          ← Back to league
        </Link>
        <h1 className="text-3xl font-bold mt-1">Manage {league.name}</h1>
        <p className="text-pl-purple/60 text-sm">
          Toggle who has paid for this round.
        </p>
      </header>

      <div className="card">
        <ul className="divide-y divide-pl-purple/10">
          {sorted.map((m: any) => (
            <li key={m.user_id} className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium">
                  {m.profile?.username ?? "Player"}
                </div>
                {!m.profile?.name_confirmed && (
                  <div className="text-xs text-pl-purple/50">
                    Hasn&apos;t updated name
                  </div>
                )}
              </div>
              <form action={togglePayment} className="flex items-center gap-2">
                <input type="hidden" name="league_id" value={league.id} />
                <input type="hidden" name="member_id" value={m.user_id} />
                <input type="hidden" name="paid" value={m.has_paid ? "false" : "true"} />
                <button
                  type="submit"
                  className={
                    "px-3 py-1 rounded text-xs font-semibold " +
                    (m.has_paid
                      ? "bg-pl-accent/20 text-pl-accent-text"
                      : "bg-pl-purple/10 text-pl-purple/70")
                  }
                >
                  {m.has_paid ? "✓ Paid" : "Mark paid"}
                </button>
              </form>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}