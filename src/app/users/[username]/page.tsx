import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CLUB_COLORS, DEFAULT_COLORS } from "@/lib/club-colors";
import { CHAMPIONS } from "@/lib/champions";

export default async function UserProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const supabase = createClient();

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

  return (
    <section className="space-y-6">
      <Link href="/dashboard" className="text-sm text-pl-purple/60 hover:underline">
        ← Back
      </Link>

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
    </section>
  );
}