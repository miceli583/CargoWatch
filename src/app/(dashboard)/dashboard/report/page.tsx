/**
 * CargoWatch Report Incident Page
 * Multi-step form for reporting cargo theft and suspicious activity
 */

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { db } from "~/server/db";
import { regions } from "~/server/db/schema";
import { ReportFormClient } from "./report-form-client";

export const dynamic = "force-dynamic";

async function getRegions() {
  return db.select().from(regions).orderBy(regions.name);
}

export default async function ReportPage() {
  const allRegions = await getRegions();

  return (
    <div className="w-full">
      {/* Header */}
      <div className="border-b border-gray-700 bg-brand-navy-dark">
        <div className="mx-auto max-w-4xl px-6 py-8 lg:px-8">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="h-10 w-10 text-brand-red" />
            <div>
              <h1 className="text-3xl font-bold text-white">Report an Incident</h1>
              <p className="mt-1 text-gray-400">
                Help protect the network by reporting suspicious activity or cargo theft
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-brand-navy py-12">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <ReportFormClient regions={allRegions} />
        </div>
      </div>
    </div>
  );
}
