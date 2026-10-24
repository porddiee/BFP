-- Development Seed Data for BFP Surigao
-- IMPORTANT: This file is for DEVELOPMENT ONLY
-- DO NOT use this in production without review
-- DO NOT create users with hardcoded passwords in production

-- NOTE: This file assumes the migration initial_setup.sql has been applied
-- Run: psql -U postgres -d your_database -f supabase/migrations/initial_setup.sql
-- Then: psql -U postgres -d your_database -f supabase/seed.sql

-- Insert a sample station for development testing
INSERT INTO stations (name, address, contact_number, email, district, is_active)
VALUES (
  'BFP Surigao City Main Station',
  'Surigao City, Surigao del Norte',
  '086-123-4567',
  'surigao.main@bfp.gov.ph',
  'Surigao City',
  true
)
ON CONFLICT DO NOTHING;

-- Development Note:
-- To create the first administrator, follow these steps:
-- 1. Create a user via Supabase Auth (sign up or admin panel)
-- 2. Get the user_id from auth.users
-- 3. Insert into profiles table with role='admin' and approval_status='approved'
-- 4. Example SQL (replace with actual user_id):
--    INSERT INTO profiles (user_id, first_name, last_name, email, contact_number, role, approval_status)
--    VALUES ('ACTUAL_USER_ID_HERE', 'Admin', 'User', 'admin@bfp.gov.ph', '0917-000-0000', 'admin', 'approved');

-- To add a station member:
-- 1. Create a user via Supabase Auth
-- 2. Insert into profiles table with role='station_user' and approval_status='approved'
-- 3. Insert into station_members table linking profile to station
-- Example SQL:
-- INSERT INTO profiles (user_id, first_name, last_name, email, contact_number, role, approval_status)
-- VALUES ('ACTUAL_USER_ID_HERE', 'Juan', 'Dela Cruz', 'juan@bfp.gov.ph', '0917-123-4567', 'station_user', 'approved');
--
-- INSERT INTO station_members (profile_id, station_id, position, rank, is_active)
-- SELECT p.id, s.id, 'Firefighter', 'Fire Officer 2', true
-- FROM profiles p, stations s
-- WHERE p.email = 'juan@bfp.gov.ph' AND s.name = 'BFP Surigao City Main Station';
