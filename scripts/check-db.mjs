import fs from "node:fs";
import postgres from "postgres";

function loadEnv(path) {
  const text = fs.readFileSync(path, "utf8");

  for (const line of text.split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;

    const splitAt = line.indexOf("=");
    if (splitAt === -1) continue;

    const key = line.slice(0, splitAt);
    const value = line.slice(splitAt + 1);
    process.env[key] = value;
  }
}

loadEnv(".env.production.local");

function usableConnectionString(value) {
  if (!value || value === '""') {
    return null;
  }

  return value;
}

const connectionString =
  usableConnectionString(process.env.POSTGRES_URL) ??
  usableConnectionString(process.env.DATABASE_URL) ??
  usableConnectionString(process.env.POSTGRES_PRISMA_URL) ??
  usableConnectionString(process.env.POSTGRES_URL_NON_POOLING);

if (!connectionString) {
  throw new Error("POSTGRES_URL or DATABASE_URL is missing.");
}

const sql = postgres(connectionString, {
  max: 1,
  prepare: false,
});

await sql`
  CREATE TABLE IF NOT EXISTS walk_entries (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    steps INTEGER NOT NULL CHECK (steps > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;

await sql`
  INSERT INTO walk_entries (name, steps)
  VALUES (${"Vercel Smoke Test"}, ${1})
`;

const total = await sql`
  SELECT COALESCE(SUM(steps), 0)::int AS total_steps
  FROM walk_entries
`;

const leaders = await sql`
  SELECT
    MIN(name) AS name,
    SUM(steps)::int AS steps,
    COUNT(*)::int AS entries
  FROM walk_entries
  GROUP BY LOWER(name)
  ORDER BY steps DESC, name ASC
  LIMIT 3
`;

await sql.end();

console.log(
  JSON.stringify(
    {
      ok: true,
      totalSteps: total[0].total_steps,
      topLeaders: leaders,
    },
    null,
    2,
  ),
);
