"use client";

/**
 * Dashboard Sidebar Navigation
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  BellAlertIcon,
  MapIcon,
  DocumentPlusIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  BellAlertIcon as BellAlertIconSolid,
  MapIcon as MapIconSolid,
  DocumentPlusIcon as DocumentPlusIconSolid,
  UserCircleIcon as UserCircleIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
} from "@heroicons/react/24/solid";
import { cn } from "~/lib/utils";
import type { User } from "~/server/db/schema";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon, iconSolid: HomeIconSolid },
  { name: "Alerts", href: "/dashboard/alerts", icon: BellAlertIcon, iconSolid: BellAlertIconSolid },
  { name: "Map", href: "/dashboard/map", icon: MapIcon, iconSolid: MapIconSolid },
  { name: "Report", href: "/dashboard/report", icon: DocumentPlusIcon, iconSolid: DocumentPlusIconSolid, highlight: true },
  { name: "Profile", href: "/dashboard/profile", icon: UserCircleIcon, iconSolid: UserCircleIconSolid },
];

interface DashboardSidebarProps {
  user: User;
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex w-64 flex-col border-r border-gray-800 bg-brand-navy-dark">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-800 px-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red">
            <ShieldCheckIcon className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold uppercase tracking-wide text-white">
              CARGO WATCH
            </span>
            <span className="text-xs text-gray-400">Command Center</span>
          </div>
        </Link>
      </div>

      {/* User Info */}
      <div className="border-b border-gray-800 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="truncate text-sm font-medium text-white">
              {user.fullName}
            </div>
            <div className="truncate text-xs text-gray-400 capitalize">
              {user.role.replace("_", " ")}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = isActive ? item.iconSolid : item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                item.highlight
                  ? "bg-brand-red text-white hover:bg-brand-red-hover"
                  : isActive
                    ? "bg-brand-navy-light text-white"
                    : "text-gray-400 hover:bg-brand-navy-light hover:text-white"
              )}
            >
              <Icon className={cn("mr-3 h-5 w-5 flex-shrink-0")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer - Back to Public Site */}
      <div className="border-t border-gray-800 p-4">
        <Link
          href="/"
          className="flex items-center space-x-2 text-xs text-gray-400 hover:text-white"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Back to Public Site</span>
        </Link>
      </div>
    </div>
  );
}
