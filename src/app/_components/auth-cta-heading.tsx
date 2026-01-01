"use client";

/**
 * Auth-aware CTA Heading Component
 * Shows "Join the Network" if not logged in, "Thanks for Joining" if logged in
 */

import { useEffect, useState } from "react";
import { createClient } from "~/lib/supabase/client";

export function AuthCTAHeading() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  if (loading) {
    // Show skeleton while loading
    return (
      <h2 className="text-3xl font-bold text-white animate-pulse">
        Join the Network
      </h2>
    );
  }

  return (
    <h2 className="text-3xl font-bold text-white">
      {isAuthenticated ? "Thanks for Joining" : "Join the Network"}
    </h2>
  );
}

