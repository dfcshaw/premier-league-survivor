"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function updateUsername(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const username = String(formData.get("username") ?? "").trim();
  if (username.length < 2) {
    redirect("/profile/edit?error=Name%20must%20be%20at%20least%202%20characters");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ username, name_confirmed: true })
    .eq("id", user.id);

  if (error) {
    redirect(`/profile/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard");
  const redirectTo = String(formData.get("redirect_to") ?? "/dashboard");
  redirect(redirectTo);
}
export async function updateEmail(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const newEmail = String(formData.get("email") ?? "").trim();
  if (!newEmail.includes("@") || newEmail.length < 5) {
    redirect("/profile/edit?error=Invalid%20email");
  }

  const { error } = await supabase.auth.updateUser({ email: newEmail });
  if (error) {
    redirect(`/profile/edit?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/profile/edit?message=Check%20your%20new%20email%20to%20confirm%20the%20change");
}
export async function updateFavoriteClub(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const clubIdRaw = String(formData.get("favorite_club_id") ?? "");
  const favorite_club_id = clubIdRaw === "" ? null : Number(clubIdRaw);

  const { error } = await supabase
    .from("profiles")
    .update({ favorite_club_id })
    .eq("id", user.id);

  if (error) {
    redirect(`/profile/edit?error=${encodeURIComponent(error.message)}`);
  }
  redirect("/profile/edit?message=Favorite%20club%20updated");
}
export async function requestPasswordReset() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) redirect("/login");

  const origin = headers().get("origin") ?? "";
  const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });
  if (error) {
    redirect(`/profile/edit?error=${encodeURIComponent(error.message)}`);
  }
  redirect("/profile/edit?message=Check%20your%20email%20for%20a%20password%20reset%20link");
}
export async function updateRushmore(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const picks = [1, 2, 3, 4].map((slot) => {
    const id = String(formData.get(`slot_${slot}`) ?? "").trim();
    return { slot, player_id: id };
  });

  // Clear and reinsert
  await supabase.from("profile_rushmore").delete().eq("user_id", user.id);

  const rows = picks
    .filter((p) => p.player_id)
    .map((p) => ({ user_id: user.id, slot: p.slot, player_id: p.player_id }));

  if (rows.length) {
    const { error } = await supabase.from("profile_rushmore").insert(rows);
    if (error) {
      redirect(`/profile/edit?error=${encodeURIComponent(error.message)}`);
    }
  }

  redirect("/profile/edit?message=Mount%20Rushmore%20updated");
}
export async function uploadAvatar(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const file = formData.get("avatar") as File | null;
  if (!file || file.size === 0) {
    redirect("/profile/edit?error=No%20file%20selected");
  }
  if (file.size > 2 * 1024 * 1024) {
    redirect("/profile/edit?error=File%20must%20be%20under%202MB");
  }
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    redirect("/profile/edit?error=Only%20JPG%2C%20PNG%2C%20or%20WebP");
  }

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${user.id}/${Date.now()}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (upErr) {
    redirect(`/profile/edit?error=${encodeURIComponent(upErr.message)}`);
  }

  const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);

  const { error: updErr } = await supabase
    .from("profiles")
    .update({ avatar_url: pub.publicUrl })
    .eq("id", user.id);
  if (updErr) {
    redirect(`/profile/edit?error=${encodeURIComponent(updErr.message)}`);
  }

  redirect("/profile/edit?message=Photo%20updated");
}