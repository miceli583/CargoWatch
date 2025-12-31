"use client";

/**
 * CargoWatch Navigation Component
 * Main navigation bar matching wireframe design
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheckIcon } from "@heroicons/react/24/solid";
import { cn } from "~/lib/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Alert Feed", href: "/alerts" },
  { name: "Map View", href: "/map" },
  { name: "Report Incident", href: "/report" },
  { name: "Resources", href: "/resources" },
  { name: "About", href: "/about" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-800 bg-brand-navy-dark">
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
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const isReport = item.name === "Report Incident";

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "rounded-md px-4 py-2 text-sm font-medium transition-colors",
                      isReport
                        ? "bg-brand-red text-white hover:bg-brand-red-hover"
                        : isActive
                          ? "bg-brand-navy-light text-white"
                          : "text-gray-300 hover:bg-brand-navy-light hover:text-white"
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
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
