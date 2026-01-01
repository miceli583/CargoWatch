/**
 * Auth Callback Handler
 * Handles Supabase OAuth redirects (email verification, password reset, etc.)
 */

import { createClient } from "~/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Successfully exchanged code for session
      // Redirect to dashboard or intended destination
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If there was an error or no code, redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_error`);
}
