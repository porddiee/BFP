"use server";

import { getCurrentProfile } from "@/services/auth";
import { createStationForUser, getUserStation } from "@/services/stations";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function createMyStationAction(formData: FormData) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return { error: "Authentication required" };
    }

    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const district = formData.get("district") as string;
    const contact_number = formData.get("contact_number") as string;
    const email = formData.get("email") as string;

    if (!name || !address) {
      return { error: "Station name and address are required" };
    }

    const station = await createStationForUser(profile.id, {
      name,
      address,
      district: district || "Surigao del Norte",
      contact_number: contact_number || profile.contact_number,
      email: email || profile.email,
    });

    revalidatePath("/stations");
    revalidatePath("/dashboard");
    revalidatePath("/bfp");
    return { success: true, stationId: station.id };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create station" };
  }
}

export async function addStationPersonnelAction(formData: FormData) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) return { error: "Authentication required" };

    if (profile.role === "admin") {
      return { error: "Regional Admin has read-only oversight and cannot add station personnel." };
    }

    const stationId = formData.get("stationId") as string;
    const firstName = formData.get("first_name") as string;
    const lastName = formData.get("last_name") as string;
    const rank = formData.get("rank") as string;
    const position = formData.get("position") as string;
    const email = formData.get("email") as string;
    const contact = formData.get("contact_number") as string;

    if (!stationId || !firstName || !lastName) {
      return { error: "Personnel name is required" };
    }

    // Verify ownership: user must be assigned to this station
    const userStation = await getUserStation(profile.id);
    if (!userStation || userStation.id !== stationId) {
      return { error: "Unauthorized: You can only add personnel to your own station." };
    }

    const supabase = createAdminClient();

    // Create a profile record for this personnel member
    const { data: newProfile, error: profErr } = await supabase
      .from("profiles")
      .insert({
        user_id: `officer-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        first_name: firstName,
        last_name: lastName,
        email: email || `officer.${firstName.toLowerCase()}@bfp.gov.ph`,
        contact_number: contact || "0917-000-0000",
        role: "station_user",
        approval_status: "approved",
      })
      .select()
      .single();

    if (profErr) {
      console.warn("Profile insert warning:", profErr.message);
    }

    // Link into station_members
    const { error: memberErr } = await supabase.from("station_members").insert({
      profile_id: newProfile ? newProfile.id : profile.id,
      station_id: stationId,
      position: position || "Firefighter / Rescuer",
      rank: rank || "Fire Officer 1",
      is_active: true,
    });

    if (memberErr) {
      return { error: memberErr.message };
    }

    revalidatePath(`/stations/${stationId}/personnel`);
    revalidatePath("/stations");
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to add personnel" };
  }
}

export async function addStationEquipmentAction(formData: FormData) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) return { error: "Authentication required" };

    if (profile.role === "admin") {
      return { error: "Regional Admin has read-only oversight and cannot add station equipment." };
    }

    const stationId = formData.get("stationId") as string;
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const serialNumber = formData.get("serial_number") as string;
    const status = (formData.get("status") as string) || "operational";

    if (!stationId || !name) {
      return { error: "Equipment name is required" };
    }

    // Verify ownership: user must be assigned to this station
    const userStation = await getUserStation(profile.id);
    if (!userStation || userStation.id !== stationId) {
      return { error: "Unauthorized: You can only add equipment to your own station." };
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("equipment").insert({
      station_id: stationId,
      name,
      type: type || "Fire Apparatus",
      serial_number: serialNumber || "BFP-SRG-GEN",
      status: status as any,
    });

    if (error) {
      return { error: error.message };
    }

    revalidatePath(`/stations/${stationId}/equipment`);
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to add equipment" };
  }
}

export async function addFireIncidentAction(formData: FormData) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) return { error: "Authentication required" };

    if (profile.role === "admin") {
      return { error: "Regional Admin has read-only oversight and cannot report fire incidents for stations." };
    }

    const stationId = formData.get("stationId") as string;
    const incidentType = formData.get("incident_type") as string;
    const location = formData.get("location") as string;
    const description = formData.get("description") as string;
    const severity = (formData.get("severity") as string) || "medium";

    if (!stationId || !incidentType || !location) {
      return { error: "Incident type and location are required" };
    }

    // Verify ownership: user must be assigned to this station
    const userStation = await getUserStation(profile.id);
    if (!userStation || userStation.id !== stationId) {
      return { error: "Unauthorized: You can only report fire incidents for your own station." };
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("fire_incidents").insert({
      station_id: stationId,
      incident_type: incidentType,
      location,
      description,
      severity: severity as any,
      status: "active",
      reported_at: new Date().toISOString(),
    });

    if (error) return { error: error.message };

    revalidatePath(`/bfp/fire-incidents/${stationId}`);
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to log fire incident" };
  }
}

export async function addEMSIncidentAction(formData: FormData) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) return { error: "Authentication required" };

    if (profile.role === "admin") {
      return { error: "Regional Admin has read-only oversight and cannot log EMS dispatches for stations." };
    }

    const stationId = formData.get("stationId") as string;
    const incidentType = formData.get("incident_type") as string;
    const location = formData.get("location") as string;
    const description = formData.get("description") as string;
    const severity = (formData.get("severity") as string) || "medium";

    if (!stationId || !incidentType || !location) {
      return { error: "Incident type and location are required" };
    }

    // Verify ownership: user must be assigned to this station
    const userStation = await getUserStation(profile.id);
    if (!userStation || userStation.id !== stationId) {
      return { error: "Unauthorized: You can only log EMS dispatches for your own station." };
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("ems_incidents").insert({
      station_id: stationId,
      incident_type: incidentType,
      location,
      description,
      severity: severity as any,
      status: "active",
      reported_at: new Date().toISOString(),
    });

    if (error) return { error: error.message };

    revalidatePath(`/bfp/ems/${stationId}`);
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to log EMS incident" };
  }
}
