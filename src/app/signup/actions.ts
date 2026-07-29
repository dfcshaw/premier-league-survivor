"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function signup(formData: FormData) {
  const supabase = createClient();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const username = String(formData.get("username") ?? "").trim();

  if (!username) {
    redirect("/signup?error=Username%20required");
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });
  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }
  revalidatePath("/", "layout");
  // If email confirmation is OFF (recommended for MVP), user is signed in.
  redirect("/dashboard");
}
