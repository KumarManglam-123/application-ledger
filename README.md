# Application Ledger

A full-stack job application tracker built with Next.js App Router. Log
companies, roles, statuses, referrals, and notes; update status inline;
everything persists to a local SQLite database.

## Stack

- **Next.js 16** (App Router, Server Components, Server Actions)
- **TypeScript**
- **Tailwind CSS v4**
- **better-sqlite3** for persistence (synchronous, zero-config, file-based)

## Getting started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. The SQLite file is created automatically at
`data/applications.db` on first run.

## The hardest tradeoff I hit

I originally reached for Prisma, since it's the most common ORM pairing for
Next.js. But Prisma's CLI needs to download prebuilt query-engine binaries
from `binaries.prisma.sh` at `prisma generate` / `prisma init` time, and in a
network-restricted environment that download was blocked outright.

Rather than fight the tooling, I swapped to `better-sqlite3` — a native,
synchronous SQLite driver with no external binary fetch (it compiles from
source against Node's own toolchain). That traded away Prisma's schema
migrations and type-safe query builder for a smaller surface area: hand-written
SQL with `db.prepare(...).run(...)`.

That swap introduced a second, subtler problem. `better-sqlite3` opens a
single file handle per `new Database(...)` call. In Next.js dev mode, Fast
Refresh re-evaluates modules on every save — so without caching, every hot
reload would open a fresh connection to the same SQLite file. SQLite only
allows one writer at a time, so stale connections from previous reloads
started causing `SQLITE_BUSY: database is locked` errors under any concurrent
write.

The fix (in `lib/db.ts`) is to cache the connection on `globalThis`, the same
pattern Prisma's own docs recommend for dev mode, so Fast Refresh reuses the
existing handle instead of opening a new one:

```ts
export const db = global.__jobTrackerDb ?? new Database(dbPath);
if (process.env.NODE_ENV !== "production") {
  global.__jobTrackerDb = db;
}
db.pragma("journal_mode = WAL");
```

Switching to WAL (write-ahead logging) mode on top of that lets reads happen
concurrently with the occasional write instead of blocking on a single lock
file, which matters once there's real traffic hitting the table.

## What I'd change for production

Swap `better-sqlite3` for a hosted Postgres database via Drizzle or Prisma
(once binaries are reachable), which gives real migrations, connection
pooling, and multi-instance safety that a single SQLite file can't offer.
