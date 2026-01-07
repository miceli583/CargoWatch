import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { sql } from "drizzle-orm";

/**
 * Keep-Alive endpoint to prevent Supabase from pausing the database
 *
 * This endpoint performs a lightweight database query to keep the connection active.
 * Call this endpoint periodically (every 6-12 hours) using:
 * - External cron service (cron-job.org, EasyCron, etc.)
 * - Vercel Cron (if using Vercel deployment)
 * - GitHub Actions scheduled workflow
 *
 * Optional: Add ?secret=YOUR_SECRET to the URL for basic authentication
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    // Optional: Protect endpoint with a secret
    // Uncomment and set CRON_SECRET in your environment variables
    // if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    //   return NextResponse.json(
    //     { error: "Unauthorized" },
    //     { status: 401 }
    //   );
    // }

    // Perform a lightweight database query
    // Using a simple SELECT to check database connectivity
    const result = await db.execute(sql`SELECT 1 as ping`);

    const timestamp = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: "Database connection maintained",
      timestamp,
      ping: result[0] ?? { ping: 1 },
    });
  } catch (error) {
    console.error("Keep-alive error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to ping database",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
