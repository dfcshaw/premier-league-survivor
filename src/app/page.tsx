import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Landing() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <section className="grid gap-10 sm:grid-cols-2 sm:items-center">
      <div>
        <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
          One team. <br />
          One pick. <br />
          <span className="text-pl-accent">Don&apos;t go out.</span>
        </h1>
        <p className="mt-4 text-white/70">
          The classic Premier League survivor pool. Pick one team to win each
          gameweek. You can&apos;t pick the same team twice. A draw or a loss
          and you&apos;re out. Last one standing wins.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/signup" className="btn">
            Get started
          </Link>
          <Link href="/login" className="btn-ghost">
            I have an account
          </Link>
        </div>
      </div>
      <div className="card">
        <h2 className="text-lg font-semibold">How it works</h2>
        <ol className="mt-3 space-y-2 text-white/80 text-sm list-decimal pl-5">
          <li>Create a league or join one with a code.</li>
          <li>Each gameweek, pick one team to win.</li>
          <li>You can never pick the same team twice.</li>
          <li>If your team draws or loses, you&apos;re eliminated.</li>
          <li>Last survivor takes the glory (and the pot).</li>
        </ol>
      </div>
    </section>
  );
}
