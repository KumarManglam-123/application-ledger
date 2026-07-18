"use client";

import { useTransition } from "react";
import { changeStatus, removeApplication } from "@/app/actions/applications";
import { Application } from "@/lib/db";

const STATUSES: Application["status"][] = [
  "Applied",
  "Referral",
  "Interviewing",
  "Offer",
  "Rejected",
];

const STATUS_COLOR: Record<Application["status"], string> = {
  Applied: "var(--parchment-dim)",
  Referral: "var(--brass)",
  Interviewing: "var(--brass)",
  Offer: "var(--moss)",
  Rejected: "var(--rust)",
};

export default function EntryRow({ app }: { app: Application }) {
  const [isPending, startTransition] = useTransition();

  return (
    <tr
      className="border-b transition-opacity"
      style={{ borderColor: "var(--line)", opacity: isPending ? 0.5 : 1 }}
    >
      <td className="py-3 pr-4 align-top">
        <div className="font-display text-lg leading-tight">{app.company}</div>
        <div className="text-xs" style={{ color: "var(--parchment-dim)" }}>
          {app.role}
        </div>
      </td>
      <td className="py-3 pr-4 align-top whitespace-nowrap">{app.appliedDate}</td>
      <td className="py-3 pr-4 align-top">
        {app.referral ? app.referral : <span style={{ color: "var(--parchment-dim)" }}>—</span>}
      </td>
      <td className="py-3 pr-4 align-top max-w-[220px] truncate">
        {app.notes ? app.notes : <span style={{ color: "var(--parchment-dim)" }}>—</span>}
      </td>
      <td className="py-3 pr-4 align-top">
        <select
          value={app.status}
          onChange={(e) =>
            startTransition(() =>
              changeStatus(app.id, e.target.value as Application["status"])
            )
          }
          className="bg-transparent border rounded-sm px-2 py-1 text-xs uppercase tracking-wide outline-none"
          style={{ borderColor: STATUS_COLOR[app.status], color: STATUS_COLOR[app.status] }}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s} className="bg-[var(--ink)] text-[var(--parchment)]">
              {s}
            </option>
          ))}
        </select>
      </td>
      <td className="py-3 align-top text-right">
        <button
          onClick={() => startTransition(() => removeApplication(app.id))}
          className="text-xs uppercase tracking-wide opacity-60 hover:opacity-100"
          style={{ color: "var(--rust)" }}
        >
          Remove
        </button>
      </td>
    </tr>
  );
}
