type Member = {
  user_id: string;
  status: "alive" | "eliminated" | string;
  eliminated_gameweek: number | null;
  profile: { username: string } | null;
};

export default function MembersTable({ members }: { members: Member[] }) {
  const alive = members.filter((m) => m.status === "alive");
  const dead = members.filter((m) => m.status !== "alive");

  return (
    <aside className="card h-fit">
      <h2 className="text-lg font-semibold">Players</h2>
      <div className="mt-3">
        <h3 className="text-xs uppercase tracking-wider text-white/50">
          Alive ({alive.length})
        </h3>
        <ul className="mt-1 space-y-1 text-sm">
          {alive.map((m) => (
            <li key={m.user_id} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-pl-accent" />
              {m.profile?.username ?? "Player"}
            </li>
          ))}
          {alive.length === 0 && (
            <li className="text-white/40">No survivors.</li>
          )}
        </ul>
      </div>
      {dead.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xs uppercase tracking-wider text-white/50">
            Eliminated ({dead.length})
          </h3>
          <ul className="mt-1 space-y-1 text-sm text-white/60">
            {dead.map((m) => (
              <li key={m.user_id} className="flex items-center justify-between">
                <span className="line-through">
                  {m.profile?.username ?? "Player"}
                </span>
                <span className="text-xs">GW {m.eliminated_gameweek ?? "?"}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
