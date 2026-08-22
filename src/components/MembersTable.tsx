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
  const byName = (a: Member, b: Member) =>
    (a.profile?.username ?? "").localeCompare(b.profile?.username ?? "");

  // Groups
  const safe = members
    .filter((m) => m.status === "alive" && m.note === "won")
    .sort(byName);
  const pending = members
    .filter(
      (m) =>
        m.status === "alive" &&
        (m.note === "pending" || m.note === "no pick yet")
    )
    .sort(byName);
  const eliminatedThisWeek = members
    .filter((m) => m.status === "alive" && m.provisional === "eliminated")
    .sort(byName);
  const previouslyEliminated = members
    .filter((m) => m.status !== "alive")
    .sort(byName);

  const renderPick = (m: Member) =>
    m.pickedTeam ? (
      <span className="flex items-center gap-1 text-xs text-pl-purple/60 shrink-0">
        {m.pickedTeam.crest_url && (
          <img
            src={m.pickedTeam.crest_url}
            alt=""
            className="h-3 w-3 object-contain"
          />
        )}
        {m.pickedTeam.short_name}
      </span>
    ) : null;

  const Row = ({
    m,
    tone,
  }: {
    m: Member;
    tone: "safe" | "pending" | "out";
  }) => {
    const nameClass =
      tone === "safe"
        ? "text-pl-purple font-medium"
        : tone === "pending"
        ? "text-pl-purple"
        : "text-pl-purple/70 line-through";
    const dot =
      tone === "safe"
        ? "bg-pl-accent"
        : tone === "pending"
        ? "bg-yellow-400"
        : "bg-red-500/70";
    const noteText =
      tone === "out"
        ? m.note
          ? m.note
          : `GW ${m.eliminated_gameweek ?? "?"}`
        : m.note;
    return (
      <li className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 min-w-0">
          <span className={"h-2 w-2 rounded-full shrink-0 " + dot} />
          <span className={"truncate " + nameClass}>
            {m.profile?.username ?? "Player"}
          </span>
          {renderPick(m)}
        </span>
        {noteText && (
          <span className="text-xs text-pl-purple/50 shrink-0">{noteText}</span>
        )}
      </li>
    );
  };

  const Section = ({
    title,
    count,
    items,
    tone,
  }: {
    title: string;
    count: number;
    items: Member[];
    tone: "safe" | "pending" | "out";
  }) =>
    items.length > 0 ? (
      <div className="mt-4 first:mt-0">
        <h3 className="text-xs uppercase tracking-wider text-pl-purple/50">
          {title} ({count})
        </h3>
        <ul className="mt-1 space-y-1 text-sm">
          {items.map((m) => (
            <Row key={m.user_id} m={m} tone={tone} />
          ))}
        </ul>
      </div>
    ) : null;

  return (
    <aside className="card h-fit">
      <h2 className="text-lg font-semibold">Players</h2>
      <Section title="Advanced" count={safe.length} items={safe} tone="safe" />
      <Section
        title="Pending"
        count={pending.length}
        items={pending}
        tone="pending"
      />
      <Section
        title="Out this week"
        count={eliminatedThisWeek.length}
        items={eliminatedThisWeek}
        tone="out"
      />
      <Section
        title="Previously eliminated"
        count={previouslyEliminated.length}
        items={previouslyEliminated}
        tone="out"
      />
      {safe.length === 0 &&
        pending.length === 0 &&
        eliminatedThisWeek.length === 0 &&
        previouslyEliminated.length === 0 && (
          <p className="mt-3 text-pl-purple/40 text-sm">No players yet.</p>
        )}
    </aside>
  );
}