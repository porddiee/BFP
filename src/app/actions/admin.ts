"use server";

import { approveProfile, rejectProfile, getCurrentProfile } from "@/services/auth";
import { revalidatePath } from "next/cache";

export async function approveRegistrationAction(profileId: string) {
  try {
    const current = await getCurrentProfile();
    if (!current || current.role !== "admin") {
      return { error: "Unauthorized: Only Regional Admin can approve stations and personnel." };
    }

    await approveProfile(profileId);
    revalidatePath("/admin/registrations");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to approve profile" };
  }
}

export async function rejectRegistrationAction(profileId: string) {
  try {
    const current = await getCurrentProfile();
    if (!current || current.role !== "admin") {
      return { error: "Unauthorized: Only Regional Admin can reject registrations." };
    }

    await rejectProfile(profileId);
    revalidatePath("/admin/registrations");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to reject profile" };
  }
}
