"use client";

import { useState } from "react";
import { makePick } from "@/app/leagues/[id]/actions";

type Team = { id: number; name: string; short_name: string };

export default function PickForm({
  leagueId,
  gameweek,
  teams,
  usedTeamIds,
  currentPickTeamId,
}: {
  leagueId: string;
  gameweek: number;
  teams: Team[];
  usedTeamIds: number[];
  currentPickTeamId: number | null;
}) {
  const [selected, setSelected] = useState<number | null>(currentPickTeamId);
  // Allow keeping the current pick selectable even though it's in usedTeamIds
  const usedSet = new Set(usedTeamIds);

  return (
    <form action={makePick} className="mt-3 space-y-4">
      <input type="hidden" name="league_id" value={leagueId} />
      <input type="hidden" name="gameweek" value={gameweek} />
      <input type="hidden" name="team_id" value={selected ?? ""} />

      <p className="text-white/70 text-sm">
        Pick one team to win this gameweek. Teams you&apos;ve already used are
        disabled. A draw or loss eliminates you.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {teams.map((t) => {
          const used = usedSet.has(t.id) && t.id !== currentPickTeamId;
          const isSelected = selected === t.id;
          return (
            <button
              key={t.id}
              type="button"
              disabled={used}
              onClick={() => setSelected(t.id)}
              className={
                "rounded-md border px-2 py-3 text-sm text-left transition " +
                (used
                  ? "border-white/5 bg-white/[0.02] text-white/30 line-through cursor-not-allowed"
                  : isSelected
                  ? "border-pl-accent bg-pl-accent/10 text-pl-accent"
                  : "border-white/15 bg-white/[0.03] hover:border-white/30")
              }
              title={used ? "Already used in this league" : t.name}
            >
              <div className="font-semibold">{t.short_name}</div>
              <div className="text-xs opacity-70 truncate">{t.name}</div>
            </button>
          );
        })}
      </div>
      <button className="btn" type="submit" disabled={selected === null}>
        {currentPickTeamId ? "Update pick" : "Lock in pick"}
      </button>
    </form>
  );
}
