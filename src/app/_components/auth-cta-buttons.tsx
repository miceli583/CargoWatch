"use client";

/**
 * Auth-aware CTA Buttons Component
 * Shows Report/View Alert buttons if logged in, Login/Signup if not
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "~/lib/supabase/client";
import {
  BellAlertIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

interface AuthCTAButtonsProps {
  variant?: "hero" | "cta";
}

export function AuthCTAButtons({ variant = "hero" }: AuthCTAButtonsProps) {
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
    // Show skeleton or empty state while loading
    if (variant === "hero") {
      return (
        <div className="flex items-center justify-center">
          <div className="h-10 w-40 rounded-md bg-gray-700 animate-pulse" />
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center gap-x-6">
        <div className="h-10 w-40 rounded-md bg-gray-700 animate-pulse" />
        <div className="h-10 w-40 rounded-md bg-gray-700 animate-pulse" />
      </div>
    );
  }

  if (isAuthenticated) {
    // User is logged in - show Report and View Alert Feed buttons
    if (variant === "hero") {
      return (
        <div className="flex items-center justify-center gap-x-6">
          <Link
            href="/dashboard/report"
            className="rounded-md bg-brand-red px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-red-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          >
            <BellAlertIcon className="mr-2 inline-block h-5 w-5" />
            Report an Incident
          </Link>
          <Link
            href="/dashboard/alerts"
            className="rounded-md border border-gray-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-navy-light"
          >
            <ShieldCheckIcon className="mr-2 inline-block h-5 w-5" />
            View Alert Feed
          </Link>
        </div>
      );
    } else {
      // CTA variant (larger buttons)
      return (
        <div className="flex justify-center gap-4">
          <Link
            href="/dashboard/report"
            className="rounded-md bg-brand-red px-8 py-4 text-lg font-semibold text-white hover:bg-brand-red-hover"
          >
            Report an Incident
          </Link>
          <Link
            href="/dashboard/alerts"
            className="rounded-md border border-gray-600 px-8 py-4 text-lg font-semibold text-white hover:bg-brand-navy"
          >
            View Alert Feed
          </Link>
        </div>
      );
    }
  } else {
    // User is not logged in
    if (variant === "hero") {
      // Hero variant: Show single "Join the Network" button
      return (
        <div className="flex items-center justify-center">
          <Link
            href="/signup"
            className="rounded-md bg-brand-red px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-red-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
          >
            Join the Network
          </Link>
        </div>
      );
    } else {
      // CTA variant (larger buttons)
      return (
        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="rounded-md border border-gray-600 px-8 py-4 text-lg font-semibold text-white hover:bg-brand-navy"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-brand-red px-8 py-4 text-lg font-semibold text-white hover:bg-brand-red-hover"
          >
            Sign Up
          </Link>
        </div>
      );
    }
  }
}

