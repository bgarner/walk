# Walk Around The World

A playful shared step tracker for Vercel. Visitors enter a name and step count, the app stores the entry in Postgres, totals the group distance using `1 step = 1 meter`, and draws progress from Airdrie, Alberta on an OpenStreetMap-powered Leaflet map.

## Local setup

```bash
npm install
npm run dev
```

Set these environment variables in Vercel:

```bash
POSTGRES_URL=your_supabase_or_postgres_connection_string
```

The map does not require a browser API key. Shared persistence requires `POSTGRES_URL` or `DATABASE_URL`; without one of them, submissions are kept only in the current browser session. For Supabase on Vercel, use the pooled `POSTGRES_URL`.
