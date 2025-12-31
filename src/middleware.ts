/**
 * CargoWatch Middleware
 * Handles authentication and session management
 *
 * TEMPORARILY DISABLED: Supabase SSR is not compatible with Edge Runtime
 * The @supabase/realtime-js library uses Node.js APIs (process.versions)
 * which are not available in Next.js Edge Runtime.
 *
 * TODO: Re-enable when Supabase releases Edge Runtime compatible version
 * or implement custom auth middleware without realtime features.
 */

import { type NextRequest, NextResponse } from "next/server";
// import { updateSession } from "~/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Temporarily disabled - just pass through
  return NextResponse.next();

  // Original code (disabled):
  // const { supabaseResponse, user } = await updateSession(request);
  // if (user) {
  //   supabaseResponse.headers.set("x-user-id", user.id);
  //   supabaseResponse.headers.set("x-user-email", user.email ?? "");
  // }
  // return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
