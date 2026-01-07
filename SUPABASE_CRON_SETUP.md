# Supabase Keep-Alive with pg_cron (Recommended)

This is the **simplest and best solution** for keeping your Supabase database active on the free tier.

## How It Works

1. **pg_cron** (runs inside Supabase) triggers every 6 hours
2. Makes an **HTTP request** to your `/api/keep-alive` endpoint
3. Your endpoint **queries the database** (creates external connection)
4. Supabase sees activity and **keeps database active**

## Why This Approach?

- **Self-contained**: No external cron services needed (cron-job.org, Vercel cron, etc.)
- **Reliable**: Runs from within Supabase itself
- **Guaranteed activity**: External API call + DB query = definite activity
- **Free**: No additional costs or quotas
- **Simple**: One SQL query to set up

## Setup Instructions

### 1. Open Supabase SQL Editor

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your **CargoWatch** project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### 2. Run the SQL

Copy and paste this SQL (**replace `your-domain.com` with your actual production URL**):

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule keep-alive job (calls your API endpoint every 6 hours)
SELECT cron.schedule(
  'keep-database-alive',
  '0 */6 * * *',
  $$
    SELECT net.http_get(
      url := 'https://your-domain.com/api/keep-alive',
      timeout_milliseconds := 5000
    ) AS request_id;
  $$
);

-- Verify it was created
SELECT * FROM cron.job;
```

**IMPORTANT**: Replace `https://your-domain.com` with your actual deployed URL (e.g., `https://cargowatch.vercel.app`)

Click **Run** or press `Cmd/Ctrl + Enter`

### 3. Verify Setup

You should see output showing your cron job:

| jobid | schedule      | command    | nodename  | nodeport | database | username | active |
|-------|---------------|------------|-----------|----------|----------|----------|--------|
| 1     | 0 */6 * * *   | SELECT 1   | localhost | 5432     | postgres | postgres | t      |

**That's it!** Your database will now stay active automatically.

---

## How It Works

- **Schedule**: `0 */6 * * *` runs at 12am, 6am, 12pm, 6pm UTC every day
- **HTTP Request**: pg_cron uses `pg_net` extension to call your API endpoint
- **Database Query**: Your endpoint runs `SELECT 1` creating an external connection
- **Automatic**: Runs in the background, no manual intervention needed

---

## Managing Your Cron Job

### View All Cron Jobs
```sql
SELECT * FROM cron.job;
```

### View Execution History
```sql
SELECT *
FROM cron.job_run_details
ORDER BY start_time DESC
LIMIT 10;
```

This shows when the job ran and if it succeeded.

### Delete the Cron Job (if needed)
```sql
SELECT cron.unschedule('keep-database-alive');
```

### Update the Schedule
```sql
-- First, remove the old job
SELECT cron.unschedule('keep-database-alive');

-- Then create a new one with different schedule
-- Example: Every 4 hours instead of 6
SELECT cron.schedule(
  'keep-database-alive',
  '0 */4 * * *',
  $$
    SELECT net.http_get(
      url := 'https://your-domain.com/api/keep-alive',
      timeout_milliseconds := 5000
    ) AS request_id;
  $$
);
```

---

## Troubleshooting

### Error: "extension pg_cron is not available"

**Cause**: pg_cron might not be enabled on your Supabase project.

**Solution**:
1. Go to **Database → Extensions** in Supabase Dashboard
2. Search for "pg_cron"
3. Click **Enable**
4. Then run the SQL setup again

### Check if Job is Running

```sql
-- Check recent cron executions
SELECT
  jobid,
  job_name,
  status,
  return_message,
  start_time,
  end_time
FROM cron.job_run_details
WHERE job_name = 'keep-database-alive'
ORDER BY start_time DESC
LIMIT 5;
```

If you see recent executions with `status = 'succeeded'`, the cron job is running!

### Check HTTP Responses

```sql
-- View recent HTTP requests made by pg_net
SELECT
  id,
  status_code,
  content::text,
  created
FROM net._http_response
ORDER BY created DESC
LIMIT 10;
```

You should see responses with:
- `status_code = 200`
- `content` containing `{"success":true,...}`

This confirms your API endpoint is being called and responding successfully!

### Database Still Paused?

- **Check execution history**: Ensure jobs are actually running (see query above)
- **Increase frequency**: Change to every 4 hours: `0 */4 * * *`
- **Verify extension**: Make sure pg_cron is enabled in Database → Extensions

---

## What You Need

With this Supabase pg_cron approach, you **DO need**:
- ✅ The `/api/keep-alive` endpoint (pg_cron calls this)
- ✅ Your app deployed and publicly accessible

You **DON'T need**:
- ❌ `vercel.json` cron configuration (can remove)
- ❌ External cron services (cron-job.org, etc.)

This approach is self-contained within Supabase but still creates the necessary external API calls to guarantee activity.
