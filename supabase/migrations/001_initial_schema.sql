-- Migration: Initial Schema for BFP Surigao
-- This migration sets up the core database structure with RLS policies

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

-- Create index on user_id for faster lookups
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
-- Create index on email for login lookups
CREATE INDEX idx_profiles_email ON profiles(email);
-- Create index on approval_status for admin approval queries
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

-- Create index on district for regional queries
CREATE INDEX idx_stations_district ON stations(district);
-- Create index on is_active for filtering active stations
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

-- Create indexes for station membership queries
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

-- Create indexes for equipment queries
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

-- Create indexes for incident queries
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

-- Create indexes for EMS incident queries
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

-- Create indexes for audit log queries
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE station_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE fire_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ems_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Security Definer helper functions to prevent RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid() AND role = 'admin' AND approval_status = 'approved'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_approved()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid() AND approval_status = 'approved'
  );
$$;

-- RLS Policies for profiles
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (public.is_admin());

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (public.is_admin());

-- Service role can insert profiles (for registration)
CREATE POLICY "Service role can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- RLS Policies for stations
-- Approved users can view active stations
CREATE POLICY "Approved users can view active stations"
  ON stations FOR SELECT
  USING (is_active = true AND public.is_approved());

-- Admins can view all stations
CREATE POLICY "Admins can view all stations"
  ON stations FOR SELECT
  USING (public.is_admin());

-- Admins can insert, update, delete stations
CREATE POLICY "Admins can manage stations"
  ON stations FOR ALL
  USING (public.is_admin());

-- RLS Policies for station_members
-- Users can view their own station memberships
CREATE POLICY "Users can view own memberships"
  ON station_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = station_members.profile_id AND user_id = auth.uid()
    )
  );

-- Station users can view members of their stations
CREATE POLICY "Station users can view station members"
  ON station_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM station_members sm
      JOIN profiles p ON sm.profile_id = p.id
      WHERE sm.station_id = station_members.station_id
        AND p.user_id = auth.uid()
        AND p.approval_status = 'approved'
        AND sm.is_active = true
    )
  );

-- Admins can view all station members
CREATE POLICY "Admins can view all station members"
  ON station_members FOR SELECT
  USING (public.is_admin());

-- Admins can manage station members
CREATE POLICY "Admins can manage station members"
  ON station_members FOR ALL
  USING (public.is_admin());

-- RLS Policies for equipment
-- Station users can view equipment of their stations
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

-- Admins can view all equipment
CREATE POLICY "Admins can view all equipment"
  ON equipment FOR SELECT
  USING (public.is_admin());

-- Station users can insert equipment for their stations
CREATE POLICY "Station users can insert equipment"
  ON equipment FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM station_members sm
      JOIN profiles p ON sm.profile_id = p.id
      WHERE sm.station_id = equipment.station_id
        AND p.user_id = auth.uid()
        AND p.approval_status = 'approved'
        AND sm.is_active = true
    )
  );

-- Station users can update equipment of their stations
CREATE POLICY "Station users can update equipment"
  ON equipment FOR UPDATE
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

-- Admins can manage all equipment
CREATE POLICY "Admins can manage equipment"
  ON equipment FOR ALL
  USING (public.is_admin());

-- RLS Policies for fire_incidents
-- Station users can view incidents of their stations
CREATE POLICY "Station users can view fire incidents"
  ON fire_incidents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM station_members sm
      JOIN profiles p ON sm.profile_id = p.id
      WHERE sm.station_id = fire_incidents.station_id
        AND p.user_id = auth.uid()
        AND p.approval_status = 'approved'
        AND sm.is_active = true
    )
  );

-- Admins can view all fire incidents
CREATE POLICY "Admins can view all fire incidents"
  ON fire_incidents FOR SELECT
  USING (public.is_admin());

-- Station users can insert incidents for their stations
CREATE POLICY "Station users can insert fire incidents"
  ON fire_incidents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM station_members sm
      JOIN profiles p ON sm.profile_id = p.id
      WHERE sm.station_id = fire_incidents.station_id
        AND p.user_id = auth.uid()
        AND p.approval_status = 'approved'
        AND sm.is_active = true
    )
  );

-- Station users can update incidents of their stations
CREATE POLICY "Station users can update fire incidents"
  ON fire_incidents FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM station_members sm
      JOIN profiles p ON sm.profile_id = p.id
      WHERE sm.station_id = fire_incidents.station_id
        AND p.user_id = auth.uid()
        AND p.approval_status = 'approved'
        AND sm.is_active = true
    )
  );

-- Admins can manage all fire incidents
CREATE POLICY "Admins can manage fire incidents"
  ON fire_incidents FOR ALL
  USING (public.is_admin());

-- RLS Policies for ems_incidents (similar to fire_incidents)
CREATE POLICY "Station users can view EMS incidents"
  ON ems_incidents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM station_members sm
      JOIN profiles p ON sm.profile_id = p.id
      WHERE sm.station_id = ems_incidents.station_id
        AND p.user_id = auth.uid()
        AND p.approval_status = 'approved'
        AND sm.is_active = true
    )
  );

CREATE POLICY "Admins can view all EMS incidents"
  ON ems_incidents FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Station users can insert EMS incidents"
  ON ems_incidents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM station_members sm
      JOIN profiles p ON sm.profile_id = p.id
      WHERE sm.station_id = ems_incidents.station_id
        AND p.user_id = auth.uid()
        AND p.approval_status = 'approved'
        AND sm.is_active = true
    )
  );

CREATE POLICY "Station users can update EMS incidents"
  ON ems_incidents FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM station_members sm
      JOIN profiles p ON sm.profile_id = p.id
      WHERE sm.station_id = ems_incidents.station_id
        AND p.user_id = auth.uid()
        AND p.approval_status = 'approved'
        AND sm.is_active = true
    )
  );

CREATE POLICY "Admins can manage EMS incidents"
  ON ems_incidents FOR ALL
  USING (public.is_admin());

-- RLS Policies for audit_logs
-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (public.is_admin());

-- Service role can insert audit logs (via triggers or admin actions)
CREATE POLICY "Service role can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (true);

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

-- ============================================================================
-- Initial Seed Data
-- ============================================================================

-- Insert sample station (idempotent: only inserts if it does not already exist)
INSERT INTO stations (name, address, contact_number, email, district, is_active)
SELECT 
  'BFP Surigao City Main Station',
  'Surigao City, Surigao del Norte',
  '086-123-4567',
  'surigao.main@bfp.gov.ph',
  'Surigao City',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM stations WHERE name = 'BFP Surigao City Main Station'
);

