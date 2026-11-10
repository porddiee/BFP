"use server";

import { getCurrentProfile } from "@/services/auth";
import { createStation, addStationMember, getStationById } from "@/services/stations";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

/**
 * Helper to verify that the current user is an authorized owner of the station.
 * Only the owner / assigned member of the station can perform modifications.
 */
export async function verifyStationOwner(stationId: string) {
  const profile = await getCurrentProfile();

  if (!profile) {
    return {
      authorized: false,
      error: "You must be signed in to perform this action.",
      profile: null,
      adminSupabase: null,
    };
  }

  const station = await getStationById(stationId);
  if (!station) {
    return {
      authorized: false,
      error: "Station not found.",
      profile,
      adminSupabase: null,
    };
  }

  const adminSupabase = createAdminClient();

  // Check 1: User created this station
  const isCreator = station.created_by === profile.id;

  // Check 2: User is an active enrolled member of this station
  const { data: member } = await adminSupabase
    .from("station_members")
    .select("id, station_id, position")
    .eq("profile_id", profile.id)
    .eq("station_id", stationId)
    .eq("is_active", true)
    .maybeSingle();

  const isMember = !!member;

  if (!isCreator && !isMember) {
    return {
      authorized: false,
      error: "Access Denied: Only the owner or designated personnel of this station can perform this operation.",
      profile,
      adminSupabase,
    };
  }

  return {
    authorized: true,
    error: null,
    profile,
    station,
    adminSupabase,
  };
}

/**
 * Helper to trigger cache revalidations across all related dashboard and station pages
 */
function revalidateStationPaths(stationId: string) {
  try {
    revalidatePath(`/stations/${stationId}`);
    revalidatePath(`/stations/${stationId}/personnel`);
    revalidatePath(`/stations/${stationId}/equipment`);
    revalidatePath(`/bfp/fire-incidents/${stationId}`);
    revalidatePath(`/bfp/ems/${stationId}`);
    revalidatePath("/stations");
    revalidatePath("/dashboard");
    revalidatePath("/administrative-updates");
    revalidatePath("/bfp");
  } catch (err) {
    console.warn("Path revalidation warning:", err);
  }
}

/**
 * Create a new station (for approved station users)
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

    const station = await createStation({
      name,
      address,
      contact_number: contact_number || null,
      email: email || null,
      district: district || null,
      is_active: true,
      created_by: profile.id,
      approval_status: "approved",
    });

    await addStationMember({
      profile_id: profile.id,
      station_id: station.id,
      position: "Station Commander",
      rank: "Senior Inspector",
      is_active: true,
    });

    revalidateStationPaths(station.id);
    return { success: true, stationId: station.id };
  } catch (error) {
    console.error("Station creation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create station";
    return { error: errorMessage, success: false };
  }
}

// =========================================================================
// 1. PERSONNEL MANAGEMENT (CRUD - Owner Only)
// =========================================================================

/**
 * Add / Enroll new personnel to station
 */
export async function addStationPersonnelAction(formData: FormData) {
  try {
    const stationId = formData.get("stationId") as string;
    if (!stationId) {
      return { error: "Station ID is required.", success: false };
    }

    const authCheck = await verifyStationOwner(stationId);
    if (!authCheck.authorized || !authCheck.adminSupabase) {
      return { error: authCheck.error || "Unauthorized", success: false };
    }

    const firstName = (formData.get("first_name") as string || "").trim();
    const lastName = (formData.get("last_name") as string || "").trim();
    const rank = (formData.get("rank") as string || "Fire Officer 1").trim();
    const rawPosition = (formData.get("position") as string || "Firefighter / EMS").trim();
    const shift = (formData.get("shift") as string || "").trim();
    const contactNumber = (formData.get("contact_number") as string || "").trim();
    const rawEmail = (formData.get("email") as string || "").trim().toLowerCase();

    // Format position with assigned shift/schedule
    const cleanPos = rawPosition.split(" • Shift ")[0].split(" [Shift ")[0];
    const position = shift ? `${cleanPos} • ${shift}` : cleanPos;

    if (!firstName || !lastName) {
      return { error: "First and last name are required.", success: false };
    }

    const adminSupabase = authCheck.adminSupabase;
    const email = rawEmail || `${firstName.toLowerCase().replace(/[^a-z0-9]/g, "")}.${lastName.toLowerCase().replace(/[^a-z0-9]/g, "")}.${stationId.slice(0, 4)}@bfp.local`;

    // 1. Check if profile already exists for this email
    const { data: existingProfile } = await adminSupabase
      .from("profiles")
      .select("id, user_id")
      .eq("email", email)
      .maybeSingle();

    let profileId: string;

    if (existingProfile) {
      profileId = existingProfile.id;
      await adminSupabase.from("profiles").update({
        first_name: firstName,
        last_name: lastName,
        contact_number: contactNumber || null,
      }).eq("id", profileId);
    } else {
      // Create auth user
      const { data: authData, error: authErr } = await adminSupabase.auth.admin.createUser({
        email,
        password: `Bfp${Math.random().toString(36).slice(-8)}!A1`,
        email_confirm: true,
      });

      if (authErr) {
        return { error: `Failed to create auth identity: ${authErr.message}`, success: false };
      }

      // Create profile
      const { data: newProfile, error: profErr } = await adminSupabase
        .from("profiles")
        .insert({
          user_id: authData.user.id,
          first_name: firstName,
          last_name: lastName,
          email,
          contact_number: contactNumber || null,
          role: "station_user",
          approval_status: "approved",
        })
        .select()
        .single();

      if (profErr) {
        return { error: `Failed to create profile: ${profErr.message}`, success: false };
      }

      profileId = newProfile.id;
    }

    // 2. Check if already member
    const { data: existingMember } = await adminSupabase
      .from("station_members")
      .select("id, is_active")
      .eq("profile_id", profileId)
      .eq("station_id", stationId)
      .maybeSingle();

    if (existingMember) {
      await adminSupabase
        .from("station_members")
        .update({
          rank,
          position,
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingMember.id);
    } else {
      const { error: memberErr } = await adminSupabase.from("station_members").insert({
        profile_id: profileId,
        station_id: stationId,
        rank,
        position,
        is_active: true,
      });

      if (memberErr) {
        return { error: `Failed to register station membership: ${memberErr.message}`, success: false };
      }
    }

    revalidateStationPaths(stationId);
    return { success: true };
  } catch (err) {
    console.error("addStationPersonnelAction error:", err);
    return { error: err instanceof Error ? err.message : "Failed to add personnel", success: false };
  }
}

/**
 * Edit / Update station personnel details
 */
export async function updateStationPersonnelAction(formData: FormData) {
  try {
    const stationId = formData.get("stationId") as string;
    const memberId = formData.get("memberId") as string;
    const profileId = formData.get("profileId") as string;

    if (!stationId || !memberId) {
      return { error: "Station ID and Member ID are required.", success: false };
    }

    const authCheck = await verifyStationOwner(stationId);
    if (!authCheck.authorized || !authCheck.adminSupabase) {
      return { error: authCheck.error || "Unauthorized", success: false };
    }

    const firstName = (formData.get("first_name") as string || "").trim();
    const lastName = (formData.get("last_name") as string || "").trim();
    const rank = (formData.get("rank") as string || "Fire Officer 1").trim();
    const rawPosition = (formData.get("position") as string || "").trim();
    const shift = (formData.get("shift") as string || "").trim();
    const contactNumber = (formData.get("contact_number") as string || "").trim();
    const email = (formData.get("email") as string || "").trim().toLowerCase();

    // Format position with assigned shift/schedule
    const cleanPos = rawPosition.split(" • Shift ")[0].split(" [Shift ")[0];
    const position = shift ? `${cleanPos} • ${shift}` : cleanPos;

    const adminSupabase = authCheck.adminSupabase;

    // Update station_member table
    const { error: memberErr } = await adminSupabase
      .from("station_members")
      .update({
        rank,
        position,
        updated_at: new Date().toISOString(),
      })
      .eq("id", memberId)
      .eq("station_id", stationId);

    if (memberErr) {
      return { error: `Failed to update duty role: ${memberErr.message}`, success: false };
    }

    // Update profile if profileId provided
    if (profileId) {
      const updates: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };
      if (firstName) updates.first_name = firstName;
      if (lastName) updates.last_name = lastName;
      if (contactNumber) updates.contact_number = contactNumber;
      if (email) updates.email = email;

      await adminSupabase.from("profiles").update(updates).eq("id", profileId);
    }

    revalidateStationPaths(stationId);
    return { success: true };
  } catch (err) {
    console.error("updateStationPersonnelAction error:", err);
    return { error: err instanceof Error ? err.message : "Failed to update personnel", success: false };
  }
}

/**
 * Remove / Delete personnel from station (Soft-delete)
 */
export async function deleteStationPersonnelAction(formData: FormData) {
  try {
    const stationId = formData.get("stationId") as string;
    const memberId = formData.get("memberId") as string;

    if (!stationId || !memberId) {
      return { error: "Station ID and Member ID are required.", success: false };
    }

    const authCheck = await verifyStationOwner(stationId);
    if (!authCheck.authorized || !authCheck.adminSupabase) {
      return { error: authCheck.error || "Unauthorized", success: false };
    }

    const adminSupabase = authCheck.adminSupabase;

    const { error: delErr } = await adminSupabase
      .from("station_members")
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", memberId)
      .eq("station_id", stationId);

    if (delErr) {
      return { error: `Failed to remove personnel: ${delErr.message}`, success: false };
    }

    revalidateStationPaths(stationId);
    return { success: true };
  } catch (err) {
    console.error("deleteStationPersonnelAction error:", err);
    return { error: err instanceof Error ? err.message : "Failed to remove personnel", success: false };
  }
}

// =========================================================================
// 2. EQUIPMENT MANAGEMENT (CRUD - Owner Only)
// =========================================================================

/**
 * Add apparatus or equipment to station
 */
export async function addStationEquipmentAction(formData: FormData) {
  try {
    const stationId = formData.get("stationId") as string;
    if (!stationId) {
      return { error: "Station ID is required.", success: false };
    }

    const authCheck = await verifyStationOwner(stationId);
    if (!authCheck.authorized || !authCheck.adminSupabase) {
      return { error: authCheck.error || "Unauthorized", success: false };
    }

    const name = (formData.get("name") as string || "").trim();
    const type = (formData.get("type") as string || "Fire Truck").trim();
    const serialNumber = (formData.get("serial_number") as string || "").trim();
    const status = (formData.get("status") as string || "operational").trim();
    const acquisitionDate = (formData.get("acquisition_date") as string || new Date().toISOString().split("T")[0]).trim();

    if (!name) {
      return { error: "Equipment name is required.", success: false };
    }

    const adminSupabase = authCheck.adminSupabase;

    const { error: insErr } = await adminSupabase.from("equipment").insert({
      station_id: stationId,
      name,
      type,
      serial_number: serialNumber || "NO-PLATE",
      status: status as any,
      acquisition_date: acquisitionDate,
    });

    if (insErr) {
      return { error: `Failed to insert equipment: ${insErr.message}`, success: false };
    }

    revalidateStationPaths(stationId);
    return { success: true };
  } catch (err) {
    console.error("addStationEquipmentAction error:", err);
    return { error: err instanceof Error ? err.message : "Failed to add equipment", success: false };
  }
}

/**
 * Update station equipment / apparatus
 */
export async function updateStationEquipmentAction(formData: FormData) {
  try {
    const stationId = formData.get("stationId") as string;
    const equipmentId = formData.get("equipmentId") as string;

    if (!stationId || !equipmentId) {
      return { error: "Station ID and Equipment ID are required.", success: false };
    }

    const authCheck = await verifyStationOwner(stationId);
    if (!authCheck.authorized || !authCheck.adminSupabase) {
      return { error: authCheck.error || "Unauthorized", success: false };
    }

    const name = (formData.get("name") as string || "").trim();
    const type = (formData.get("type") as string || "").trim();
    const serialNumber = (formData.get("serial_number") as string || "").trim();
    const status = (formData.get("status") as string || "").trim();
    const acquisitionDate = (formData.get("acquisition_date") as string || "").trim();

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (name) updates.name = name;
    if (type) updates.type = type;
    if (serialNumber) updates.serial_number = serialNumber;
    if (status) updates.status = status;
    if (acquisitionDate) updates.acquisition_date = acquisitionDate;

    const adminSupabase = authCheck.adminSupabase;

    const { error: updErr } = await adminSupabase
      .from("equipment")
      .update(updates)
      .eq("id", equipmentId)
      .eq("station_id", stationId);

    if (updErr) {
      return { error: `Failed to update equipment: ${updErr.message}`, success: false };
    }

    revalidateStationPaths(stationId);
    return { success: true };
  } catch (err) {
    console.error("updateStationEquipmentAction error:", err);
    return { error: err instanceof Error ? err.message : "Failed to update equipment", success: false };
  }
}

/**
 * Delete equipment from station
 */
export async function deleteStationEquipmentAction(formData: FormData) {
  try {
    const stationId = formData.get("stationId") as string;
    const equipmentId = formData.get("equipmentId") as string;

    if (!stationId || !equipmentId) {
      return { error: "Station ID and Equipment ID are required.", success: false };
    }

    const authCheck = await verifyStationOwner(stationId);
    if (!authCheck.authorized || !authCheck.adminSupabase) {
      return { error: authCheck.error || "Unauthorized", success: false };
    }

    const adminSupabase = authCheck.adminSupabase;

    const { error: delErr } = await adminSupabase
      .from("equipment")
      .delete()
      .eq("id", equipmentId)
      .eq("station_id", stationId);

    if (delErr) {
      return { error: `Failed to delete equipment: ${delErr.message}`, success: false };
    }

    revalidateStationPaths(stationId);
    return { success: true };
  } catch (err) {
    console.error("deleteStationEquipmentAction error:", err);
    return { error: err instanceof Error ? err.message : "Failed to delete equipment", success: false };
  }
}

// =========================================================================
// 3. INCIDENT REPORTING (Fire & EMS Submissions - Owner Only)
// =========================================================================

/**
 * Report a new Fire Incident
 */
export async function addFireIncidentAction(formData: FormData) {
  try {
    const stationId = formData.get("stationId") as string;
    if (!stationId) {
      return { error: "Station ID is required.", success: false };
    }

    const authCheck = await verifyStationOwner(stationId);
    if (!authCheck.authorized || !authCheck.adminSupabase) {
      return { error: authCheck.error || "Unauthorized", success: false };
    }

    const incidentType = (formData.get("incident_type") as string || "").trim();
    const location = (formData.get("location") as string || "").trim();
    const severity = (formData.get("severity") as string || "medium").trim();
    const apparatus = (formData.get("apparatus") as string || "").trim();
    const rawDescription = (formData.get("description") as string || "").trim();
    const status = (formData.get("status") as string || "active").trim();

    if (!incidentType || !location) {
      return { error: "Incident type and location are required.", success: false };
    }

    const description = apparatus
      ? `[Responding Fleet: ${apparatus}] ${rawDescription}`
      : rawDescription;

    const adminSupabase = authCheck.adminSupabase;

    const { error: insErr } = await adminSupabase.from("fire_incidents").insert({
      station_id: stationId,
      incident_type: incidentType,
      location,
      severity: severity as any,
      description,
      status: status as any,
      reported_at: new Date().toISOString(),
    });

    if (insErr) {
      return { error: `Failed to log fire incident: ${insErr.message}`, success: false };
    }

    revalidateStationPaths(stationId);
    return { success: true };
  } catch (err) {
    console.error("addFireIncidentAction error:", err);
    return { error: err instanceof Error ? err.message : "Failed to report fire incident", success: false };
  }
}

/**
 * Update Fire Incident Status (e.g., mark as resolved)
 */
export async function updateFireIncidentStatusAction(formData: FormData) {
  try {
    const stationId = formData.get("stationId") as string;
    const incidentId = formData.get("incidentId") as string;
    const status = (formData.get("status") as string || "resolved").trim();

    if (!stationId || !incidentId) {
      return { error: "Station ID and Incident ID are required.", success: false };
    }

    const authCheck = await verifyStationOwner(stationId);
    if (!authCheck.authorized || !authCheck.adminSupabase) {
      return { error: authCheck.error || "Unauthorized", success: false };
    }

    const adminSupabase = authCheck.adminSupabase;

    const updates: Record<string, any> = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (status === "resolved") {
      updates.resolved_at = new Date().toISOString();
    }

    const { error: updErr } = await adminSupabase
      .from("fire_incidents")
      .update(updates)
      .eq("id", incidentId)
      .eq("station_id", stationId);

    if (updErr) {
      return { error: `Failed to update incident: ${updErr.message}`, success: false };
    }

    revalidateStationPaths(stationId);
    return { success: true };
  } catch (err) {
    console.error("updateFireIncidentStatusAction error:", err);
    return { error: err instanceof Error ? err.message : "Failed to update incident", success: false };
  }
}

/**
 * Delete Fire Incident
 */
export async function deleteFireIncidentAction(formData: FormData) {
  try {
    const stationId = formData.get("stationId") as string;
    const incidentId = formData.get("incidentId") as string;

    if (!stationId || !incidentId) {
      return { error: "Station ID and Incident ID are required.", success: false };
    }

    const authCheck = await verifyStationOwner(stationId);
    if (!authCheck.authorized || !authCheck.adminSupabase) {
      return { error: authCheck.error || "Unauthorized", success: false };
    }

    const adminSupabase = authCheck.adminSupabase;

    const { error: delErr } = await adminSupabase
      .from("fire_incidents")
      .delete()
      .eq("id", incidentId)
      .eq("station_id", stationId);

    if (delErr) {
      return { error: `Failed to delete incident: ${delErr.message}`, success: false };
    }

    revalidateStationPaths(stationId);
    return { success: true };
  } catch (err) {
    console.error("deleteFireIncidentAction error:", err);
    return { error: err instanceof Error ? err.message : "Failed to delete incident", success: false };
  }
}

/**
 * Report a new EMS Incident / Medical Run
 */
export async function addEMSIncidentAction(formData: FormData) {
  try {
    const stationId = formData.get("stationId") as string;
    if (!stationId) {
      return { error: "Station ID is required.", success: false };
    }

    const authCheck = await verifyStationOwner(stationId);
    if (!authCheck.authorized || !authCheck.adminSupabase) {
      return { error: authCheck.error || "Unauthorized", success: false };
    }

    const incidentType = (formData.get("incident_type") as string || "").trim();
    const location = (formData.get("location") as string || "").trim();
    const severity = (formData.get("severity") as string || "medium").trim();
    const hospital = (formData.get("hospital") as string || "").trim();
    const rawDescription = (formData.get("description") as string || "").trim();
    const status = (formData.get("status") as string || "active").trim();

    if (!incidentType || !location) {
      return { error: "Medical call type and location are required.", success: false };
    }

    const description = hospital
      ? `[Receiving Facility: ${hospital}] ${rawDescription}`
      : rawDescription;

    const adminSupabase = authCheck.adminSupabase;

    const { error: insErr } = await adminSupabase.from("ems_incidents").insert({
      station_id: stationId,
      incident_type: incidentType,
      location,
      severity: severity as any,
      description,
      status: status as any,
      reported_at: new Date().toISOString(),
    });

    if (insErr) {
      return { error: `Failed to log EMS dispatch: ${insErr.message}`, success: false };
    }

    revalidateStationPaths(stationId);
    return { success: true };
  } catch (err) {
    console.error("addEMSIncidentAction error:", err);
    return { error: err instanceof Error ? err.message : "Failed to log EMS incident", success: false };
  }
}

/**
 * Update EMS Incident Status
 */
export async function updateEMSIncidentStatusAction(formData: FormData) {
  try {
    const stationId = formData.get("stationId") as string;
    const incidentId = formData.get("incidentId") as string;
    const status = (formData.get("status") as string || "resolved").trim();

    if (!stationId || !incidentId) {
      return { error: "Station ID and Incident ID are required.", success: false };
    }

    const authCheck = await verifyStationOwner(stationId);
    if (!authCheck.authorized || !authCheck.adminSupabase) {
      return { error: authCheck.error || "Unauthorized", success: false };
    }

    const adminSupabase = authCheck.adminSupabase;

    const updates: Record<string, any> = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (status === "resolved") {
      updates.resolved_at = new Date().toISOString();
    }

    const { error: updErr } = await adminSupabase
      .from("ems_incidents")
      .update(updates)
      .eq("id", incidentId)
      .eq("station_id", stationId);

    if (updErr) {
      return { error: `Failed to update EMS record: ${updErr.message}`, success: false };
    }

    revalidateStationPaths(stationId);
    return { success: true };
  } catch (err) {
    console.error("updateEMSIncidentStatusAction error:", err);
    return { error: err instanceof Error ? err.message : "Failed to update EMS incident", success: false };
  }
}

/**
 * Delete EMS Incident
 */
export async function deleteEMSIncidentAction(formData: FormData) {
  try {
    const stationId = formData.get("stationId") as string;
    const incidentId = formData.get("incidentId") as string;

    if (!stationId || !incidentId) {
      return { error: "Station ID and Incident ID are required.", success: false };
    }

    const authCheck = await verifyStationOwner(stationId);
    if (!authCheck.authorized || !authCheck.adminSupabase) {
      return { error: authCheck.error || "Unauthorized", success: false };
    }

    const adminSupabase = authCheck.adminSupabase;

    const { error: delErr } = await adminSupabase
      .from("ems_incidents")
      .delete()
      .eq("id", incidentId)
      .eq("station_id", stationId);

    if (delErr) {
      return { error: `Failed to delete EMS incident: ${delErr.message}`, success: false };
    }

    revalidateStationPaths(stationId);
    return { success: true };
  } catch (err) {
    console.error("deleteEMSIncidentAction error:", err);
    return { error: err instanceof Error ? err.message : "Failed to delete EMS record", success: false };
  }
}

// =========================================================================
// 4. DUTY SCHEDULING (Weekly Shift Scheduling & Daily Duty)
// =========================================================================

/**
 * Persist updated shift schedule for a station's personnel roster
 */
export async function updateDutyScheduleAction(formData: FormData) {
  try {
    const stationId = formData.get("stationId") as string;
    const schedulePayload = formData.get("schedulePayload") as string;

    if (!stationId || !schedulePayload) {
      return { error: "Station ID and schedule payload are required.", success: false };
    }

    const authCheck = await verifyStationOwner(stationId);
    if (!authCheck.authorized || !authCheck.adminSupabase) {
      return { error: authCheck.error || "Unauthorized", success: false };
    }

    const adminSupabase = authCheck.adminSupabase;
    const parsed = JSON.parse(schedulePayload);

    // Save duty schedule snapshot into audit_logs for history & persistence
    await adminSupabase.from("audit_logs").insert({
      user_id: authCheck.profile.id,
      action: "station_duty_schedule_update",
      table_name: "station_members",
      record_id: stationId,
      new_values: { schedule: parsed },
    });

    revalidateStationPaths(stationId);
    return { success: true };
  } catch (err) {
    console.error("updateDutyScheduleAction error:", err);
    return { error: err instanceof Error ? err.message : "Failed to update schedule", success: false };
  }
}
