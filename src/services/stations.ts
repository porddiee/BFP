import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
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

export async function addStationMember(memberData: {
  profile_id: string;
  station_id: string;
  position?: string;
  rank?: string;
  is_active?: boolean;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("station_members")
    .insert({
      ...memberData,
      is_active: memberData.is_active ?? true,
    })
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

export async function approveStation(stationId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stations")
    .update({ approval_status: "approved", is_active: true })
    .eq("id", stationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function rejectStation(stationId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stations")
    .update({ approval_status: "rejected", is_active: false })
    .eq("id", stationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPendingStations(): Promise<Station[]> {
  try {
    const adminSupabase = createAdminClient();
    const { data, error } = await adminSupabase
      .from("stations")
      .select("*")
      .eq("approval_status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("getPendingStations error:", error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn("getPendingStations exception:", err);
    return [];
  }
}
