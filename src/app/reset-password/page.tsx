import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { setNewPassword } from "./actions";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?error=Reset%20link%20expired%20—%20try%20again");

  return (
    <section className="max-w-md mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Set a new password</h1>
        <p className="text-pl-purple/60 text-sm mt-2">
          Choose something you&apos;ll remember.
        </p>
      </header>

      {searchParams.error && (
        <div className="card border-red-500/40 text-red-700 text-sm">
          {searchParams.error}
        </div>
      )}

      <form action={setNewPassword} className="card space-y-4">
        <div>
          <label className="label" htmlFor="password">New password</label>
          <input
            id="password"
            name="password"
            type="password"
            className="input"
            minLength={8}
            required
          />
        </div>
        <button className="btn" type="submit">Save</button>
      </form>
    </section>
  );
}