import { NextResponse } from "next/server";
import postgres from "postgres";

type StepEntry = {
  id: number;
  name: string;
  steps: number;
  created_at: string;
};

type Leader = {
  name: string;
  steps: number;
  entries: number;
};

let client: ReturnType<typeof postgres> | null = null;

function usableConnectionString(value: string | undefined) {
  if (!value || value === '""') {
    return null;
  }

  return value;
}

function getSql() {
  const connectionString =
    usableConnectionString(process.env.POSTGRES_URL) ??
    usableConnectionString(process.env.DATABASE_URL) ??
    usableConnectionString(process.env.POSTGRES_PRISMA_URL) ??
    usableConnectionString(process.env.POSTGRES_URL_NON_POOLING);

  if (!connectionString) {
    return null;
  }

  client ??= postgres(connectionString, {
    max: 1,
    prepare: false,
  });

  return client;
}

async function ensureTable() {
  const sql = getSql();
  if (!sql) {
    throw new Error("POSTGRES_URL is not configured.");
  }

  await sql`
    CREATE TABLE IF NOT EXISTS walk_entries (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      steps INTEGER NOT NULL CHECK (steps > 0),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

function cleanName(value: unknown) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 40);
}

function cleanSteps(value: unknown) {
  const steps = Number(value);
  if (!Number.isInteger(steps) || steps <= 0 || steps > 1000000) {
    return null;
  }

  return steps;
}

export async function GET() {
  try {
    const sql = getSql();
    if (!sql) {
      return NextResponse.json(
        { error: "Shared step data is not configured." },
        { status: 503 },
      );
    }

    await ensureTable();

    const entries = (await sql`
      SELECT id, name, steps, created_at
      FROM walk_entries
      ORDER BY created_at DESC, id DESC
      LIMIT 25
    `) as StepEntry[];

    const leaders = (await sql`
      SELECT
        LOWER(name) AS nickname_key,
        MIN(name) AS name,
        SUM(steps)::int AS steps,
        COUNT(*)::int AS entries
      FROM walk_entries
      GROUP BY nickname_key
      ORDER BY steps DESC, name ASC
      LIMIT 10
    `) as Leader[];

    const total = (await sql`
      SELECT COALESCE(SUM(steps), 0)::int AS total_steps
      FROM walk_entries
    `) as { total_steps: number }[];

    return NextResponse.json({
      entries,
      leaders,
      totalSteps: total[0]?.total_steps ?? 0,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Step data is not available right now." },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const sql = getSql();
    if (!sql) {
      return NextResponse.json(
        { error: "Shared step data is not configured." },
        { status: 503 },
      );
    }

    const body = await request.json();
    const name = cleanName(body.name);
    const steps = cleanSteps(body.steps);

    if (!name || steps === null) {
      return NextResponse.json(
        { error: "Please enter a name and a positive whole number of steps." },
        { status: 400 },
      );
    }

    await ensureTable();

    await sql`
      INSERT INTO walk_entries (name, steps)
      VALUES (${name}, ${steps})
    `;

    const total = (await sql`
      SELECT COALESCE(SUM(steps), 0)::int AS total_steps
      FROM walk_entries
    `) as { total_steps: number }[];

    return NextResponse.json({
      totalSteps: total[0]?.total_steps ?? steps,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not save those steps." },
      { status: 503 },
    );
  }
}
