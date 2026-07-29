// Tiny smoke test for survivor scoring. Run with:
//   npx tsx src/lib/survivor.test.ts
import { resultForTeam, survivesStandardRule } from "./survivor";

const fixtures = [
  { home_team_id: 1, away_team_id: 2, home_score: 2, away_score: 0, status: "finished" },
  { home_team_id: 3, away_team_id: 4, home_score: 1, away_score: 1, status: "finished" },
  { home_team_id: 5, away_team_id: 6, home_score: null, away_score: null, status: "scheduled" },
];

function assert(cond: any, msg: string) {
  if (!cond) {
    console.error("FAIL:", msg);
    process.exit(1);
  } else {
    console.log("ok  ", msg);
  }
}

assert(resultForTeam(1, fixtures as any) === "win", "home win");
assert(resultForTeam(2, fixtures as any) === "loss", "away loss");
assert(resultForTeam(3, fixtures as any) === "draw", "home draw");
assert(resultForTeam(4, fixtures as any) === "draw", "away draw");
assert(resultForTeam(5, fixtures as any) === null, "unfinished is null");
assert(resultForTeam(99, fixtures as any) === null, "no fixture is null");

assert(survivesStandardRule("win") === true, "win survives");
assert(survivesStandardRule("draw") === false, "draw eliminates");
assert(survivesStandardRule("loss") === false, "loss eliminates");
assert(survivesStandardRule(null) === false, "no result eliminates");

console.log("\nall good");
