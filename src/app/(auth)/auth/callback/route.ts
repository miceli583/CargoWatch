/**
 * Auth Callback Handler
 * Handles Supabase OAuth redirects (email verification, password reset, etc.)
 */

import { createClient } from "~/lib/supabase/server";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check if email is verified (Supabase sets email_confirmed_at on verification)
      const isEmailVerified = !!data.user.email_confirmed_at;

      // If email is verified, update emailVerified status in database
      if (isEmailVerified) {
        try {
          await db
            .update(users)
            .set({
              emailVerified: true,
              emailVerifiedAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(users.authId, data.user.id));
        } catch (dbError) {
          console.error("Error updating email verification status:", dbError);
          // Continue with redirect even if DB update fails
        }
      }

      // Check user's approval status to determine redirect
      try {
        const dbUser = await db.query.users.findFirst({
          where: eq(users.authId, data.user.id),
        });

        if (dbUser) {
          // If pending approval, redirect to pending-approval page
          if (dbUser.approvalStatus === "pending") {
            return NextResponse.redirect(`${origin}/pending-approval`);
          }
          // If approved and active, redirect to dashboard
          if (dbUser.approvalStatus === "approved" && dbUser.accountStatus === "active") {
            return NextResponse.redirect(`${origin}/dashboard`);
          }
        }
      } catch (dbError) {
        console.error("Error checking user status:", dbError);
      }

      // Default redirect to pending-approval if we can't determine status
      return NextResponse.redirect(`${origin}/pending-approval`);
    }
  }

  // If there was an error or no code, redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_error`);
}
