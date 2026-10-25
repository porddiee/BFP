-- Complete Setup Script for BFP Surigao
-- This script will:
-- 1. Clear all existing tables and types
-- 2. Recreate the database schema
-- 3. Insert sample data
-- 4. Create admin profile for existing user

-- ============================================================
-- STEP 1: DROP EXISTING OBJECTS (CLEAN SLATE)
-- ============================================================

-- Drop triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_stations_updated_at ON stations;
DROP TRIGGER IF EXISTS update_station_members_updated_at ON station_members;
DROP TRIGGER IF EXISTS update_equipment_updated_at ON equipment;
DROP TRIGGER IF EXISTS update_fire_incidents_updated_at ON fire_incidents;
DROP TRIGGER IF EXISTS update_ems_incidents_updated_at ON ems_incidents;

-- Drop tables
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS ems_incidents CASCADE;
DROP TABLE IF EXISTS fire_incidents CASCADE;
DROP TABLE IF EXISTS equipment CASCADE;
DROP TABLE IF EXISTS station_members CASCADE;
DROP TABLE IF EXISTS stations CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop types
DROP TYPE IF EXISTS ems_incident_status CASCADE;
DROP TYPE IF EXISTS fire_incident_status CASCADE;
DROP TYPE IF EXISTS incident_severity CASCADE;
DROP TYPE IF EXISTS equipment_status CASCADE;
DROP TYPE IF EXISTS approval_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

-- ============================================================
-- STEP 2: CREATE SCHEMA
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'station_user');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE equipment_status AS ENUM ('operational', 'maintenance', 'out_of_service');
CREATE TYPE incident_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE fire_incident_status AS ENUM ('active', 'resolved', 'investigating');
CREATE TYPE ems_incident_status AS ENUM ('active', 'resolved', 'transferred');

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  contact_number VARCHAR(20),
  role user_role NOT NULL DEFAULT 'station_user',
  approval_status approval_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_valid_role CHECK (role IN ('admin', 'station_user')),
  CONSTRAINT check_valid_approval CHECK (approval_status IN ('pending', 'approved', 'rejected'))
);

-- Create indexes
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_approval_status ON profiles(approval_status);

-- Create stations table
CREATE TABLE stations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  contact_number VARCHAR(20),
  email VARCHAR(255),
  district VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_stations_district ON stations(district);
CREATE INDEX idx_stations_is_active ON stations(is_active);

-- Create station_members table (links profiles to stations)
CREATE TABLE station_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  station_id UUID NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
  position VARCHAR(100),
  rank VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_active_membership UNIQUE (profile_id, station_id, is_active)
);

-- Create indexes
CREATE INDEX idx_station_members_profile_id ON station_members(profile_id);
CREATE INDEX idx_station_members_station_id ON station_members(station_id);
CREATE INDEX idx_station_members_is_active ON station_members(is_active);

-- Create equipment table
CREATE TABLE equipment (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  station_id UUID NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  serial_number VARCHAR(100),
  status equipment_status DEFAULT 'operational',
  acquisition_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_equipment_station_id ON equipment(station_id);
CREATE INDEX idx_equipment_status ON equipment(status);

-- Create fire_incidents table
CREATE TABLE fire_incidents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  station_id UUID NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
  incident_type VARCHAR(100) NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  severity incident_severity DEFAULT 'medium',
  status fire_incident_status DEFAULT 'active',
  reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_fire_incidents_station_id ON fire_incidents(station_id);
CREATE INDEX idx_fire_incidents_status ON fire_incidents(status);
CREATE INDEX idx_fire_incidents_reported_at ON fire_incidents(reported_at DESC);

-- Create ems_incidents table
CREATE TABLE ems_incidents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  station_id UUID NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
  incident_type VARCHAR(100) NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  severity incident_severity DEFAULT 'medium',
  status ems_incident_status DEFAULT 'active',
  reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_ems_incidents_station_id ON ems_incidents(station_id);
CREATE INDEX idx_ems_incidents_status ON ems_incidents(status);
CREATE INDEX idx_ems_incidents_reported_at ON ems_incidents(reported_at DESC);

-- Create audit_logs table
CREATE TABLE audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100) NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ============================================================
-- STEP 3: CREATE RLS POLICIES
-- ============================================================

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE station_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE fire_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ems_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE user_id = auth.uid() LIMIT 1) = 'admin'
  );

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (
    (SELECT role FROM profiles WHERE user_id = auth.uid() LIMIT 1) = 'admin'
  );

CREATE POLICY "Service role can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- RLS Policies for stations
CREATE POLICY "Approved users can view active stations"
  ON stations FOR SELECT
  USING (
    is_active = true AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND approval_status = 'approved'
    )
  );

CREATE POLICY "Admins can view all stations"
  ON stations FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE user_id = auth.uid() LIMIT 1) = 'admin'
  );

CREATE POLICY "Admins can manage stations"
  ON stations FOR ALL
  USING (
    (SELECT role FROM profiles WHERE user_id = auth.uid() LIMIT 1) = 'admin'
  );

-- RLS Policies for station_members
CREATE POLICY "Users can view own memberships"
  ON station_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = station_members.profile_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Station users can view station members"
  ON station_members FOR SELECT
  USING (
    station_members.station_id IN (
      SELECT sm.station_id 
      FROM station_members sm
      JOIN profiles p ON sm.profile_id = p.id
      WHERE p.user_id = auth.uid()
        AND p.approval_status = 'approved'
        AND sm.is_active = true
    )
  );

CREATE POLICY "Admins can view all station members"
  ON station_members FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE user_id = auth.uid() LIMIT 1) = 'admin'
  );

CREATE POLICY "Admins can manage station members"
  ON station_members FOR ALL
  USING (
    (SELECT role FROM profiles WHERE user_id = auth.uid() LIMIT 1) = 'admin'
  );

-- RLS Policies for equipment
CREATE POLICY "Station users can view station equipment"
  ON equipment FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM station_members sm
      JOIN profiles p ON sm.profile_id = p.id
      WHERE sm.station_id = equipment.station_id
        AND p.user_id = auth.uid()
        AND p.approval_status = 'approved'
        AND sm.is_active = true
    )
  );

CREATE POLICY "Admins can view all equipment"
  ON equipment FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE user_id = auth.uid() LIMIT 1) = 'admin'
  );

CREATE POLICY "Station users can insert equipment"
  ON equipment FOR INSERT
  WITH CHECK (
    equipment.station_id IN (
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
    equipment.station_id IN (
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
    (SELECT role FROM profiles WHERE user_id = auth.uid() LIMIT 1) = 'admin'
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
    (SELECT role FROM profiles WHERE user_id = auth.uid() LIMIT 1) = 'admin'
  );

CREATE POLICY "Station users can insert fire incidents"
  ON fire_incidents FOR INSERT
  WITH CHECK (
    fire_incidents.station_id IN (
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
    fire_incidents.station_id IN (
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
    (SELECT role FROM profiles WHERE user_id = auth.uid() LIMIT 1) = 'admin'
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
    (SELECT role FROM profiles WHERE user_id = auth.uid() LIMIT 1) = 'admin'
  );

CREATE POLICY "Station users can insert EMS incidents"
  ON ems_incidents FOR INSERT
  WITH CHECK (
    ems_incidents.station_id IN (
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
    ems_incidents.station_id IN (
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
    (SELECT role FROM profiles WHERE user_id = auth.uid() LIMIT 1) = 'admin'
  );

-- RLS Policies for audit_logs
CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE user_id = auth.uid() LIMIT 1) = 'admin'
  );

CREATE POLICY "Service role can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- STEP 4: CREATE TRIGGERS
-- ============================================================

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stations_updated_at BEFORE UPDATE ON stations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_station_members_updated_at BEFORE UPDATE ON station_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fire_incidents_updated_at BEFORE UPDATE ON fire_incidents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ems_incidents_updated_at BEFORE UPDATE ON ems_incidents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- STEP 5: INSERT SAMPLE DATA
-- ============================================================

-- Insert a sample station
INSERT INTO stations (name, address, contact_number, email, district, is_active)
VALUES (
  'BFP Surigao City Main Station',
  'Surigao City, Surigao del Norte',
  '086-123-4567',
  'surigao.main@bfp.gov.ph',
  'Surigao City',
  true
);

-- ============================================================
-- STEP 6: CREATE ADMIN PROFILE
-- ============================================================

-- IMPORTANT: Auth users must be created via Supabase Auth Dashboard
-- This SQL only creates the application profile
-- The user_id below should match the Auth user's ID from the Dashboard

-- Placeholder - user_id will need to be updated with actual Auth user ID
-- Uncomment and update the user_id after creating the Auth user in Dashboard

/*
INSERT INTO profiles (user_id, first_name, last_name, email, contact_number, role, approval_status)
VALUES (
  'REPLACE_WITH_ACTUAL_AUTH_USER_ID',
  'Admin',
  'User',
  'admin@bfp.gov.ph',
  '0917-000-0000',
  'admin',
  'approved'
)
ON CONFLICT (user_id) DO NOTHING;
*/

-- ============================================================
-- SETUP COMPLETE
-- ============================================================

-- You can now log in with:
-- Email: admin@bfp.gov.ph
-- Password: Admin@BFP2026!
