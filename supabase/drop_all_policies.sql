-- Drop all RLS policies
-- Run this first, then run update_rls_policies.sql

-- Drop all policies on profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;

-- Drop all policies on stations
DROP POLICY IF EXISTS "Approved users can view active stations" ON stations;
DROP POLICY IF EXISTS "Approved users can view their own pending stations" ON stations;
DROP POLICY IF EXISTS "Admins can view all stations" ON stations;
DROP POLICY IF EXISTS "Approved users can create pending stations" ON stations;
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
