-- Add approval workflow to stations table
-- This migration adds approval_status, created_by, and changes is_active default

-- Add new columns to stations table
ALTER TABLE stations
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS approval_status approval_status DEFAULT 'pending';

-- Update existing stations to have approved status and active
UPDATE stations
SET approval_status = 'approved', is_active = true
WHERE approval_status IS NULL;

-- Change is_active default to false (new stations are inactive until approved)
ALTER TABLE stations ALTER COLUMN is_active SET DEFAULT false;

-- Add indexes for new columns
CREATE INDEX IF NOT EXISTS idx_stations_approval_status ON stations(approval_status);
CREATE INDEX IF NOT EXISTS idx_stations_created_by ON stations(created_by);

-- Add constraint for approval_status
ALTER TABLE stations
  ADD CONSTRAINT check_valid_station_approval
  CHECK (approval_status IN ('pending', 'approved', 'rejected'));

-- Update RLS policies for station creation and approval
-- Drop existing policies
DROP POLICY IF EXISTS "Approved users can view active stations" ON stations;
DROP POLICY IF EXISTS "Admins can view all stations" ON stations;
DROP POLICY IF EXISTS "Admins can manage stations" ON stations;

-- Create updated policies
CREATE POLICY "Approved users can view active stations"
  ON stations FOR SELECT
  USING (
    is_active = true AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND approval_status = 'approved'
    )
  );

CREATE POLICY "Approved users can view their own pending stations"
  ON stations FOR SELECT
  USING (
    NOT is_active AND
    EXISTS (
      SELECT 1 FROM station_members sm
      WHERE sm.station_id = stations.id
        AND sm.profile_id IN (
          SELECT id FROM profiles WHERE user_id = auth.uid()
        )
    )
  );

CREATE POLICY "Admins can view all stations"
  ON stations FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE user_id = auth.uid() LIMIT 1) = 'admin'
  );

CREATE POLICY "Approved users can create pending stations"
  ON stations FOR INSERT
  WITH CHECK (
    NOT is_active AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND approval_status = 'approved'
    )
  );

CREATE POLICY "Admins can manage stations"
  ON stations FOR ALL
  USING (
    (SELECT role FROM profiles WHERE user_id = auth.uid() LIMIT 1) = 'admin'
  );
