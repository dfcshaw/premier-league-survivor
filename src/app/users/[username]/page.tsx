import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CLUB_COLORS, DEFAULT_COLORS } from "@/lib/club-colors";
import { CHAMPIONS } from "@/lib/champions";
import BackButton from "@/components/BackButton";
import { PL_PLAYERS } from "@/lib/pl-players";

export default async function UserProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, favorite_club_id, team:favorite_club_id(name, short_name, crest_url, tier)")
    .eq("username", decodeURIComponent(params.username))
    .maybeSingle();
  if (!profile) notFound();

  const clubName = (profile as any).team?.name;
  const tier = (profile as any).team?.tier;
  const colors = (clubName && CLUB_COLORS[clubName]) || DEFAULT_COLORS;
  const isChampion = CHAMPIONS[profile.username];
  const isOwnProfile = user?.id === profile.id;
    const { data: rushmore } = await supabase
    .from("profile_rushmore")
    .select("slot, player_id")
    .eq("user_id", profile.id)
    .order("slot");

  const playersById = new Map(PL_PLAYERS.map((p) => [p.id, p]));
  const rushmorePlayers = (rushmore ?? [])
    .map((r: any) => playersById.get(r.player_id))
    .filter(Boolean);
  const initials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <BackButton />
        {isOwnProfile && (
          <Link href="/profile/edit" className="text-sm text-pl-accent-text hover:underline">
            Edit profile →
          </Link>
        )}
      </div>

      <div
        className="rounded-xl p-8 shadow-sm"
        style={{ background: colors.primary, color: colors.text }}
      >
        <div className="flex items-center gap-4">
          {(profile as any).team?.crest_url && (
            <img
              src={(profile as any).team.crest_url}
              alt=""
              className="h-12 w-12 object-contain"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              {profile.username}
              {isChampion && (
                <span
                  title={`Champion ${isChampion.join(", ")}`}
                  className="text-base"
                  style={{ color: colors.accent }}
                >
                  ★
                </span>
              )}
            </h1>
            {clubName && (
              <p className="text-sm opacity-80">
                Supports {clubName}{tier && tier !== "PL" ? ` (${tier})` : ""}
              </p>
            )}
          </div>
        </div>
      </div>

      {!clubName && (
        <div className="card">
          <p className="text-pl-purple/60 text-sm">
            This user hasn&apos;t picked a favorite club yet.
          </p>
        </div>
      )}
          {rushmorePlayers.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold">Mount Rushmore</h2>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {rushmorePlayers.map((p: any) => (
              <div key={p.id} className="text-center">
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-full aspect-square rounded-md object-cover"
                  />
                ) : (
                  <div
                    className="w-full aspect-square rounded-md flex items-center justify-center text-xl font-bold"
                    style={{ background: colors.primary, color: colors.text }}
                  >
                    {initials(p.name)}
                  </div>
                )}
                <div className="mt-2 text-xs text-pl-purple font-medium">
                  {p.name}
                </div>
                {p.club && (
                  <div className="text-[10px] text-pl-purple/60">{p.club}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}