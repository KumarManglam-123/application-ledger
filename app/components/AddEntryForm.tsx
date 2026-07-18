"use client";

import { useRef, useTransition } from "react";
import { addApplication } from "@/app/actions/applications";

const STATUSES = ["Applied", "Referral", "Interviewing", "Offer", "Rejected"];

export default function AddEntryForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      action={(formData) => {
        startTransition(async () => {
          await addApplication(formData);
          formRef.current?.reset();
        });
      }}
      className="grid grid-cols-1 md:grid-cols-6 gap-3 p-5 rounded-sm"
      style={{ background: "var(--ink-raised)", border: "1px solid var(--line)" }}
    >
      <div className="md:col-span-2 flex flex-col gap-1">
        <label className="text-xs uppercase tracking-wider" style={{ color: "var(--parchment-dim)" }}>
          Company
        </label>
        <input
          name="company"
          required
          placeholder="Creatr"
          className="bg-transparent border-b px-1 py-1.5 outline-none focus:border-[var(--brass)]"
          style={{ borderColor: "var(--line)" }}
        />
      </div>

      <div className="md:col-span-2 flex flex-col gap-1">
        <label className="text-xs uppercase tracking-wider" style={{ color: "var(--parchment-dim)" }}>
          Role
        </label>
        <input
          name="role"
          required
          placeholder="Full Stack Engineer"
          className="bg-transparent border-b px-1 py-1.5 outline-none focus:border-[var(--brass)]"
          style={{ borderColor: "var(--line)" }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs uppercase tracking-wider" style={{ color: "var(--parchment-dim)" }}>
          Status
        </label>
        <select
          name="status"
          defaultValue="Applied"
          className="bg-transparent border-b px-1 py-1.5 outline-none focus:border-[var(--brass)]"
          style={{ borderColor: "var(--line)" }}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s} className="bg-[var(--ink)]">
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs uppercase tracking-wider" style={{ color: "var(--parchment-dim)" }}>
          Applied
        </label>
        <input
          type="date"
          name="appliedDate"
          required
          defaultValue={new Date().toISOString().slice(0, 10)}
          className="bg-transparent border-b px-1 py-1.5 outline-none focus:border-[var(--brass)]"
          style={{ borderColor: "var(--line)" }}
        />
      </div>

      <div className="md:col-span-2 flex flex-col gap-1">
        <label className="text-xs uppercase tracking-wider" style={{ color: "var(--parchment-dim)" }}>
          Referral (optional)
        </label>
        <input
          name="referral"
          placeholder="Isha Jain"
          className="bg-transparent border-b px-1 py-1.5 outline-none focus:border-[var(--brass)]"
          style={{ borderColor: "var(--line)" }}
        />
      </div>

      <div className="md:col-span-2 flex flex-col gap-1">
        <label className="text-xs uppercase tracking-wider" style={{ color: "var(--parchment-dim)" }}>
          Job URL (optional)
        </label>
        <input
          name="url"
          placeholder="https://..."
          className="bg-transparent border-b px-1 py-1.5 outline-none focus:border-[var(--brass)]"
          style={{ borderColor: "var(--line)" }}
        />
      </div>

      <div className="md:col-span-2 flex flex-col gap-1">
        <label className="text-xs uppercase tracking-wider" style={{ color: "var(--parchment-dim)" }}>
          Notes (optional)
        </label>
        <input
          name="notes"
          placeholder="Take-home due Friday"
          className="bg-transparent border-b px-1 py-1.5 outline-none focus:border-[var(--brass)]"
          style={{ borderColor: "var(--line)" }}
        />
      </div>

      <div className="md:col-span-6 flex justify-end pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 text-sm tracking-wide uppercase rounded-sm transition-colors disabled:opacity-50"
          style={{ background: "var(--brass)", color: "var(--ink)" }}
        >
          {isPending ? "Logging…" : "Log entry"}
        </button>
      </div>
    </form>
  );
}
