"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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