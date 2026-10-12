"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function togglePayment(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const leagueId = String(formData.get("league_id"));
  const memberId = String(formData.get("member_id"));
  const paid = formData.get("paid") === "true";

  // Verify current user is league owner
  const { data: league } = await supabase
    .from("leagues")
    .select("owner_id")
    .eq("id", leagueId)
    .maybeSingle();
  if (!league || league.owner_id !== user.id) {
    redirect(`/leagues/${leagueId}?error=Only%20the%20owner%20can%20manage%20payments`);
  }

  await supabase
    .from("league_members")
    .update({ has_paid: paid })
    .eq("league_id", leagueId)
    .eq("user_id", memberId);

  revalidatePath(`/leagues/${leagueId}/manage`);
  revalidatePath(`/leagues/${leagueId}`);
}