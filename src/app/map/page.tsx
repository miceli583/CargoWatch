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
  try {
    return await db
      .select()
      .from(incidents)
      .orderBy(desc(incidents.createdAt))
      .limit(200);
  } catch (error) {
    console.error("Database error fetching incidents:", error);
    return [];
  }
}

async function getRegions() {
  try {
    return await db.select().from(regions).orderBy(regions.name);
  } catch (error) {
    console.error("Database error fetching regions:", error);
    return [];
  }
}

async function getTopRegions() {
  try {
    return await db
      .select()
      .from(regions)
      .orderBy(desc(regions.incidentCount))
      .limit(3);
  } catch (error) {
    console.error("Database error fetching top regions:", error);
    return [];
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
    console.error("Database error fetching recent incidents:", error);
    return [];
  }
}

async function getStats() {
  try {
    const [incidentCount] = await db.select({ count: sql<number>`count(*)` }).from(incidents);
    return {
      totalIncidents: incidentCount?.count ?? 0,
    };
  } catch (error) {
    console.error("Database error fetching stats:", error);
    return {
      totalIncidents: 0,
    };
  }
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
