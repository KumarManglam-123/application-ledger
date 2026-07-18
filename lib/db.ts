import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// better-sqlite3 is a native, synchronous module. In Next.js dev mode, every
// Fast Refresh re-evaluates this module, which would normally open a brand
// new file handle to the same SQLite file each time. Left unchecked that
// leads to "database is locked" errors under concurrent writes, because
// SQLite only allows one writer connection at a time and stale handles from
// previous reloads don't get closed. We cache a single connection on
// `globalThis` (the same trick Prisma's own docs recommend for dev mode) so
// Fast Refresh reuses the existing handle instead of opening a new one.
declare global {
  // eslint-disable-next-line no-var
  var __jobTrackerDb: Database.Database | undefined;
}

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "applications.db");

export const db = global.__jobTrackerDb ?? new Database(dbPath);

if (process.env.NODE_ENV !== "production") {
  global.__jobTrackerDb = db;
}

// WAL mode lets reads happen concurrently with the occasional write instead
// of blocking on a single lock file — matters once this has real traffic.
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Applied',
    appliedDate TEXT NOT NULL,
    referral TEXT,
    notes TEXT,
    url TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

export type Application = {
  id: number;
  company: string;
  role: string;
  status: "Applied" | "Referral" | "Interviewing" | "Offer" | "Rejected";
  appliedDate: string;
  referral: string | null;
  notes: string | null;
  url: string | null;
  createdAt: string;
};
