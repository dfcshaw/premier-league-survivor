import Link from "next/link";
import { requestReset } from "./actions";

export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string; sent?: string };
}) {
  return (
    <section className="max-w-md mx-auto space-y-6">
      <header>
        <Link href="/login" className="text-sm text-pl-purple/60 hover:underline">
          ← Back to login
        </Link>
        <h1 className="text-3xl font-bold mt-1">Forgot password</h1>
        <p className="text-pl-purple/60 text-sm mt-2">
          Enter the email you signed up with. We&apos;ll send you a reset link.
        </p>
      </header>

      {searchParams.error && (
        <div className="card border-red-500/40 text-red-700 text-sm">
          {searchParams.error}
        </div>
      )}
      {searchParams.sent && (
        <div className="card border-pl-accent/40 text-pl-accent-text text-sm">
          Check your inbox for a reset link. If you don&apos;t see it, check spam.
        </div>
      )}

      <form action={requestReset} className="card space-y-4">
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className="input"
            placeholder="you@example.com"
            required
          />
        </div>
        <button className="btn" type="submit">Send reset link</button>
      </form>
    </section>
  );
}