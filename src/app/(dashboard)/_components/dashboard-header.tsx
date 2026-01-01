"use client";

/**
 * Dashboard Header
 * Top bar with search, notifications, and user menu
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BellIcon,
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { createClient } from "~/lib/supabase/client";
import type { User } from "~/server/db/schema";

interface DashboardHeaderProps {
  user: User;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/"); // Go back to public homepage
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-800 bg-brand-navy-dark px-6">
      {/* Search Bar */}
      <div className="flex flex-1 items-center">
        <div className="relative w-96">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search incidents, regions, alerts..."
            className="w-full rounded-lg border border-gray-700 bg-brand-navy py-2 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
          />
        </div>
      </div>

      {/* Right Side - Notifications & User Menu */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-gray-400 hover:bg-brand-navy-light hover:text-white">
          <BellIcon className="h-6 w-6" />
          <span className="absolute right-1 top-1 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-red opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-red"></span>
          </span>
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 rounded-lg p-2 hover:bg-brand-navy-light"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-red text-sm font-semibold text-white">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden text-left md:block">
              <div className="text-sm font-medium text-white">
                {user.fullName}
              </div>
              <div className="text-xs text-gray-400">{user.email}</div>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-gray-700 bg-brand-navy-dark py-1 shadow-lg">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-brand-navy-light hover:text-white"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
