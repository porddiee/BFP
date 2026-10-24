import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Profile, UserRole, ApprovalStatus } from "@/types";

/**
 * Sign up a new user with email and password
 * Creates a profile with 'station_user' role and 'pending' approval status
 */
export async function signUp(email: string, password: string, profileData: {
  first_name: string;
  last_name: string;
  contact_number: string;
}) {
  const supabase = await createClient();

  // Create user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    throw new Error(`Sign up failed: ${authError.message}`);
  }

  if (!authData.user) {
    throw new Error("User creation failed");
  }

  // Create profile in database
  const adminSupabase = createAdminClient();
  const { error: profileError } = await adminSupabase.from("profiles").insert({
    user_id: authData.user.id,
    first_name: profileData.first_name,
    last_name: profileData.last_name,
    email,
    contact_number: profileData.contact_number,
    role: "station_user" as UserRole,
    approval_status: "pending" as ApprovalStatus,
  });

  if (profileError) {
    // Rollback: delete the auth user if profile creation fails
    await adminSupabase.auth.admin.deleteUser(authData.user.id);
    throw new Error(`Profile creation failed: ${profileError.message}`);
  }

  // Auto-confirm user email in Supabase Auth so they can log in once approved
  await adminSupabase.auth.admin.updateUserById(authData.user.id, {
    email_confirm: true,
  });

  return { user: authData.user, profile: null };
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(`Sign in failed: ${error.message}`);
  }

  return data;
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(`Sign out failed: ${error.message}`);
  }
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Failed to get user:", error);
    return null;
  }

  return user;
}

/**
 * Get the profile for the current user
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Failed to get profile:", error);
    return null;
  }

  return data;
}

/**
 * Get profile by user ID (admin only)
 */
export async function getProfileById(profileId: string): Promise<Profile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", profileId)
    .single();

  if (error) {
    throw new Error(`Failed to get profile: ${error.message}`);
  }

  return data;
}

/**
 * Update user profile
 */
export async function updateProfile(profileId: string, updates: Partial<Profile>) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", profileId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }

  return data;
}

/**
 * Approve a user's profile (admin only)
 */
export async function approveProfile(profileId: string) {
  const profile = await updateProfile(profileId, { approval_status: "approved" });
  if (profile?.user_id) {
    try {
      const adminSupabase = createAdminClient();
      await adminSupabase.auth.admin.updateUserById(profile.user_id, {
        email_confirm: true,
      });
    } catch (e) {
      console.error("Failed to auto-confirm user in auth:", e);
    }
  }
  return profile;
}

/**
 * Reject a user's profile (admin only)
 */
export async function rejectProfile(profileId: string) {
  return updateProfile(profileId, { approval_status: "rejected" });
}

/**
 * Grant admin role to a user (admin only)
 */
export async function grantAdminRole(profileId: string) {
  return updateProfile(profileId, { role: "admin" });
}

/**
 * Revoke admin role from a user (admin only)
 */
export async function revokeAdminRole(profileId: string) {
  return updateProfile(profileId, { role: "station_user" });
}

/**
 * Get all pending profiles (admin only)
 */
export async function getPendingProfiles(): Promise<Profile[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("approval_status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to get pending profiles: ${error.message}`);
  }

  return data || [];
}

/**
 * Check if the current user has a specific role
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const profile = await getCurrentProfile();

  if (!profile) {
    return false;
  }

  return profile.role === role && profile.approval_status === "approved";
}

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole("admin");
}

/**
 * Check if the current user is an approved station user
 */
export async function isApprovedStationUser(): Promise<boolean> {
  const profile = await getCurrentProfile();

  if (!profile) {
    return false;
  }

  return profile.role === "station_user" && profile.approval_status === "approved";
}

/**
 * Check if the current user's profile is approved
 */
export async function isApproved(): Promise<boolean> {
  const profile = await getCurrentProfile();

  if (!profile) {
    return false;
  }

  return profile.approval_status === "approved";
}

/**
 * Get stations where the current user is a member
 */
export async function getUserStations() {
  const profile = await getCurrentProfile();

  if (!profile) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("station_members")
    .select(`
      station_id,
      stations (
        id,
        name,
        address,
        district,
        is_active
      )
    `)
    .eq("profile_id", profile.id)
    .eq("is_active", true);

  if (error) {
    throw new Error(`Failed to get user stations: ${error.message}`);
  }

  return data || [];
}
