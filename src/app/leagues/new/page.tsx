import { createLeague } from "./actions";

export default function NewLeaguePage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <section className="mx-auto max-w-md card">
      <h1 className="text-2xl font-bold">Create a league</h1>
      <p className="text-white/70 text-sm mt-1">
        You&apos;ll get a join code to share with your mates.
      </p>
      <form action={createLeague} className="mt-6 space-y-4">
        <div>
          <label className="label" htmlFor="name">League name</label>
          <input id="name" name="name" required className="input" placeholder="The Office Survivor" />
        </div>
        {searchParams.error && (
          <p className="text-red-400 text-sm">{searchParams.error}</p>
        )}
        <button className="btn w-full" type="submit">Create</button>
      </form>
    </section>
  );
}
