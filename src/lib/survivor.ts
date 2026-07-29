// Pure survivor-pool result logic. Easy to unit test.

export type FixtureRow = {
  home_team_id: number;
  away_team_id: number;
  home_score: number | null;
  away_score: number | null;
  status: "scheduled" | "live" | "finished" | string;
};

export type PickResult = "win" | "draw" | "loss";

/**
 * Given a team's id and a list of finished fixtures for the gameweek,
 * return win/draw/loss, or null if the team's match hasn't finished.
 */
export function resultForTeam(
  teamId: number,
  fixtures: FixtureRow[]
): PickResult | null {
  const f = fixtures.find(
    (x) =>
      (x.home_team_id === teamId || x.away_team_id === teamId) &&
      x.status === "finished" &&
      x.home_score != null &&
      x.away_score != null
  );
  if (!f) return null;

  const isHome = f.home_team_id === teamId;
  const teamScore = isHome ? f.home_score! : f.away_score!;
  const oppScore = isHome ? f.away_score! : f.home_score!;
  if (teamScore > oppScore) return "win";
  if (teamScore < oppScore) return "loss";
  return "draw";
}

/**
 * Standard survivor rule: a draw or a loss eliminates the player.
 * A missing pick (the user never made one) also eliminates them.
 */
export function survivesStandardRule(result: PickResult | null): boolean {
  return result === "win";
}
