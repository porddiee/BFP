import { createClient } from "@/lib/supabase/server";
import type { AuditLog } from "@/types";

/**
 * Log an audit entry
 * This should be called for all important data changes
 */
export async function logAuditEntry(params: {
  user_id: string;
  action: string;
  table_name: string;
  record_id: string;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from("audit_logs").insert({
    user_id: params.user_id,
    action: params.action,
    table_name: params.table_name,
    record_id: params.record_id,
    old_values: params.old_values || null,
    new_values: params.new_values || null,
    ip_address: params.ip_address || null,
    user_agent: params.user_agent || null,
  });

  if (error) {
    // Log to console as fallback, but don't throw to avoid breaking the main operation
    console.error("Failed to log audit entry:", error);
  }
}

/**
 * Get audit logs for a specific record (admin only)
 */
export async function getAuditLogsForRecord(tableName: string, recordId: string): Promise<AuditLog[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .eq("table_name", tableName)
    .eq("record_id", recordId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to get audit logs: ${error.message}`);
  }

  return data || [];
}

/**
 * Get all audit logs (admin only)
 */
export async function getAllAuditLogs(limit: number = 100): Promise<AuditLog[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to get audit logs: ${error.message}`);
  }

  return data || [];
}
