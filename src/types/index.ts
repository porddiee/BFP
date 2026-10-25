// User and Authentication Types
export type UserRole = "admin" | "station_user";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface Profile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  contact_number: string;
  role: UserRole;
  approval_status: ApprovalStatus;
  created_at: string;
  updated_at: string;
}

export interface StationMember {
  id: string;
  profile_id: string;
  station_id: string;
  position: string;
  rank: string;
  is_active: boolean;
  joined_at: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  table_name: string;
  record_id: string;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

// Station Types
export interface Station {
  id: string;
  name: string;
  address: string;
  contact_number: string | null;
  email: string | null;
  district: string | null;
  is_active: boolean;
  created_by: string | null;
  approval_status: ApprovalStatus;
  created_at: string;
  updated_at: string;
}

// Personnel (deprecated - use StationMember instead)
export interface Personnel {
  id: string;
  station_id: string;
  first_name: string;
  last_name: string;
  rank: string;
  position: string;
  contact_number: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// Equipment Types
export interface Equipment {
  id: string;
  station_id: string;
  name: string;
  type: string;
  serial_number: string;
  status: "operational" | "maintenance" | "out_of_service";
  acquisition_date: string;
  created_at: string;
  updated_at: string;
}

// Incident Types
export interface FireIncident {
  id: string;
  station_id: string;
  incident_type: string;
  location: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "active" | "resolved" | "investigating";
  reported_at: string;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface EMSIncident {
  id: string;
  station_id: string;
  incident_type: string;
  location: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "active" | "resolved" | "transferred";
  reported_at: string;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}
