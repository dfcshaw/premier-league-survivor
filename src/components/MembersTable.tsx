type Member = {
  user_id: string;
  status: "alive" | "eliminated" | string;
  eliminated_gameweek: number | null;
  profile: { username: string } | null;
  provisional?: "alive" | "eliminated";
  note?: string;
  pickedTeam?: { name: string; short_name: string; crest_url?: string } | null;
};

export default function MembersTable({ members }: { members: Member[] }) {
  const effective = (m: Member) => m.provisional ?? m.status;
  const alive = members.filter((m) => effective(m) === "alive");
  const dead = members.filter((m) => effective(m) !== "alive");

  const dotColor = (note?: string) => {
    if (note === "won") return "bg-pl-accent";
    if (note === "no pick yet") return "bg-yellow-400";
    return "bg-pl-purple/50";
  };

  const renderPick = (m: Member) =>
    m.pickedTeam ? (
      <span className="flex items-center gap-1 text-xs text-pl-purple/60">
        {m.pickedTeam.crest_url && (
          <img src={m.pickedTeam.crest_url} alt="" className="h-3 w-3 object-contain" />
        )}
        {m.pickedTeam.short_name}
      </span>
    ) : null;

  return (
    <aside className="card h-fit">
      <h2 className="text-lg font-semibold">Players</h2>
      <div className="mt-3">
        <h3 className="text-xs uppercase tracking-wider text-pl-purple/50">
          Alive ({alive.length})
        </h3>
        <ul className="mt-1 space-y-1 text-sm">
          {alive.map((m) => (
            <li key={m.user_id} className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 min-w-0">
                <span className={"h-2 w-2 rounded-full shrink-0 " + dotColor(m.note)} />
                <span className="truncate">{m.profile?.username ?? "Player"}</span>
                {renderPick(m)}
              </span>
              {m.note && (
                <span className="text-xs text-pl-purple/50 shrink-0">{m.note}</span>
              )}
            </li>
          ))}
          {alive.length === 0 && <li className="text-pl-purple/40">No survivors.</li>}
        </ul>
      </div>
      {dead.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xs uppercase tracking-wider text-pl-purple/50">
            Eliminated ({dead.length})
          </h3>
          <ul className="mt-1 space-y-1 text-sm text-pl-purple/60">
            {dead.map((m) => (
              <li key={m.user_id} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 min-w-0">
                  <span className="line-through truncate">
                    {m.profile?.username ?? "Player"}
                  </span>
                  {renderPick(m)}
                </span>
                <span className="text-xs shrink-0">
                  {m.note ? m.note : `GW ${m.eliminated_gameweek ?? "?"}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}