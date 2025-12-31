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
  return db
    .select()
    .from(incidents)
    .orderBy(desc(incidents.createdAt))
    .limit(200);
}

async function getRegions() {
  return db.select().from(regions).orderBy(regions.name);
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
