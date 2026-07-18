import { getAllApplications, getStats } from "@/lib/queries";
import AddEntryForm from "@/app/components/AddEntryForm";
import EntryRow from "@/app/components/EntryRow";

export const dynamic = "force-dynamic";

export default function Home() {
  const apps = getAllApplications();
  const stats = getStats(apps);

  const tally: { label: string; value: number; color: string }[] = [
    { label: "Total", value: stats.total, color: "var(--parchment)" },
    { label: "Applied", value: stats.byStatus["Applied"] ?? 0, color: "var(--parchment-dim)" },
    { label: "Referral", value: stats.byStatus["Referral"] ?? 0, color: "var(--brass)" },
    { label: "Interviewing", value: stats.byStatus["Interviewing"] ?? 0, color: "var(--brass)" },
    { label: "Offer", value: stats.byStatus["Offer"] ?? 0, color: "var(--moss)" },
    { label: "Rejected", value: stats.byStatus["Rejected"] ?? 0, color: "var(--rust)" },
  ];

  return (
    <main className="flex-1 px-6 md:px-12 py-10 max-w-6xl mx-auto w-full">
      <header className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-6" style={{ borderBottom: "1px solid var(--line)" }}>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] mb-2" style={{ color: "var(--brass)" }}>
            Ledger No. 001
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold">
            Application Ledger
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--parchment-dim)" }}>
            Every company, every status, every referral — logged in one place.
          </p>
        </div>
        <div className="flex gap-6">
          {tally.map((t) => (
            <div key={t.label} className="text-right">
              <div className="font-display text-3xl" style={{ color: t.color }}>
                {t.value}
              </div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--parchment-dim)" }}>
                {t.label}
              </div>
            </div>
          ))}
        </div>
      </header>

      <section className="mb-10">
        <AddEntryForm />
      </section>

      <section>
        {apps.length === 0 ? (
          <div
            className="p-10 text-center rounded-sm"
            style={{ border: "1px dashed var(--line)", color: "var(--parchment-dim)" }}
          >
            No entries yet. Log your first application above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="text-left text-[10px] uppercase tracking-wider"
                  style={{ color: "var(--parchment-dim)", borderBottom: "1px solid var(--line)" }}
                >
                  <th className="py-2 pr-4 font-normal">Company / Role</th>
                  <th className="py-2 pr-4 font-normal">Applied</th>
                  <th className="py-2 pr-4 font-normal">Referral</th>
                  <th className="py-2 pr-4 font-normal">Notes</th>
                  <th className="py-2 pr-4 font-normal">Status</th>
                  <th className="py-2 font-normal"></th>
                </tr>
              </thead>
              <tbody>
                {apps.map((app) => (
                  <EntryRow key={app.id} app={app} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
