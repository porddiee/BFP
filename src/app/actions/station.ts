"use server";

import { getCurrentProfile } from "@/services/auth";
import { getUserStation } from "@/services/stations";
import { revalidatePath } from "next/cache";

// TODO: Implement station creation for station users in Phase 2
export async function createMyStationAction(formData: FormData) {
  return { error: "Station creation is currently disabled. Please contact an administrator." };
}

// TODO: Implement these actions in Phase 2
export async function addStationPersonnelAction(formData: FormData) {
  return { error: "Personnel management is currently disabled. Coming in Phase 2." };
}

export async function addStationEquipmentAction(formData: FormData) {
  return { error: "Equipment management is currently disabled. Coming in Phase 2." };
}

export async function addFireIncidentAction(formData: FormData) {
  return { error: "Fire incident reporting is currently disabled. Coming in Phase 2." };
}

export async function addEMSIncidentAction(formData: FormData) {
  return { error: "EMS incident reporting is currently disabled. Coming in Phase 2." };
}
