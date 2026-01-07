# Database Keep-Alive Setup

This document explains how to keep your Supabase database active on the free tier by periodically pinging it.

## How It Works

The `/api/keep-alive` endpoint performs a lightweight database query (`SELECT 1`) every few hours to prevent Supabase from pausing your database due to inactivity.

## Setup Options

### Option 1: Vercel Cron (If Deploying on Vercel)

**Already configured!** The `vercel.json` file includes a cron job that runs every 6 hours.

```json
{
  "crons": [
    {
      "path": "/api/keep-alive",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

**Schedule**: Every 6 hours at the top of the hour (12am, 6am, 12pm, 6pm UTC)

**Note**: Vercel Cron is available on all plans, including the Hobby (free) tier.

Once deployed to Vercel, the cron job will automatically run. You can monitor it in your Vercel dashboard under **Project Settings → Crons**.

---

### Option 2: External Cron Service (Works with Any Hosting)

If you're not using Vercel or want more control, use a free external cron service:

#### Recommended Services:
- **[cron-job.org](https://cron-job.org)** - Free, reliable, no signup required for basic use
- **[EasyCron](https://www.easycron.com)** - Free tier available
- **[UptimeRobot](https://uptimerobot.com)** - Monitor + keep-alive (5-minute intervals)

#### Setup Steps:

1. **Deploy your app** and note your production URL (e.g., `https://cargowatch.vercel.app`)

2. **Create a cron job** with these settings:
   - **URL**: `https://your-domain.com/api/keep-alive`
   - **Interval**: Every 6-12 hours
   - **Method**: GET
   - **Optional**: Add `?secret=YOUR_SECRET` for basic protection (see security section below)

3. **Test the endpoint** by visiting it in your browser:
   ```
   https://your-domain.com/api/keep-alive
   ```

   You should see:
   ```json
   {
     "success": true,
     "message": "Database connection maintained",
     "timestamp": "2026-01-07T12:00:00.000Z",
     "ping": { "ping": 1 }
   }
   ```

---

### Option 3: GitHub Actions (Self-Hosted Cron)

Create `.github/workflows/keep-alive.yml`:

```yaml
name: Keep Database Alive

on:
  schedule:
    # Runs every 6 hours
    - cron: '0 */6 * * *'
  workflow_dispatch: # Allows manual trigger

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping keep-alive endpoint
        run: curl -f https://your-domain.com/api/keep-alive
```

**Note**: Add your production URL to the curl command.

---

## Security (Optional)

To prevent abuse, you can protect the endpoint with a secret:

### 1. Add Environment Variable

In your `.env` file:
```
CRON_SECRET=your-random-secret-here
```

Deploy this to your hosting platform's environment variables.

### 2. Enable Authentication

Uncomment the auth code in `src/app/api/keep-alive/route.ts`:

```typescript
if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}
```

### 3. Update Cron URL

Change your cron service URL to:
```
https://your-domain.com/api/keep-alive?secret=your-random-secret-here
```

---

## Testing

### Local Testing
```bash
# Start your development server
npm run dev

# In another terminal, test the endpoint
curl http://localhost:3000/api/keep-alive
```

### Production Testing
```bash
curl https://your-domain.com/api/keep-alive
```

Expected response:
```json
{
  "success": true,
  "message": "Database connection maintained",
  "timestamp": "2026-01-07T12:00:00.000Z",
  "ping": { "ping": 1 }
}
```

---

## Monitoring

### Check Cron Execution
- **Vercel**: Dashboard → Project → Crons tab
- **cron-job.org**: Dashboard shows execution history
- **GitHub Actions**: Actions tab shows workflow runs

### Check Database Activity
Log into your Supabase dashboard and check the Database activity/metrics to confirm queries are being executed.

---

## Recommended Schedule

**Every 6 hours** is recommended for Supabase free tier:
- Keeps database active without excessive requests
- Well within free tier limits
- Covers all timezones throughout the day

Cron expression: `0 */6 * * *` (runs at 12am, 6am, 12pm, 6pm UTC)

---

## Troubleshooting

**Endpoint returns 500 error**
- Check your database connection string in `.env`
- Verify Supabase credentials are correct
- Check server logs for detailed error

**Cron job not running**
- Verify the cron service is active and properly configured
- Check the URL is correct and publicly accessible
- For Vercel Cron, ensure `vercel.json` is committed to your repo

**Database still pausing**
- Increase frequency to every 4 hours instead of 6
- Verify cron jobs are actually executing (check service logs)
- Ensure the endpoint is successfully querying the database

---

## Cost Considerations

This keep-alive system is designed to be **completely free**:
- **Vercel Cron**: Free on all plans (including Hobby)
- **External Cron Services**: Free tiers available
- **Database Queries**: Minimal impact (1 simple query every 6 hours = 4 queries/day = 120/month)
- **API Requests**: Negligible bandwidth usage

Supabase free tier allows **500MB database** and **2GB bandwidth/month**, so this keep-alive system has virtually zero impact on your quotas.
