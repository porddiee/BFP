import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { StationMember } from "@/types";

/**
 * Get station members for a specific station
 */
export async function getStationMembers(stationId: string): Promise<StationMember[]> {
  try {
    const adminSupabase = createAdminClient();
    const { data, error } = await adminSupabase
    .from("station_members")
    .select(`
      *,
      profiles (
        id,
        first_name,
        last_name,
        email,
        contact_number
      )
    `)
    .eq("station_id", stationId)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

    if (error) {
      console.warn("getStationMembers error:", error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn("getStationMembers exception:", err);
    return [];
  }
}

/**
 * Get a station member by ID
 */
export async function getStationMemberById(id: string): Promise<StationMember> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("station_members")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Add a member to a station
 */
export async function addStationMember(memberData: Omit<StationMember, "id" | "created_at" | "updated_at">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("station_members")
    .insert(memberData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update a station member
 */
export async function updateStationMember(id: string, updates: Partial<StationMember>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("station_members")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Remove a member from a station (soft delete by setting is_active to false)
 */
export async function removeStationMember(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("station_members")
    .update({ is_active: false })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

