/**
 * Supabase Client for Client-Side
 * Use this in React components and client-side code
 */

import { createBrowserClient } from "@supabase/ssr";
import { env } from "~/env";

export function createClient() {
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
