/**
 * CargoWatch Alert Feed Page
 * Real-time incident feed with functional filtering and scrollable container
 */

import { db } from "~/server/db";
import { incidents, regions } from "~/server/db/schema";
import { desc } from "drizzle-orm";
import { AlertFeedClient } from "./alert-feed-client";

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

export default async function AlertsPage() {
  const allIncidents = await getIncidents();
  const allRegions = await getRegions();

  return (
    <AlertFeedClient
      initialIncidents={allIncidents}
      regions={allRegions}
    />
  );
}
