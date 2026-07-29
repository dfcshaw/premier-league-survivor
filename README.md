# Premier League Survivor Pool

A small full-stack survivor pool for the Premier League: sign up, create or join a league, pick one team to win each gameweek (never reusing one), a draw or loss eliminates you. Built on Next.js 14 (App Router) + Supabase.

## Stack

- **Next.js 14** App Router, server actions, route handlers
- **Supabase** Postgres + Auth + Row Level Security
- **Tailwind CSS** for styling
- **TypeScript**

## Project layout

```
premier-league-survivor/
├── supabase/
│   ├── schema.sql           # full DB schema, RLS, and the 20 PL teams
│   └── seed_fixtures.sql    # optional GW1 fixtures so you can play end-to-end
├── src/
│   ├── app/
│   │   ├── page.tsx                       # landing page
│   │   ├── login/, signup/, auth/callback # auth flow (email + password)
│   │   ├── dashboard/                     # list user's leagues
│   │   ├── leagues/new/                   # create league
│   │   ├── leagues/join/                  # join by code
│   │   ├── leagues/[id]/                  # league screen: pick form + standings
│   │   └── api/leagues/[id]/advance/      # POST: score GW + advance
│   ├── components/                        # PickForm, MembersTable, PastPicks, SignOutButton
│   ├── lib/
│   │   ├── supabase/{client,server,middleware}.ts
│   │   ├── codes.ts                       # short league join codes
│   │   ├── survivor.ts                    # pure scoring logic (unit-testable)
│   │   └── survivor.test.ts               # smoke test for the rules
│   └── middleware.ts                      # keeps Supabase auth cookies fresh
```

## Setup

1. **Create a Supabase project** at https://supabase.com.
2. In the SQL editor, paste and run `supabase/schema.sql`. This creates all tables, the profile-creation trigger, RLS policies, and seeds the 20 Premier League teams.
3. (Optional) Run `supabase/seed_fixtures.sql` to drop in a sample GW1.
4. **Auth settings:** in Supabase Auth, turn email confirmations OFF for the MVP (so new users land straight in the app). You can also wire up Google/GitHub later — the callback at `/auth/callback` is already set up.
5. **Local env**: copy `.env.local.example` to `.env.local` and fill in the URL + anon key from Supabase Project Settings → API.
6. Install + run:

   ```bash
   npm install
   npm run dev
   ```

   Open http://localhost:3000.

## Playing through a gameweek

1. Sign up two users (in two browsers / incognito).
2. User A: **New league** → share the code with B.
3. User B: **Join with code**.
4. Each user picks a team for GW1.
5. As the league owner, go to Supabase Studio → `fixtures` table, fill in the `home_score`, `away_score`, set `status` to `finished` for the GW1 matches.
6. Back in the app on the league page, click **Score & advance gameweek**. Losers and drawers are eliminated, the GW pointer ticks forward, and the league marks itself completed when one survivor remains.

## How the rules are enforced

- **One pick per gameweek per league** is enforced by a DB unique constraint `(league_id, user_id, gameweek)`.
- **No reusing a team** is enforced by another unique constraint `(league_id, user_id, team_id)`.
- **Standard survivor rule** (draw or loss eliminates) lives in `src/lib/survivor.ts` and is applied by the admin advance route.

## Tests

```bash
npx tsx src/lib/survivor.test.ts
```

Smoke-tests the pure scoring logic with a handful of fixtures.

## Next steps (when you're ready)

- Pull real fixtures + results from a Premier League API (e.g. `football-data.org`) on a Supabase cron job and call `/api/leagues/[id]/advance` automatically once a gameweek finishes.
- Add a pick deadline (lock picks at the kickoff of the first match of the GW) and hide opponents' picks until then.
- Add password reset and OAuth providers.
- Add chat / a results feed per league.
- Pot tracking, multi-life variants, head-to-head tiebreakers.
