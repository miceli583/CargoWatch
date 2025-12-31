/**
 * CargoWatch Middleware
 * Handles authentication and session management
 */

import { type NextRequest } from "next/server";
import { updateSession } from "~/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  // Add user information to headers for server components
  if (user) {
    supabaseResponse.headers.set("x-user-id", user.id);
    supabaseResponse.headers.set("x-user-email", user.email ?? "");
  }

  return supabaseResponse;
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
