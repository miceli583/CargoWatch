"use client";

/**
 * CargoWatch Navigation Component
 * Main navigation bar with authentication state
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldCheckIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { cn } from "~/lib/utils";
import { createClient } from "~/lib/supabase/client";

const publicNavigation = [
  { name: "Home", href: "/" },
  { name: "Resources", href: "/resources" },
  { name: "About", href: "/about" },
];

const protectedNavigation = [
  { name: "Home", href: "/" },
  { name: "Resources", href: "/resources" },
  { name: "About", href: "/about" },
];

export function Navigation() {
  const pathname = usePathname();
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

  const navigation = isAuthenticated ? protectedNavigation : publicNavigation;

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-brand-navy-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red">
                <ShieldCheckIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold uppercase tracking-wide text-white">
                  CARGO WATCH
                </span>
                <span className="text-xs text-gray-400">
                  America's Freight Protection Network
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-1">
              {!loading && navigation.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-brand-navy-light text-white"
                        : "text-gray-300 hover:bg-brand-navy-light hover:text-white"
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}

              {/* Auth Links */}
              {!loading && (
                <>
                  {isAuthenticated ? (
                    <Link
                      href="/dashboard"
                      className="ml-2 rounded-md bg-brand-red px-4 py-2 text-sm font-medium text-white hover:bg-brand-red-hover"
                    >
                      Go to Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="ml-2 rounded-md px-4 py-2 text-sm font-medium text-gray-300 hover:bg-brand-navy-light hover:text-white"
                      >
                        Login
                      </Link>
                      <Link
                        href="/signup"
                        className="rounded-md bg-brand-red px-4 py-2 text-sm font-medium text-white hover:bg-brand-red-hover"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="rounded-md p-2 text-gray-400 hover:bg-brand-navy-light hover:text-white"
              aria-label="Open menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
