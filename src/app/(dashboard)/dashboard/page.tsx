/**
 * Dashboard Home Page
 * Overview with stats, recent activity, and quick actions
 */

import { db } from "~/server/db";
import { incidents, regions } from "~/server/db/schema";
import { desc, sql, and, gte } from "drizzle-orm";
import Link from "next/link";
import {
  BellAlertIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
  TruckIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

export const dynamic = "force-dynamic";

async function getDashboardStats() {
  try {
    const [totalIncidents] = await db
      .select({ count: sql<number>`count(*)` })
      .from(incidents);

    const [criticalIncidents] = await db
      .select({ count: sql<number>`count(*)` })
      .from(incidents)
      .where(sql`${incidents.severityLevel} = 'critical'`);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [recentIncidents] = await db
      .select({ count: sql<number>`count(*)` })
      .from(incidents)
      .where(gte(incidents.createdAt, thirtyDaysAgo));

    const [activeRegions] = await db
      .select({ count: sql<number>`count(*)` })
      .from(regions)
      .where(sql`${regions.incidentCount} > 0`);

    return {
      total: totalIncidents?.count ?? 0,
      critical: criticalIncidents?.count ?? 0,
      recent: recentIncidents?.count ?? 0,
      regions: activeRegions?.count ?? 0,
    };
  } catch (error) {
    return { total: 0, critical: 0, recent: 0, regions: 0 };
  }
}

async function getRecentIncidents() {
  try {
    return await db
      .select()
      .from(incidents)
      .orderBy(desc(incidents.createdAt))
      .limit(5);
  } catch (error) {
    return [];
  }
}

async function getHotspots() {
  try {
    return await db
      .select()
      .from(regions)
      .orderBy(desc(regions.incidentCount))
      .limit(3);
  } catch (error) {
    return [];
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const recentIncidents = await getRecentIncidents();
  const hotspots = await getHotspots();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Command Center</h1>
        <p className="mt-1 text-sm text-gray-400">
          Monitor and respond to cargo security incidents across the network
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Incidents */}
        <div className="rounded-lg border border-gray-800 bg-brand-navy-dark p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Incidents</p>
              <p className="mt-2 text-3xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="rounded-lg bg-blue-500/10 p-3">
              <BellAlertIcon className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">All time tracking</p>
        </div>

        {/* Critical Alerts */}
        <div className="rounded-lg border border-gray-800 bg-brand-navy-dark p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Critical Alerts</p>
              <p className="mt-2 text-3xl font-bold text-brand-red">{stats.critical}</p>
            </div>
            <div className="rounded-lg bg-brand-red/10 p-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-brand-red" />
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">Requires immediate attention</p>
        </div>

        {/* Recent Activity */}
        <div className="rounded-lg border border-gray-800 bg-brand-navy-dark p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Last 30 Days</p>
              <p className="mt-2 text-3xl font-bold text-green-500">{stats.recent}</p>
            </div>
            <div className="rounded-lg bg-green-500/10 p-3">
              <ArrowTrendingUpIcon className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">Recent incident reports</p>
        </div>

        {/* Active Regions */}
        <div className="rounded-lg border border-gray-800 bg-brand-navy-dark p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Active Regions</p>
              <p className="mt-2 text-3xl font-bold text-purple-500">{stats.regions}</p>
            </div>
            <div className="rounded-lg bg-purple-500/10 p-3">
              <MapPinIcon className="h-6 w-6 text-purple-500" />
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">Regions with incidents</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Incidents */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-800 bg-brand-navy-dark">
            <div className="border-b border-gray-800 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Recent Incidents</h2>
                <Link
                  href="/dashboard/alerts"
                  className="text-sm text-brand-red hover:text-brand-red-hover"
                >
                  View All →
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-800">
              {recentIncidents.length > 0 ? (
                recentIncidents.map((incident) => (
                  <div key={incident.id} className="p-6 hover:bg-brand-navy-light/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                              incident.severityLevel === "critical"
                                ? "bg-red-500/10 text-red-500"
                                : incident.severityLevel === "high"
                                  ? "bg-orange-500/10 text-orange-500"
                                  : "bg-yellow-500/10 text-yellow-500"
                            }`}
                          >
                            {incident.severityLevel}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(incident.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="mt-2 font-medium text-white">
                          {incident.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-400 line-clamp-2">
                          {incident.description}
                        </p>
                        <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <MapPinIcon className="mr-1 h-4 w-4" />
                            {incident.region}
                          </span>
                          <span className="flex items-center">
                            <TruckIcon className="mr-1 h-4 w-4" />
                            {incident.incidentType}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <p className="text-gray-400">No recent incidents</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hotspots & Quick Actions */}
        <div className="space-y-6">
          {/* Hotspots */}
          <div className="rounded-lg border border-gray-800 bg-brand-navy-dark p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Top Hotspots</h2>
            <div className="space-y-4">
              {hotspots.map((region, index) => (
                <div key={region.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                        index === 0
                          ? "bg-brand-red/10 text-brand-red"
                          : index === 1
                            ? "bg-orange-500/10 text-orange-500"
                            : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-white">{region.name}</div>
                      <div className="text-xs text-gray-500">{region.state}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-brand-red">
                      {region.incidentCount}
                    </div>
                    <div className="text-xs text-gray-500">incidents</div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/dashboard/map"
              className="mt-4 block rounded-lg border border-gray-700 py-2 text-center text-sm text-gray-300 hover:bg-brand-navy-light"
            >
              View Full Map
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="rounded-lg border border-gray-800 bg-brand-navy-dark p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/dashboard/report"
                className="block rounded-lg bg-brand-red px-4 py-3 text-center text-sm font-semibold text-white hover:bg-brand-red-hover"
              >
                Report New Incident
              </Link>
              <Link
                href="/dashboard/alerts"
                className="block rounded-lg border border-gray-700 px-4 py-3 text-center text-sm font-semibold text-gray-300 hover:bg-brand-navy-light"
              >
                View All Alerts
              </Link>
              <Link
                href="/dashboard/map"
                className="block rounded-lg border border-gray-700 px-4 py-3 text-center text-sm font-semibold text-gray-300 hover:bg-brand-navy-light"
              >
                Explore Map
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
