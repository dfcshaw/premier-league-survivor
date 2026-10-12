import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { updateUsername, updateEmail, updateFavoriteClub, requestPasswordReset } from "./actions";

export default async function EditProfilePage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string; redirect_to?: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, name_confirmed")
    .eq("id", user.id)
    .maybeSingle();

  const emailConfirmed = !!user.email_confirmed_at;

  const { data: allClubs } = await supabase
    .from("teams")
    .select("id, name, tier")
    .order("tier")
    .order("name");

  const { data: fullProfile } = await supabase
    .from("profiles")
    .select("favorite_club_id")
    .eq("id", user.id)
    .maybeSingle();

  const clubsByTier: Record<string, any[]> = {};
  (allClubs ?? []).forEach((c: any) => {
    const t = c.tier || "Other";
    if (!clubsByTier[t]) clubsByTier[t] = [];
    clubsByTier[t].push(c);
  });
  const tierOrder = ["PL", "EFL"];

  return (
    <section className="max-w-md mx-auto space-y-6">
      <header>
        <Link href="/dashboard" className="text-sm text-pl-purple/60 hover:underline">
          ← Back
        </Link>
        <h1 className="text-3xl font-bold mt-1">Edit your name</h1>
        <p className="text-pl-purple/60 text-sm mt-2">
          Use your real name — it helps everyone recognize who&apos;s who.
        </p>
      </header>

      {searchParams.error && (
        <div className="card border-red-500/40 text-red-700 text-sm">
          {searchParams.error}
        </div>
      )}
      {searchParams.message && (
        <div className="card border-pl-accent/40 text-pl-accent-text text-sm">
          {searchParams.message}
        </div>
      )}

      <form action={updateUsername} className="card space-y-4">
        <input
          type="hidden"
          name="redirect_to"
          value={searchParams.redirect_to ?? "/dashboard"}
        />
        <div>
          <label className="label" htmlFor="username">Full name</label>
          <input
            id="username"
            name="username"
            className="input"
            defaultValue={profile?.username ?? ""}
            placeholder="Jane Smith"
            required
            minLength={2}
          />
        </div>
        <button className="btn" type="submit">Save</button>
      </form>
            <form action={updateEmail} className="card space-y-4">
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className="input"
            defaultValue={user.email ?? ""}
            required
          />
          <p className="mt-2 text-xs text-pl-purple/60">
            Status:{" "}
            {emailConfirmed ? (
              <span className="text-pl-accent-text">verified ✓</span>
            ) : (
              <span className="text-red-700">not verified — picks blocked</span>
            )}
          </p>
        </div>
        <button className="btn" type="submit">
          Update email
        </button>
      </form>
      <form action={updateFavoriteClub} className="card space-y-4">
        <div>
          <label className="label" htmlFor="favorite_club_id">Favorite club</label>
          <select
            id="favorite_club_id"
            name="favorite_club_id"
            className="input"
            defaultValue={fullProfile?.favorite_club_id ?? ""}
          >
            <option value="">— none —</option>
            {tierOrder.map((tier) =>
              clubsByTier[tier] ? (
                <optgroup key={tier} label={tier}>
                  {clubsByTier[tier].map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </optgroup>
              ) : null
            )}
          </select>
          <p className="mt-2 text-xs text-pl-purple/60">
            Your public profile page will use this club&apos;s colors.
          </p>
        </div>
        <button className="btn" type="submit">Save club</button>
      </form>
      <form action={requestPasswordReset} className="card space-y-2">
        <h2 className="font-semibold">Password</h2>
        <p className="text-xs text-pl-purple/60">
          We&apos;ll email you a reset link.
        </p>
        <button className="btn-ghost" type="submit">
          Reset password
        </button>
      </form>
    </section>
  );
}