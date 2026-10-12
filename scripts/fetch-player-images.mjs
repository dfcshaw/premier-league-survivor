import fs from "fs";

const WIKI_API = "https://en.wikipedia.org/w/api.php";
const HEADERS = {
  "User-Agent": "pl-survivor-pool/1.0 (contact: daniel.fc.shaw@gmail.com)",
  "Accept": "application/json",
};

const PL_CLUBS = [
  "Arsenal","Aston Villa","AFC Bournemouth","Bournemouth","Brentford","Brighton","Brighton & Hove Albion","Chelsea","Coventry City","Crystal Palace","Everton","Fulham","Hull City","Ipswich Town","Ipswich","Leeds United","Liverpool","Manchester City","Manchester United","Newcastle United","Newcastle","Nottingham Forest","Sunderland","Tottenham Hotspur","Tottenham","Blackburn Rovers","Burnley","Cardiff City","Leicester City","Luton Town","Middlesbrough","Norwich City","Portsmouth","Queens Park Rangers","QPR","Sheffield United","Sheffield Wednesday","Southampton","Stoke City","Swansea City","Watford","West Bromwich Albion","West Ham United","West Ham","Wigan Athletic","Wolverhampton Wanderers","Wolves","Birmingham City","Bolton Wanderers","Charlton Athletic","Reading","Blackpool","Oldham Athletic","Barnsley","Bradford City","Derby County","Swindon Town","Wimbledon",
];
const PL_SET = new Set(PL_CLUBS.map((c) => c.toLowerCase()));

function cleanValue(raw) {
  return raw
    .replace(/\{\{(?:ill|interlanguage link)\|([^|}]+)(?:\|[^}]*)?\}\}/gi, "$1")
    .replace(/\{\{(?:sortname|nowrap)\|([^|}]+)(?:\|[^|}]+)?(?:\|[^}]*)?\}\}/gi, (_, a) => a)
    .replace(/\[\[[^|\]]+\|([^\]]+)\]\]/g, "$1")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/\{\{[^}]+\}\}/g, "")
    .replace(/\s*\(.*?\)\s*/g, "")
    .trim();
}

function isPL(name) {
  const n = cleanValue(name).toLowerCase();
  for (const c of PL_SET) {
    if (n === c || n.includes(c)) return true;
  }
  return false;
}

async function wikiFetch(params) {
  const url = new URL(WIKI_API);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) return null;
  return await res.json();
}

async function fetchImageFor(title) {
  const data = await wikiFetch({
    action: "query", titles: title, prop: "pageimages",
    format: "json", pithumbsize: "300", redirects: "1",
  });
  const pages = data?.query?.pages ?? {};
  const page = Object.values(pages)[0];
  return page?.thumbnail?.source ?? null;
}

async function getWikitext(title) {
  const data = await wikiFetch({
    action: "query", titles: title, prop: "revisions",
    rvprop: "content", rvslots: "main", format: "json", redirects: "1",
  });
  const pages = data?.query?.pages ?? {};
  const page = Object.values(pages)[0];
  return page?.revisions?.[0]?.slots?.main?.["*"] ?? null;
}

async function searchPlayer(name) {
  const data = await wikiFetch({
    action: "query", list: "search",
    srsearch: `${name} footballer`, format: "json", srlimit: "1",
  });
  return data?.query?.search?.[0]?.title ?? null;
}

function captureField(wikitext, field) {
  const re = new RegExp(`\\n\\s*\\|\\s*${field}\\s*=\\s*(.+?)(?=\\n\\s*\\||\\n\\s*\\}\\})`, "si");
  const m = wikitext.match(re);
  return m ? m[1].trim() : null;
}

function parseYears(str) {
  if (!str) return { from: undefined, to: undefined };
  const m = str.match(/(\d{4})\s*[–-]\s*(\d{4}|present|\?)?/) || str.match(/(\d{4})/);
  if (!m) return { from: undefined, to: undefined };
  const from = parseInt(m[1]);
  const toRaw = m[2];
  const to = toRaw && toRaw !== "present" && toRaw !== "?" ? parseInt(toRaw) : undefined;
  return { from: Number.isFinite(from) ? from : undefined, to };
}

function parseInt10(str) {
  if (!str) return undefined;
  const m = str.match(/-?\d+/);
  if (!m) return undefined;
  const n = parseInt(m[0]);
  return Number.isFinite(n) ? n : undefined;
}

function parseCareer(wikitext) {
  if (!wikitext) return [];
  const variants = [
    { c: "clubs", y: "years", a: "caps", g: "goals" },
    { c: "seniorclubs", y: "senioryears", a: "seniorcaps", g: "seniorgoals" },
  ];

  for (const v of variants) {
    const spells = [];
    for (let i = 1; i <= 30; i++) {
      const clubRaw = captureField(wikitext, `${v.c}${i}`);
      if (clubRaw == null) break;
      if (/loan|youth/i.test(clubRaw)) continue;
      if (!isPL(clubRaw)) continue;
      const club = cleanValue(clubRaw);
      const yearsRaw = captureField(wikitext, `${v.y}${i}`);
      const { from, to } = parseYears(yearsRaw);
      const apps = parseInt10(captureField(wikitext, `${v.a}${i}`));
      const goals = parseInt10(captureField(wikitext, `${v.g}${i}`));
      spells.push({ club, from, to, apps, goals });
    }
    if (spells.length > 0) return spells;
  }
  return [];
}

async function getImageAndCareer(name) {
  let wikitext = await getWikitext(name);
  let image = await fetchImageFor(name);
  if (!wikitext || !image) {
    const found = await searchPlayer(name);
    if (found) {
      if (!wikitext) wikitext = await getWikitext(found);
      if (!image) image = await fetchImageFor(found);
    }
  }
  return { image: image ?? undefined, career: parseCareer(wikitext || "") };
}

function parseExistingPlayers(src) {
  const regex = /\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)"(?:,\s*club:\s*"([^"]+)")?/g;
  const out = [];
  let m;
  while ((m = regex.exec(src))) out.push({ id: m[1], name: m[2], club: m[3] });
  const uniqueById = new Map();
  for (const p of out) uniqueById.set(p.id, p);
  return [...uniqueById.values()];
}

async function main() {
  const src = fs.readFileSync("src/lib/pl-players.ts", "utf8");
  const players = parseExistingPlayers(src);
  console.log(`Found ${players.length} unique players`);

  const results = [];
  for (let i = 0; i < players.length; i++) {
    const p = players[i];
    try {
      const { image, career } = await getImageAndCareer(p.name);
      console.log(`[${i + 1}/${players.length}] ${p.name}: ${image ? "img" : "-"}, ${career.length} PL spells`);
      results.push({ ...p, image_url: image, career: career.length ? career : undefined });
    } catch (e) {
      console.error(`${p.name}: ${e.message}`);
      results.push(p);
    }
    await new Promise((r) => setTimeout(r, 300));
  }

  const serializeSpell = (sp) => {
    const parts = [`club: ${JSON.stringify(sp.club)}`];
    if (sp.from) parts.push(`from: ${sp.from}`);
    if (sp.to) parts.push(`to: ${sp.to}`);
    if (sp.apps != null) parts.push(`apps: ${sp.apps}`);
    if (sp.goals != null) parts.push(`goals: ${sp.goals}`);
    return `{ ${parts.join(", ")} }`;
  };

  const output = `export type ClubSpell = {
  club: string;
  from?: number;
  to?: number;
  apps?: number;
  goals?: number;
};

export type PlayerStats = {
  pl_appearances?: number;
  pl_goals?: number;
  pl_assists?: number;
  pl_titles?: number;
  golden_boots?: number;
  pl_poty?: number;
};

export type PlayerEntry = {
  id: string;
  name: string;
  club?: string;
  image_url?: string;
  career?: ClubSpell[];
  stats?: PlayerStats;
};

export const PL_PLAYERS: PlayerEntry[] = [
${results.map((p) => {
  const parts = [`id: ${JSON.stringify(p.id)}`, `name: ${JSON.stringify(p.name)}`];
  if (p.club) parts.push(`club: ${JSON.stringify(p.club)}`);
  if (p.image_url) parts.push(`image_url: ${JSON.stringify(p.image_url)}`);
  if (p.career && p.career.length) {
    parts.push(`career: [${p.career.map(serializeSpell).join(", ")}]`);
  }
  return `  { ${parts.join(", ")} },`;
}).join("\n")}
];
`;

  fs.writeFileSync("src/lib/pl-players.ts", output);
  console.log("\nDone!");
}

main();