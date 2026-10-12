import fs from "fs";

const WIKI_API = "https://en.wikipedia.org/w/api.php";
const HEADERS = {
  "User-Agent": "pl-survivor-pool/1.0 (contact: daniel.fc.shaw@gmail.com)",
  "Accept": "application/json",
};

async function fetchImageFor(title) {
  const url = new URL(WIKI_API);
  url.searchParams.set("action", "query");
  url.searchParams.set("titles", title);
  url.searchParams.set("prop", "pageimages");
  url.searchParams.set("format", "json");
  url.searchParams.set("pithumbsize", "300");
  url.searchParams.set("redirects", "1");

  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) return null;
  const data = await res.json();
  const pages = data.query?.pages ?? {};
  const page = Object.values(pages)[0];
  return page?.thumbnail?.source ?? null;
}

async function searchFootballer(name) {
  const url = new URL(WIKI_API);
  url.searchParams.set("action", "query");
  url.searchParams.set("list", "search");
  url.searchParams.set("srsearch", `${name} footballer`);
  url.searchParams.set("format", "json");
  url.searchParams.set("srlimit", "1");

  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) return null;
  const data = await res.json();
  return data.query?.search?.[0]?.title ?? null;
}

async function getImage(name) {
  let img = await fetchImageFor(name);
  if (img) return img;
  const title = await searchFootballer(name);
  if (!title) return null;
  return await fetchImageFor(title);
}

async function main() {
  const src = fs.readFileSync("src/lib/pl-players.ts", "utf8");
  const regex = /\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)"(?:,\s*club:\s*"([^"]+)")?(?:,\s*image_url:\s*"([^"]+)")?\s*\}/g;
  const players = [];
  let m;
  while ((m = regex.exec(src))) {
    players.push({ id: m[1], name: m[2], club: m[3], image_url: m[4] });
  }
  console.log(`Found ${players.length} players`);

  const results = [];
  for (let i = 0; i < players.length; i++) {
    const p = players[i];
    try {
      if (p.image_url) {
        results.push(p);
        continue;
      }
      const img = await getImage(p.name);
      console.log(`[${i + 1}/${players.length}] ${p.name}: ${img ? "✓" : "✗"}`);
      results.push({ ...p, image_url: img || undefined });
    } catch (e) {
      console.error(`${p.name}: ${e.message}`);
      results.push(p);
    }
    await new Promise((r) => setTimeout(r, 150));
  }

  const output = `export type PlayerEntry = {
  id: string;
  name: string;
  club?: string;
  image_url?: string;
};

export const PL_PLAYERS: PlayerEntry[] = [
${results
  .map(
    (p) =>
      `  { id: ${JSON.stringify(p.id)}, name: ${JSON.stringify(p.name)}${
        p.club ? `, club: ${JSON.stringify(p.club)}` : ""
      }${p.image_url ? `, image_url: ${JSON.stringify(p.image_url)}` : ""} },`
  )
  .join("\n")}
];
`;

  fs.writeFileSync("src/lib/pl-players.ts", output);
  console.log("\nDone!");
  const missed = results.filter((p) => !p.image_url);
  if (missed.length) {
    console.log(`\n${missed.length} players without images:`);
    missed.forEach((p) => console.log(`  - ${p.name}`));
  }
}

main();