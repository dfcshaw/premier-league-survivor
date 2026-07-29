import { joinLeague } from "./actions";

export default function JoinLeaguePage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <section className="mx-auto max-w-md card">
      <h1 className="text-2xl font-bold">Join a league</h1>
      <p className="text-white/70 text-sm mt-1">Got a code from a friend?</p>
      <form action={joinLeague} className="mt-6 space-y-4">
        <div>
          <label className="label" htmlFor="code">League code</label>
          <input
            id="code"
            name="code"
            required
            className="input uppercase tracking-widest"
            placeholder="ABC234"
          />
        </div>
        {searchParams.error && (
          <p className="text-red-400 text-sm">{searchParams.error}</p>
        )}
        <button className="btn w-full" type="submit">Join</button>
      </form>
    </section>
  );
}
