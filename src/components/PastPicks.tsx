type Pick = {
  gameweek: number;
  team_id: number;
  result: "win" | "draw" | "loss" | "pending" | null;
  team: { name: string; short_name: string } | null;
};

const RESULT_STYLE: Record<string, string> = {
  win: "text-pl-accent-text",
  draw: "text-yellow-300",
  loss: "text-red-700",
  pending: "text-pl-purple/60",
};

export default function PastPicks({ picks }: { picks: Pick[] }) {
  if (!picks.length) return null;
  return (
    <div className="card">
      <h2 className="text-lg font-semibold">Your picks</h2>
      <table className="mt-3 w-full text-sm">
        <thead className="text-pl-purple/50 text-left">
          <tr>
            <th className="py-1">GW</th>
            <th className="py-1">Team</th>
            <th className="py-1 text-right">Result</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-pl-purple/10">
          {picks.map((p) => (
            <tr key={p.gameweek}>
              <td className="py-1">{p.gameweek}</td>
              <td className="py-1">{p.team?.name ?? `Team ${p.team_id}`}</td>
              <td
                className={
                  "py-1 text-right capitalize " +
                  (RESULT_STYLE[p.result ?? "pending"] ?? "text-pl-purple/60")
                }
              >
                {p.result ?? "pending"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
