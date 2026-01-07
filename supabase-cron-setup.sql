-- Supabase Database Keep-Alive using pg_cron + API Endpoint
-- Run this SQL in your Supabase SQL Editor (Dashboard → SQL Editor)
--
-- This approach uses pg_cron (runs inside Supabase) to call your API endpoint,
-- which then queries the database. This creates external connection activity
-- that Supabase will definitely recognize.

-- Step 1: Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;  -- For making HTTP requests

-- Step 2: Schedule a job to call your keep-alive endpoint every 6 hours
-- IMPORTANT: Replace 'https://your-domain.com' with your actual production URL
SELECT cron.schedule(
  'keep-database-alive',
  '0 */6 * * *',  -- Every 6 hours (12am, 6am, 12pm, 6pm UTC)
  $$
    SELECT net.http_get(
      url := 'https://your-domain.com/api/keep-alive',
      timeout_milliseconds := 5000
    ) AS request_id;
  $$
);

-- Optional: Verify the cron job was created
SELECT * FROM cron.job;

-- Optional: View cron job execution history
-- SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;

-- Optional: View HTTP request results
-- SELECT * FROM net._http_response ORDER BY created DESC LIMIT 10;
