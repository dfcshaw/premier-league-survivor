-- Example GW1 fixtures so you can play through end-to-end before wiring
-- in a real Premier League data source.
-- Adjust dates/teams as you like.
insert into public.fixtures (gameweek, home_team_id, away_team_id, kickoff, status)
select 1, h.id, a.id, now() + interval '7 days', 'scheduled'
from (values
  ('Arsenal','Wolves'),
  ('Manchester City','Chelsea'),
  ('Liverpool','Brighton'),
  ('Manchester United','Fulham'),
  ('Tottenham','Aston Villa')
) as v(home,away)
join public.teams h on h.name = v.home
join public.teams a on a.name = v.away;

-- To score GW1, fill in scores + status = 'finished':
--   update public.fixtures set home_score = 2, away_score = 0, status = 'finished'
--     where gameweek = 1 and home_team_id = (select id from public.teams where name = 'Arsenal');
