"use server";

import { getCurrentProfile } from "@/services/auth";
import { createStation, addStationMember } from "@/services/stations";
import { revalidatePath } from "next/cache";

/**
 * Create a new station (for approved station users)
 * Creates station with automatic approval and adds the creator as a member
 */
export async function createMyStationAction(formData: FormData) {
  try {
    const profile = await getCurrentProfile();

    if (!profile) {
      return { error: "You must be logged in to create a station.", success: false };
    }

    if (profile.approval_status !== "approved") {
      return { error: "Your account must be approved before creating a station.", success: false };
    }

    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const contact_number = formData.get("contact_number") as string;
    const email = formData.get("email") as string;
    const district = formData.get("district") as string;

    if (!name || !address) {
      return { error: "Station name and address are required.", success: false };
    }

    // Create the station with approved status
    const station = await createStation({
      name,
      address,
      contact_number: contact_number as string | null,
      email: email as string | null,
      district: district as string | null,
      is_active: true,
      created_by: profile.id,
      approval_status: "approved",
    });

    // Add the creator as a station member
    await addStationMember({
      profile_id: profile.id,
      station_id: station.id,
      position: "Station Commander",
      rank: "Chief",
      is_active: true,
    });

    revalidatePath("/stations");
    revalidatePath("/dashboard");

    return { success: true, stationId: station.id };
  } catch (error) {
    console.error("Station creation error:", error);
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
    }
    console.error("Error details:", errorMessage);
    return { error: `Failed to create station: ${errorMessage}`, success: false };
  }
}

// TODO: Implement these actions in Phase 2
export async function addStationPersonnelAction(formData: FormData) {
  return { error: "Personnel management is currently disabled. Coming in Phase 2.", success: false };
}

export async function addStationEquipmentAction(formData: FormData) {
  return { error: "Equipment management is currently disabled. Coming in Phase 2.", success: false };
}

export async function addFireIncidentAction(formData: FormData) {
  return { error: "Fire incident reporting is currently disabled. Coming in Phase 2.", success: false };
}

export async function addEMSIncidentAction(formData: FormData) {
  return { error: "EMS incident reporting is currently disabled. Coming in Phase 2.", success: false };
}
