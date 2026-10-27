-- Activate all approved stations
-- This sets is_active = true for all stations with approval_status = 'approved'

UPDATE stations
SET is_active = true
WHERE approval_status = 'approved';
