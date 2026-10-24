import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Station } from "@/types";

export async function getStations(): Promise<Station[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("stations")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) {
      console.warn("getStations error:", error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn("getStations exception:", err);
    return [];
  }
}

export async function getStationById(id: string): Promise<Station | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("stations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Get the station that the given profile belongs to
 */
export async function getUserStation(profileId: string): Promise<Station | null> {
  try {
    const supabase = createAdminClient();
    const { data: member, error } = await supabase
      .from("station_members")
      .select("station_id, stations (*)")
      .eq("profile_id", profileId)
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();

    if (error || !member) return null;
    return (member.stations as unknown as Station) || null;
  } catch (err) {
    console.warn("getUserStation exception:", err);
    return null;
  }
}

/**
 * Register a new fire station for a station user and make them the Station Commander
 */
export async function createStationForUser(
  profileId: string,
  stationData: {
    name: string;
    address: string;
    district: string;
    contact_number: string;
    email: string;
  }
): Promise<Station> {
  const supabase = createAdminClient();

  // 1. Insert station
  const { data: station, error: stationErr } = await supabase
    .from("stations")
    .insert({
      name: stationData.name,
      address: stationData.address,
      district: stationData.district,
      contact_number: stationData.contact_number,
      email: stationData.email,
      is_active: true,
    })
    .select()
    .single();

  if (stationErr) {
    throw new Error(`Failed to create station: ${stationErr.message}`);
  }

  // 2. Link profile as Station Commander
  const { error: memberErr } = await supabase.from("station_members").insert({
    profile_id: profileId,
    station_id: station.id,
    position: "Station Commander",
    rank: "Commander",
    is_active: true,
  });

  if (memberErr) {
    console.warn("Failed to create membership:", memberErr.message);
  }

  return station;
}

export async function createStation(stationData: Omit<Station, "id" | "created_at" | "updated_at">) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("stations")
    .insert(stationData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateStation(id: string, updates: Partial<Station>) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("stations")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteStation(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("stations")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
