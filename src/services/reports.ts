import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { FireIncident, EMSIncident } from "@/types";

export async function getFireIncidents(stationId?: string): Promise<FireIncident[]> {
  try {
    const supabase = createAdminClient();

    let query = supabase
      .from("fire_incidents")
      .select("*")
      .order("reported_at", { ascending: false });

    if (stationId) {
      query = query.eq("station_id", stationId);
    }

    const { data, error } = await query;

    if (error) {
      console.warn("getFireIncidents error:", error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn("getFireIncidents exception:", err);
    return [];
  }
}

export async function getFireIncidentById(id: string): Promise<FireIncident> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fire_incidents")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createFireIncident(incidentData: Omit<FireIncident, "id" | "created_at" | "updated_at">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fire_incidents")
    .insert(incidentData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateFireIncident(id: string, updates: Partial<FireIncident>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fire_incidents")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getEMSIncidents(stationId?: string): Promise<EMSIncident[]> {
  try {
    const supabase = createAdminClient();

    let query = supabase
      .from("ems_incidents")
      .select("*")
      .order("reported_at", { ascending: false });

    if (stationId) {
      query = query.eq("station_id", stationId);
    }

    const { data, error } = await query;

    if (error) {
      console.warn("getEMSIncidents error:", error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn("getEMSIncidents exception:", err);
    return [];
  }
}

export async function getEMSIncidentById(id: string): Promise<EMSIncident> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ems_incidents")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createEMSIncident(incidentData: Omit<EMSIncident, "id" | "created_at" | "updated_at">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ems_incidents")
    .insert(incidentData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateEMSIncident(id: string, updates: Partial<EMSIncident>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ems_incidents")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

