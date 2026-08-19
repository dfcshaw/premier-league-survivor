import Link from "next/link";
import { login } from "./actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <section className="mx-auto max-w-md card">
      <h1 className="text-2xl font-bold">Log in</h1>
      <p className="text-pl-purple/70 text-sm mt-1">Welcome back.</p>
      <form action={login} className="mt-6 space-y-4">
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required className="input" />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required className="input" />
        </div>
        {searchParams.error && (
          <p className="text-red-400 text-sm">{searchParams.error}</p>
        )}
        <button className="btn w-full" type="submit">Log in</button>
      </form>
      <p className="mt-4 text-sm text-pl-purple/60">
        No account? <Link className="text-pl-accent-text" href="/signup">Sign up</Link>
      </p>
    </section>
  );
}
