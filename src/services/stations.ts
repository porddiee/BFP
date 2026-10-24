import { createClient } from "@/lib/supabase/server";
import type { Station } from "@/types";

export async function getStations(): Promise<Station[]> {
  try {
    const supabase = await createClient();
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
    const supabase = await createClient();
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
    const supabase = await createClient();
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

export async function createStation(stationData: Omit<Station, "id" | "created_at" | "updated_at">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stations")
    .insert(stationData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateStation(id: string, updates: Partial<Station>) {
  const supabase = await createClient();
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
  const supabase = await createClient();
  const { error } = await supabase
    .from("stations")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
