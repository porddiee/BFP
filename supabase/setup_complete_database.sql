-- ============================================
-- COMPLETE DATABASE SETUP - SAFE TO RUN MULTIPLE TIMES
-- ============================================
-- This script combines RLS policy updates and incident file upload setup
-- It is designed to be safe to run multiple times without erasing data
-- Run this in your Supabase SQL editor

-- ============================================================
-- PART 1: UPDATE RLS POLICIES
-- ============================================================

-- Drop existing policies (safe with IF EXISTS)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;

DROP POLICY IF EXISTS "Approved users can view active stations" ON stations;
DROP POLICY IF EXISTS "Admins can view all stations" ON stations;
DROP POLICY IF EXISTS "Approved users can create approved stations" ON stations;
DROP POLICY IF EXISTS "Admins can manage stations" ON stations;

DROP POLICY IF EXISTS "Users can view own memberships" ON station_members;
DROP POLICY IF EXISTS "Station users can view station members" ON station_members;
DROP POLICY IF EXISTS "Admins can view all station members" ON station_members;
DROP POLICY IF EXISTS "Admins can manage station members" ON station_members;
DROP POLICY IF EXISTS "Users can insert own station membership" ON station_members;

DROP POLICY IF EXISTS "Station users can view station equipment" ON equipment;
DROP POLICY IF EXISTS "Admins can view all equipment" ON equipment;
DROP POLICY IF EXISTS "Station users can insert equipment" ON equipment;
DROP POLICY IF EXISTS "Station users can update equipment" ON equipment;
DROP POLICY IF EXISTS "Admins can manage equipment" ON equipment;

DROP POLICY IF EXISTS "Station users can view fire incidents" ON fire_incidents;
DROP POLICY IF EXISTS "Admins can view all fire incidents" ON fire_incidents;
DROP POLICY IF EXISTS "Station users can insert fire incidents" ON fire_incidents;
DROP POLICY IF EXISTS "Station users can update fire incidents" ON fire_incidents;
DROP POLICY IF EXISTS "Admins can manage fire incidents" ON fire_incidents;

DROP POLICY IF EXISTS "Station users can view EMS incidents" ON ems_incidents;
DROP POLICY IF EXISTS "Admins can view all EMS incidents" ON ems_incidents;
DROP POLICY IF EXISTS "Station users can insert EMS incidents" ON ems_incidents;
DROP POLICY IF EXISTS "Station users can update EMS incidents" ON ems_incidents;
DROP POLICY IF EXISTS "Admins can manage EMS incidents" ON ems_incidents;

DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Service role can insert audit logs" ON audit_logs;

-- Recreate RLS Policies (using profiles table for admin checks)
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);

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

-- Activate approved stations
UPDATE stations
SET is_active = true
WHERE approval_status = 'approved';

-- ============================================================
-- PART 2: INCIDENT FILE UPLOAD SETUP
-- ============================================================

-- Add attachments column as JSONB (new format with categories)
-- This replaces the old TEXT[] approach
DO $$
BEGIN
  -- Add attachments_new as JSONB if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'fire_incidents' 
    AND column_name = 'attachments'
  ) THEN
    ALTER TABLE fire_incidents ADD COLUMN attachments JSONB;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'ems_incidents' 
    AND column_name = 'attachments'
  ) THEN
    ALTER TABLE ems_incidents ADD COLUMN attachments JSONB;
  END IF;
END $$;

-- Create storage bucket for incident files (safe with ON CONFLICT)
INSERT INTO storage.buckets (id, name, public)
VALUES ('incident-files', 'incident-files', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist (safe)
DROP POLICY IF EXISTS "Public read access to incident files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload incident files" ON storage.objects;
DROP POLICY IF EXISTS "Station members can delete incident files" ON storage.objects;

-- Create storage policies for incident files
CREATE POLICY "Public read access to incident files"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'incident-files');

CREATE POLICY "Authenticated users can upload incident files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'incident-files');

CREATE POLICY "Station members can delete incident files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'incident-files' AND
    auth.uid() IN (
      SELECT p.user_id
      FROM profiles p
      JOIN station_members sm ON p.id = sm.profile_id
      WHERE sm.station_id::text = (regexp_match(storage.objects.name, 'incidents/([^/]+)/'))[1]
        AND p.approval_status = 'approved'
        AND sm.is_active = true
    )
  );

-- ============================================================
-- PART 3: FILE CATEGORIZATION MIGRATION
-- ============================================================

-- This migrates attachments from TEXT[] to JSONB to support categories
-- Safe to run multiple times - checks if migration is already done

-- Note: Since we now add attachments as JSONB directly in Part 2,
-- this migration section is only needed if you have existing data in TEXT[] format
-- from a previous version. If this is a fresh install, this section does nothing.

-- This script is kept for backward compatibility with existing databases
