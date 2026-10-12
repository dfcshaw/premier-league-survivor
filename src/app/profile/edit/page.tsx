import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BackButton from "@/components/BackButton";
import { PL_PLAYERS } from "@/lib/pl-players";
import {
  updateUsername,
  updateEmail,
  updateFavoriteClub,
  requestPasswordReset,
  updateRushmore,
  uploadAvatar,
} from "./actions";

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
    .select("username, avatar_url, favorite_club_id")
    .eq("id", user.id)
    .maybeSingle();

  const { data: allClubs } = await supabase
    .from("teams")
    .select("id, name, tier")
    .order("tier")
    .order("name");

  const clubsByTier: Record<string, any[]> = {};
  (allClubs ?? []).forEach((c: any) => {
    const t = c.tier || "Other";
    if (!clubsByTier[t]) clubsByTier[t] = [];
    clubsByTier[t].push(c);
  });
  const tierOrder = ["PL", "EFL"];

  const { data: rushmore } = await supabase
    .from("profile_rushmore")
    .select("slot, player_id")
    .eq("user_id", user.id)
    .order("slot");
  const rushmoreBySlot = new Map<number, string>();
  (rushmore ?? []).forEach((r: any) => rushmoreBySlot.set(r.slot, r.player_id));

  const emailConfirmed = !!user.email_confirmed_at;

  return (
    <section className="max-w-md mx-auto space-y-6">
      <header>
        <BackButton />
        <h1 className="text-3xl font-bold mt-1">Edit your profile</h1>
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

      <form action={uploadAvatar} className="card space-y-4" encType="multipart/form-data">
        <div className="flex items-center gap-4">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt=""
              className="h-20 w-20 rounded-full object-cover border border-pl-purple/10"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-pl-purple/10 flex items-center justify-center text-xl font-bold text-pl-purple">
              {profile?.username?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}
          <div className="flex-1">
            <label className="label" htmlFor="avatar">Profile photo</label>
            <input
              id="avatar"
              name="avatar"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="block text-sm"
              required
            />
            <p className="text-xs text-pl-purple/60 mt-1">Max 2MB, JPG/PNG/WebP.</p>
          </div>
        </div>
        <button className="btn" type="submit">Upload photo</button>
      </form>

      <form action={updateUsername} className="card space-y-4">
        <input type="hidden" name="redirect_to" value={searchParams.redirect_to ?? "/dashboard"} />
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
        <button className="btn" type="submit">Save name</button>
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
        <button className="btn" type="submit">Update email</button>
      </form>

      <form action={updateFavoriteClub} className="card space-y-4">
        <div>
          <label className="label" htmlFor="favorite_club_id">Favorite club</label>
          <select
            id="favorite_club_id"
            name="favorite_club_id"
            className="input"
            defaultValue={profile?.favorite_club_id ?? ""}
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
        <p className="text-xs text-pl-purple/60">We&apos;ll email you a reset link.</p>
        <button className="btn-ghost" type="submit">Reset password</button>
      </form>

      <form action={updateRushmore} className="card space-y-4">
        <div>
          <h2 className="font-semibold">Top 4</h2>
          <p className="text-xs text-pl-purple/60 mt-1">Pick 4 Premier League players — any era.</p>
        </div>
        {[1, 2, 3, 4].map((slot) => (
          <div key={slot}>
            <label className="label" htmlFor={`slot_${slot}`}>Slot {slot}</label>
            <select
              id={`slot_${slot}`}
              name={`slot_${slot}`}
              className="input"
              defaultValue={rushmoreBySlot.get(slot) ?? ""}
            >
              <option value="">— none —</option>
              {PL_PLAYERS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}{p.club ? ` (${p.club})` : ""}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button className="btn" type="submit">Save Rushmore</button>
      </form>
    </section>
  );
}