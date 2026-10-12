import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { updateUsername } from "./actions";

export default async function EditProfilePage({
  searchParams,
}: {
  searchParams: { error?: string; redirect_to?: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, name_confirmed")
    .eq("id", user.id)
    .maybeSingle();

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
    </section>
  );
}