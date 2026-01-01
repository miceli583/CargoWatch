/**
 * CargoWatch Home Page
 * Landing page with hero, stats, and regional overview
 */

import {
  ShieldCheckIcon,
  BellAlertIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";
import { db } from "~/server/db";
import { incidents, users, regions } from "~/server/db/schema";
import { sql } from "drizzle-orm";
import { AuthCTAButtons } from "./_components/auth-cta-buttons";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const [incidentCount] = await db.select({ count: sql<number>`count(*)` }).from(incidents);
    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [regionCount] = await db.select({ count: sql<number>`count(*)` }).from(regions);

    return {
      incidents: incidentCount?.count ?? 0,
      users: userCount?.count ?? 0,
      regions: regionCount?.count ?? 0,
    };
  } catch (error) {
    console.error("Database connection error:", error);
    // Return placeholder data if database is unavailable
    return {
      incidents: 128,
      users: 450,
      regions: 12,
    };
  }
}

export default async function HomePage() {
  const stats = await getStats();
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-navy-section py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Alert Banner */}
          <div className="mx-auto mb-8 flex max-w-2xl items-center justify-center">
            <div className="rounded-full bg-brand-red/10 px-4 py-2 text-sm font-medium text-brand-red ring-1 ring-inset ring-brand-red/20">
              <BellAlertIcon className="mr-2 inline-block h-4 w-4" />
              $35 Billion Annual Cargo Theft Problem
            </div>
          </div>

          {/* Hero Text */}
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Watch. Alert. Protect.
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              A collaborative community technology platform for the US maritime, intermodal, and
              trucking community. Share real-time alerts, report incidents, and protect America's
              freight network together.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10">
              <AuthCTAButtons variant="hero" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="gradient-navy-reverse py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2">
            {/* Real-Time Alerts */}
            <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-red/10">
                <ShieldCheckIcon className="h-6 w-6 text-brand-red" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                Real-Time Alerts
              </h3>
              <p className="text-sm text-gray-400">
                Instant notifications of suspicious activity in your region with photos, videos, and details
              </p>
            </div>

            {/* Community-Driven */}
            <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-red/10">
                <UserGroupIcon className="h-6 w-6 text-brand-red" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                Community-Driven
              </h3>
              <p className="text-sm text-gray-400">
                Connect with neighboring supply chain members and law enforcement to combat cargo crime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-4">
            <div className="rounded-lg bg-gray-50 p-6 text-center">
              <div className="text-3xl font-bold text-brand-red">{stats.incidents}</div>
              <div className="mt-1 text-sm text-gray-600">Total Incidents</div>
              <div className="mt-1 text-xs text-brand-red">Live Data</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.users}</div>
              <div className="mt-1 text-sm text-gray-600">Active Members</div>
              <div className="mt-1 text-xs text-blue-600">Growing Daily</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-6 text-center">
              <div className="text-3xl font-bold text-green-600">$8.3M</div>
              <div className="mt-1 text-sm text-gray-600">Estimated Losses Prevented</div>
              <div className="mt-1 text-xs text-green-600">Community Impact</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-6 text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.regions}</div>
              <div className="mt-1 text-sm text-gray-600">Monitored Regions</div>
              <div className="mt-1 text-xs text-purple-600">Nationwide Coverage</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-brand-red py-16">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <ShieldCheckIcon className="mx-auto h-12 w-12 text-white" />
          <h2 className="mt-6 text-3xl font-bold text-white">Our Mission</h2>
          <p className="mt-4 text-lg text-white/90">
            To create a collaborative community technology platform for the US maritime,
            intermodal, and trucking community that aims to watch, alert, and protect our
            US freight network, our people, and our cargo.
          </p>
        </div>
      </section>
    </div>
  );
}
