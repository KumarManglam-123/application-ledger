"use server";

import { revalidatePath } from "next/cache";
import {
  createApplication,
  deleteApplication,
  updateStatus,
} from "@/lib/queries";
import { Application } from "@/lib/db";

export async function addApplication(formData: FormData) {
  const company = String(formData.get("company") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const status = String(
    formData.get("status") ?? "Applied"
  ) as Application["status"];
  const appliedDate = String(formData.get("appliedDate") ?? "");
  const referral = String(formData.get("referral") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const url = String(formData.get("url") ?? "").trim() || null;

  if (!company || !role || !appliedDate) {
    throw new Error("Company, role, and applied date are required.");
  }

  createApplication({
    company,
    role,
    status,
    appliedDate,
    referral,
    notes,
    url,
  });

  revalidatePath("/");
}

export async function changeStatus(id: number, status: Application["status"]) {
  updateStatus(id, status);
  revalidatePath("/");
}

export async function removeApplication(id: number) {
  deleteApplication(id);
  revalidatePath("/");
}
