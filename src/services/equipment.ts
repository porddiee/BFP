import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Equipment } from "@/types";

export async function getEquipment(stationId: string): Promise<Equipment[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("equipment")
      .select("*")
      .eq("station_id", stationId)
      .order("name", { ascending: true });

    if (error) {
      console.warn("getEquipment error:", error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn("getEquipment exception:", err);
    return [];
  }
}

export async function getEquipmentById(id: string): Promise<Equipment> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("equipment")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createEquipment(equipmentData: Omit<Equipment, "id" | "created_at" | "updated_at">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("equipment")
    .insert(equipmentData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateEquipment(id: string, updates: Partial<Equipment>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("equipment")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteEquipment(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("equipment")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

