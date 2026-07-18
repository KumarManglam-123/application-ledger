import { db, Application } from "./db";

export function getAllApplications(): Application[] {
  return db
    .prepare("SELECT * FROM applications ORDER BY appliedDate DESC, id DESC")
    .all() as Application[];
}

export function createApplication(input: {
  company: string;
  role: string;
  status: Application["status"];
  appliedDate: string;
  referral: string | null;
  notes: string | null;
  url: string | null;
}) {
  const stmt = db.prepare(`
    INSERT INTO applications (company, role, status, appliedDate, referral, notes, url)
    VALUES (@company, @role, @status, @appliedDate, @referral, @notes, @url)
  `);
  return stmt.run(input);
}

export function updateStatus(id: number, status: Application["status"]) {
  return db
    .prepare("UPDATE applications SET status = ? WHERE id = ?")
    .run(status, id);
}

export function deleteApplication(id: number) {
  return db.prepare("DELETE FROM applications WHERE id = ?").run(id);
}

export function getStats(apps: Application[]) {
  const total = apps.length;
  const byStatus = apps.reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] ?? 0) + 1;
    return acc;
  }, {});
  return { total, byStatus };
}
