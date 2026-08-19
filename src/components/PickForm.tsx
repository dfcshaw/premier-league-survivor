"use client";
import { useState } from "react";
import { makePick } from "@/app/leagues/[id]/actions";

type Team = { id: number; name: string; short_name: string };

export default function PickForm({
  leagueId,
  gameweek,
  teams,
  usedTeamIds,
  lockedTeamIds,
  currentPickTeamId,
  currentPickLocked,
}: {
  leagueId: string;
  gameweek: number;
  teams: Team[];
  usedTeamIds: number[];
  lockedTeamIds: number[];
  currentPickTeamId: number | null;
  currentPickLocked: boolean;
}) {
  const [selected, setSelected] = useState<number | null>(currentPickTeamId);
  const usedSet = new Set(usedTeamIds);
  const lockedSet = new Set(lockedTeamIds);

  if (currentPickLocked) {
    const team = teams.find((t) => t.id === currentPickTeamId);
    return (
      <p className="mt-3 text-pl-purple/70 text-sm">
        Your GW {gameweek} pick{" "}
        <strong className="text-white">{team?.name ?? "—"}</strong> is locked in — its match has already kicked off.
      </p>
    );
  }

  return (
    <form action={makePick} className="mt-3 space-y-4">
      <input type="hidden" name="league_id" value={leagueId} />
      <input type="hidden" name="gameweek" value={gameweek} />
      <input type="hidden" name="team_id" value={selected ?? ""} />
      <p className="text-pl-purple/70 text-sm">
        Pick one team to win this gameweek. You can only pick a team until their match kicks off. Teams you&apos;ve already used are disabled. A draw or loss eliminates you.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {teams.map((t) => {
          const used = usedSet.has(t.id) && t.id !== currentPickTeamId;
          const locked = lockedSet.has(t.id) && t.id !== currentPickTeamId;
          const disabled = used || locked;
          const isSelected = selected === t.id;
          return (
            <button
              key={t.id}
              type="button"
              disabled={disabled}
              onClick={() => setSelected(t.id)}
              className={
                "rounded-md border px-2 py-3 text-sm text-left transition " +
                (disabled
                  ? "border-pl-purple/5 bg-pl-purple/5 text-pl-purple/30 line-through cursor-not-allowed"
                  : isSelected
                  ? "border-pl-accent bg-pl-accent/10 text-pl-accent-text"
                  : "border-pl-purple/15 bg-white hover:border-pl-purple/30")
              }
              title={
                used
                  ? "Already used in this league"
                  : locked
                  ? "Match already kicked off"
                  : t.name
              }
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