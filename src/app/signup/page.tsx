import Link from "next/link";
import { signup } from "./actions";

export default function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <section className="mx-auto max-w-md card">
      <h1 className="text-2xl font-bold">Create an account</h1>
      <p className="text-pl-purple/70 text-sm mt-1">Pick a username your mates will know you by.</p>
      <form action={signup} className="mt-6 space-y-4">
        <div>
          <label className="label" htmlFor="username">Username</label>
          <input id="username" name="username" type="text" required className="input" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required className="input" />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" minLength={6} required className="input" />
        </div>
        {searchParams.error && (
          <p className="text-red-400 text-sm">{searchParams.error}</p>
        )}
        <button className="btn w-full" type="submit">Sign up</button>
      </form>
      <p className="mt-4 text-sm text-pl-purple/60">
        Already have an account? <Link className="text-pl-accent-text" href="/login">Log in</Link>
      </p>
    </section>
  );
}
