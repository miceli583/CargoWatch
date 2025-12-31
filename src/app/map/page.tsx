/**
 * CargoWatch Interactive Map Page
 * Geographic view of incidents with filtering and statistics
 */

import { db } from "~/server/db";
import { incidents, regions } from "~/server/db/schema";
import { desc, sql } from "drizzle-orm";
import { MapViewClient } from "./map-view-client";

export const dynamic = "force-dynamic";

async function getIncidents() {
  return db
    .select()
    .from(incidents)
    .orderBy(desc(incidents.createdAt))
    .limit(200);
}

async function getRegions() {
  return db.select().from(regions).orderBy(regions.name);
}

async function getTopRegions() {
  return db
    .select()
    .from(regions)
    .orderBy(desc(regions.incidentCount))
    .limit(3);
}

async function getRecentIncidents() {
  return db
    .select()
    .from(incidents)
    .orderBy(desc(incidents.createdAt))
    .limit(5);
}

async function getStats() {
  const [incidentCount] = await db.select({ count: sql<number>`count(*)` }).from(incidents);
  return {
    totalIncidents: incidentCount?.count ?? 0,
  };
}

export default async function MapPage() {
  const allIncidents = await getIncidents();
  const allRegions = await getRegions();
  const topRegions = await getTopRegions();
  const recentIncidents = await getRecentIncidents();
  const stats = await getStats();

  return (
    <MapViewClient
      incidents={allIncidents}
      regions={allRegions}
      topRegions={topRegions}
      recentIncidents={recentIncidents}
      stats={stats}
    />
  );
}
