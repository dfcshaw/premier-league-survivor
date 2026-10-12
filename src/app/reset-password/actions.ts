"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function setNewPassword(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?error=Reset%20link%20expired%20—%20try%20again");

  const password = String(formData.get("password") ?? "");
  if (password.length < 8) {
    redirect("/reset-password?error=Password%20must%20be%20at%20least%208%20characters");
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    redirect(`/reset-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard?message=Password%20updated");
}