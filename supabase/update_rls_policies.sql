-- Update RLS Policies and Activate Stations
-- Safe to run multiple times - updates policies without dropping tables
-- Also activates any approved stations that are inactive

-- ============================================================
-- DROP EXISTING POLICIES
-- ============================================================

-- Drop all policies on profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;

-- Drop all policies on stations
DROP POLICY IF EXISTS "Approved users can view active stations" ON stations;
DROP POLICY IF EXISTS "Admins can view all stations" ON stations;
DROP POLICY IF EXISTS "Approved users can create approved stations" ON stations;
DROP POLICY IF EXISTS "Admins can manage stations" ON stations;

-- Drop all policies on station_members
DROP POLICY IF EXISTS "Users can view own memberships" ON station_members;
DROP POLICY IF EXISTS "Station users can view station members" ON station_members;
DROP POLICY IF EXISTS "Admins can view all station members" ON station_members;
DROP POLICY IF EXISTS "Admins can manage station members" ON station_members;
DROP POLICY IF EXISTS "Users can insert own station membership" ON station_members;

-- Drop all policies on equipment
DROP POLICY IF EXISTS "Station users can view station equipment" ON equipment;
DROP POLICY IF EXISTS "Admins can view all equipment" ON equipment;
DROP POLICY IF EXISTS "Station users can insert equipment" ON equipment;
DROP POLICY IF EXISTS "Station users can update equipment" ON equipment;
DROP POLICY IF EXISTS "Admins can manage equipment" ON equipment;

-- Drop all policies on fire_incidents
DROP POLICY IF EXISTS "Station users can view fire incidents" ON fire_incidents;
DROP POLICY IF EXISTS "Admins can view all fire incidents" ON fire_incidents;
DROP POLICY IF EXISTS "Station users can insert fire incidents" ON fire_incidents;
DROP POLICY IF EXISTS "Station users can update fire incidents" ON fire_incidents;
DROP POLICY IF EXISTS "Admins can manage fire incidents" ON fire_incidents;

-- Drop all policies on ems_incidents
DROP POLICY IF EXISTS "Station users can view EMS incidents" ON ems_incidents;
DROP POLICY IF EXISTS "Admins can view all EMS incidents" ON ems_incidents;
DROP POLICY IF EXISTS "Station users can insert EMS incidents" ON ems_incidents;
DROP POLICY IF EXISTS "Station users can update EMS incidents" ON ems_incidents;
DROP POLICY IF EXISTS "Admins can manage EMS incidents" ON ems_incidents;

-- Drop all policies on audit_logs
DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Service role can insert audit logs" ON audit_logs;

-- ============================================================
-- RECREATE POLICIES (FIXED VERSIONS - use profiles table for admin checks)
-- ============================================================

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admin policies removed - admin operations use service role in server actions
CREATE POLICY "Service role can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- RLS Policies for stations
CREATE POLICY "Approved users can view active stations"
  ON stations FOR SELECT
  USING (
    is_active = true AND
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE approval_status = 'approved'
    )
  );

CREATE POLICY "Admins can view all stations"
  ON stations FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE role = 'admin' AND approval_status = 'approved'
    )
  );

CREATE POLICY "Approved users can create approved stations"
  ON stations FOR INSERT
  WITH CHECK (
    is_active = true AND
    approval_status = 'approved' AND
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE approval_status = 'approved'
    )
  );

CREATE POLICY "Admins can manage stations"
  ON stations FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE role = 'admin' AND approval_status = 'approved'
    )
  );

-- RLS Policies for station_members
CREATE POLICY "Users can view own memberships"
  ON station_members FOR SELECT
  USING (
    station_members.profile_id IN (
      SELECT p.id FROM profiles p WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "Station users can view station members"
  ON station_members FOR SELECT
  USING (
    station_members.profile_id IN (
      SELECT p.id FROM profiles p WHERE p.user_id = auth.uid() AND p.approval_status = 'approved'
    )
  );

CREATE POLICY "Admins can view all station members"
  ON station_members FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE role = 'admin' AND approval_status = 'approved'
    )
  );

CREATE POLICY "Admins can manage station members"
  ON station_members FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE role = 'admin' AND approval_status = 'approved'
    )
  );

CREATE POLICY "Users can insert own station membership"
  ON station_members FOR INSERT
  WITH CHECK (
    profile_id IN (
      SELECT p.id FROM profiles p WHERE p.user_id = auth.uid() AND p.approval_status = 'approved'
    )
  );

-- RLS Policies for equipment
CREATE POLICY "Station users can view station equipment"
  ON equipment FOR SELECT
  USING (
    equipment.station_id IN (
      SELECT sm.station_id
      FROM station_members sm
      JOIN profiles p ON sm.profile_id = p.id
      WHERE p.user_id = auth.uid()
        AND p.approval_status = 'approved'
        AND sm.is_active = true
    )
  );

CREATE POLICY "Admins can view all equipment"
  ON equipment FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE role = 'admin' AND approval_status = 'approved'
    )
  );

CREATE POLICY "Station users can insert equipment"
  ON equipment FOR INSERT
  WITH CHECK (
    station_id IN (
      SELECT sm.station_id
      FROM station_members sm
      JOIN profiles p ON sm.profile_id = p.id
      WHERE p.user_id = auth.uid()
        AND p.approval_status = 'approved'
        AND sm.is_active = true
    )
  );

CREATE POLICY "Station users can update equipment"
  ON equipment FOR UPDATE
  USING (
    station_id IN (
      SELECT sm.station_id
      FROM station_members sm
      JOIN profiles p ON sm.profile_id = p.id
      WHERE p.user_id = auth.uid()
        AND p.approval_status = 'approved'
        AND sm.is_active = true
    )
  )
  WITH CHECK (
    station_id IN (
      SELECT sm.station_id
      FROM station_members sm
      JOIN profiles p ON sm.profile_id = p.id
      WHERE p.user_id = auth.uid()
        AND p.approval_status = 'approved'
        AND sm.is_active = true
    )
  );

CREATE POLICY "Admins can manage equipment"
  ON equipment FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE role = 'admin' AND approval_status = 'approved'
    )
  );

-- RLS Policies for fire_incidents
CREATE POLICY "Station users can view fire incidents"
  ON fire_incidents FOR SELECT
  USING (
    fire_incidents.station_id IN (
      SELECT sm.station_id
      FROM station_members sm
      JOIN profiles p ON sm.profile_id = p.id
      WHERE p.user_id = auth.uid()
        AND p.approval_status = 'approved'
        AND sm.is_active = true
    )
  );

CREATE POLICY "Admins can view all fire incidents"
  ON fire_incidents FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE role = 'admin' AND approval_status = 'approved'
    )
  );

CREATE POLICY "Station users can insert fire incidents"
  ON fire_incidents FOR INSERT
  WITH CHECK (
    station_id IN (
      SELECT sm.station_id
      FROM station_members sm
      JOIN profiles p ON sm.profile_id = p.id
      WHERE p.user_id = auth.uid()
        AND p.approval_status = 'approved'
        AND sm.is_active = true
    )
  );

CREATE POLICY "Station users can update fire incidents"
  ON fire_incidents FOR UPDATE
  USING (
    station_id IN (
      SELECT sm.station_id
      FROM station_members sm
      JOIN profiles p ON sm.profile_id = p.id
      WHERE p.user_id = auth.uid()
        AND p.approval_status = 'approved'
        AND sm.is_active = true
    )
  )
  WITH CHECK (
    station_id IN (
      SELECT sm.station_id
      FROM station_members sm
      JOIN profiles p ON sm.profile_id = p.id
      WHERE p.user_id = auth.uid()
        AND p.approval_status = 'approved'
        AND sm.is_active = true
    )
  );

CREATE POLICY "Admins can manage fire incidents"
  ON fire_incidents FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE role = 'admin' AND approval_status = 'approved'
    )
  );

-- RLS Policies for ems_incidents
CREATE POLICY "Station users can view EMS incidents"
  ON ems_incidents FOR SELECT
  USING (
    ems_incidents.station_id IN (
      SELECT sm.station_id
      FROM station_members sm
      JOIN profiles p ON sm.profile_id = p.id
      WHERE p.user_id = auth.uid()
        AND p.approval_status = 'approved'
        AND sm.is_active = true
    )
  );

CREATE POLICY "Admins can view all EMS incidents"
  ON ems_incidents FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE role = 'admin' AND approval_status = 'approved'
    )
  );

CREATE POLICY "Station users can insert EMS incidents"
  ON ems_incidents FOR INSERT
  WITH CHECK (
    station_id IN (
      SELECT sm.station_id
      FROM station_members sm
      JOIN profiles p ON sm.profile_id = p.id
      WHERE p.user_id = auth.uid()
        AND p.approval_status = 'approved'
        AND sm.is_active = true
    )
  );

CREATE POLICY "Station users can update EMS incidents"
  ON ems_incidents FOR UPDATE
  USING (
    station_id IN (
      SELECT sm.station_id
      FROM station_members sm
      JOIN profiles p ON sm.profile_id = p.id
      WHERE p.user_id = auth.uid()
        AND p.approval_status = 'approved'
        AND sm.is_active = true
    )
  )
  WITH CHECK (
    station_id IN (
      SELECT sm.station_id
      FROM station_members sm
      JOIN profiles p ON sm.profile_id = p.id
      WHERE p.user_id = auth.uid()
        AND p.approval_status = 'approved'
        AND sm.is_active = true
    )
  );

CREATE POLICY "Admins can manage EMS incidents"
  ON ems_incidents FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE role = 'admin' AND approval_status = 'approved'
    )
  );

-- RLS Policies for audit_logs
CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE role = 'admin' AND approval_status = 'approved'
    )
  );

CREATE POLICY "Service role can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- ACTIVATE APPROVED STATIONS
-- ============================================================

-- Set is_active = true for all approved stations
UPDATE stations
SET is_active = true
WHERE approval_status = 'approved';
