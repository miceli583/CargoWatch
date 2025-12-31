"use client";

/**
 * Alert Feed Client Component
 * Handles filtering, search, and scrollable display
 */

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ClockIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftIcon,
  EyeIcon,
  ShareIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import type { Incident, Region } from "~/server/db/schema";

interface Props {
  initialIncidents: Incident[];
  regions: Region[];
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case "critical":
      return "bg-severity-critical text-white";
    case "high":
      return "bg-severity-high text-white";
    case "medium":
      return "bg-severity-medium text-gray-900";
    case "low":
      return "bg-severity-low text-gray-900";
    default:
      return "bg-gray-600 text-white";
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "text-severity-critical";
    case "investigating":
      return "text-severity-high";
    case "resolved":
      return "text-severity-low";
    case "closed":
      return "text-gray-500";
    default:
      return "text-gray-400";
  }
}

function formatRelativeTime(date: Date) {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export function AlertFeedClient({ initialIncidents, regions }: Props) {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [regionSearch, setRegionSearch] = useState("");
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [expandedIncidentId, setExpandedIncidentId] = useState<string | null>(null);

  // Filter regions based on search
  const filteredRegions = useMemo(() => {
    if (!regionSearch) return regions;
    return regions.filter((r) =>
      r.name.toLowerCase().includes(regionSearch.toLowerCase())
    );
  }, [regions, regionSearch]);

  // Filter incidents based on selected filters
  const filteredIncidents = useMemo(() => {
    return initialIncidents.filter((incident) => {
      // Region filter
      if (selectedRegion !== "all" && incident.region !== selectedRegion) {
        return false;
      }

      // Severity filter
      if (selectedSeverity !== "all" && incident.severityLevel !== selectedSeverity) {
        return false;
      }

      // Type filter
      if (selectedType !== "all" && incident.incidentType !== selectedType) {
        return false;
      }

      return true;
    });
  }, [initialIncidents, selectedRegion, selectedSeverity, selectedType]);

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="border-b border-gray-700 bg-brand-navy-dark">
        <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Real-Time Alert Feed</h1>
              <p className="mt-1 text-sm text-gray-400">
                Community-reported incidents across the US freight network
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-brand-red">{initialIncidents.length}</div>
              <div className="text-xs text-gray-400">Total Alerts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-gray-700 bg-brand-navy">
        <div className="mx-auto max-w-7xl px-6 py-3 lg:px-8">
          <div className="mb-2 text-xs text-gray-400">
            Showing {filteredIncidents.length} of {initialIncidents.length} alerts
          </div>
          <div className="flex flex-wrap gap-4">
            {/* Region Filter with Search */}
            <div className="relative flex-1 min-w-[200px]">
              <label className="mb-1 block text-xs text-gray-400">Region</label>
              <div className="relative">
                <button
                  onClick={() => setShowRegionDropdown(!showRegionDropdown)}
                  className="w-full rounded-md border border-gray-600 bg-brand-navy-light px-4 py-2 text-left text-sm text-white hover:bg-brand-navy"
                >
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <span className="ml-6">
                    {selectedRegion === "all" ? "All Regions" : selectedRegion}
                  </span>
                </button>

                {showRegionDropdown && (
                  <div className="absolute z-10 mt-1 max-h-96 w-full overflow-y-auto rounded-md border border-gray-600 bg-brand-navy-dark shadow-lg">
                    {/* Search Input */}
                    <div className="sticky top-0 bg-brand-navy-dark p-2">
                      <input
                        type="text"
                        placeholder="Search regions..."
                        value={regionSearch}
                        onChange={(e) => setRegionSearch(e.target.value)}
                        className="w-full rounded border border-gray-600 bg-brand-navy px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-brand-red focus:outline-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {/* All Regions Option */}
                    <button
                      onClick={() => {
                        setSelectedRegion("all");
                        setShowRegionDropdown(false);
                        setRegionSearch("");
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-white hover:bg-brand-navy"
                    >
                      All Regions
                    </button>

                    {/* Region List */}
                    {filteredRegions.map((region) => (
                      <button
                        key={region.id}
                        onClick={() => {
                          setSelectedRegion(region.name);
                          setShowRegionDropdown(false);
                          setRegionSearch("");
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-white hover:bg-brand-navy"
                      >
                        {region.name}
                        <span className="ml-2 text-xs text-gray-500">
                          ({region.incidentCount} incidents)
                        </span>
                      </button>
                    ))}

                    {filteredRegions.length === 0 && (
                      <div className="px-4 py-8 text-center text-sm text-gray-500">
                        No regions found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Severity Filter */}
            <div className="flex-1 min-w-[180px]">
              <label className="mb-1 block text-xs text-gray-400">Severity</label>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="w-full rounded-md border border-gray-600 bg-brand-navy-light px-4 py-2 text-sm text-white"
              >
                <option value="all">All Severity</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex-1 min-w-[180px]">
              <label className="mb-1 block text-xs text-gray-400">Incident Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full rounded-md border border-gray-600 bg-brand-navy-light px-4 py-2 text-sm text-white"
              >
                <option value="all">All Types</option>
                <option value="theft">Theft</option>
                <option value="suspicious">Suspicious Activity</option>
                <option value="tampering">Tampering</option>
                <option value="attempted_break_in">Attempted Break-in</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Alerts Container */}
      <div className="flex-[3] min-h-[800px] overflow-hidden bg-brand-navy px-6 py-4 lg:px-8">
        <div className="mx-auto h-full max-w-5xl">
          <div className="h-full overflow-y-auto rounded-lg border-2 border-gray-700 bg-brand-navy-dark/30 p-4">
            <div className="space-y-4">
            {filteredIncidents.length === 0 ? (
              <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-12 text-center">
                <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-500" />
                <h3 className="mt-4 text-lg font-semibold text-white">No alerts found</h3>
                <p className="mt-2 text-gray-400">
                  Try adjusting your filters to see more results
                </p>
              </div>
            ) : (
              filteredIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="rounded-lg border border-gray-700 bg-brand-navy-light p-6 transition hover:border-gray-600"
                >
                  {/* Header */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <span
                          className={`inline-block rounded px-2 py-1 text-xs font-semibold uppercase ${getSeverityColor(incident.severityLevel)}`}
                        >
                          {incident.severityLevel}
                        </span>
                        <span className="rounded bg-gray-700 px-2 py-1 text-xs font-medium text-gray-300">
                          {incident.incidentType.replace(/_/g, " ")}
                        </span>
                        <span className={`text-xs font-medium uppercase ${getStatusColor(incident.status)}`}>
                          ● {incident.status}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-white">{incident.title}</h3>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <ClockIcon className="h-4 w-4" />
                        {formatRelativeTime(incident.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="mb-3 flex items-center gap-2 text-gray-300">
                    <MapPinIcon className="h-5 w-5 text-brand-red" />
                    <span className="font-medium">{incident.region}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400">{incident.specificLocation}</span>
                  </div>

                  {/* Description */}
                  <p className="mb-4 text-gray-300">{incident.description}</p>

                  {/* Details Grid */}
                  {(incident.cargoType || (incident.estimatedLoss && parseFloat(incident.estimatedLoss) > 0) || incident.incidentDate || incident.reporterCompany) && (
                    <div className="mb-4 grid grid-cols-2 gap-4 rounded bg-brand-navy p-4 md:grid-cols-4">
                      {incident.cargoType && (
                        <div>
                          <div className="text-xs text-gray-500">Cargo Type</div>
                          <div className="font-medium capitalize text-white">{incident.cargoType}</div>
                        </div>
                      )}
                      {incident.estimatedLoss && parseFloat(incident.estimatedLoss) > 0 && (
                        <div>
                          <div className="text-xs text-gray-500">Estimated Loss</div>
                          <div className="font-medium text-severity-critical">
                            ${parseFloat(incident.estimatedLoss).toLocaleString()}
                          </div>
                        </div>
                      )}
                      {incident.incidentDate && (
                        <div>
                          <div className="text-xs text-gray-500">Incident Date</div>
                          <div className="font-medium text-white">
                            {new Date(incident.incidentDate).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                      {incident.reporterCompany && (
                        <div>
                          <div className="text-xs text-gray-500">Reported By</div>
                          <div className="font-medium text-white">{incident.reporterCompany}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Evidence Indicators */}
                  {(incident.hasPhotos || incident.hasVideo) && (
                    <div className="mb-4 flex gap-2">
                      {incident.hasPhotos && (
                        <span className="inline-flex items-center gap-1 rounded bg-blue-600/20 px-2 py-1 text-xs text-blue-400">
                          📷 Photos ({incident.evidenceCount})
                        </span>
                      )}
                      {incident.hasVideo && (
                        <span className="inline-flex items-center gap-1 rounded bg-purple-600/20 px-2 py-1 text-xs text-purple-400">
                          🎥 Video
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer Stats */}
                  <div className="flex items-center gap-4 border-t border-gray-700 pt-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <EyeIcon className="h-4 w-4" />
                      {incident.viewCount}
                    </div>
                    <div className="flex items-center gap-1">
                      <ChatBubbleLeftIcon className="h-4 w-4" />
                      {incident.commentCount}
                    </div>
                    <div className="flex items-center gap-1">
                      <ShareIcon className="h-4 w-4" />
                      {incident.shareCount}
                    </div>
                    <button
                      onClick={() => setExpandedIncidentId(
                        expandedIncidentId === incident.id ? null : incident.id
                      )}
                      className="ml-auto text-brand-red hover:text-brand-red-hover"
                    >
                      {expandedIncidentId === incident.id ? "Hide Details ↑" : "View Details →"}
                    </button>
                  </div>

                  {/* Expanded Details */}
                  {expandedIncidentId === incident.id && (
                    <div className="mt-4 space-y-4 border-t border-gray-700 pt-4">
                      {/* Full Location Details */}
                      <div className="rounded-lg bg-brand-navy p-4">
                        <h4 className="mb-2 text-sm font-semibold text-white">Full Location Details</h4>
                        <div className="grid gap-3 text-sm md:grid-cols-2">
                          <div>
                            <span className="text-gray-500">Region:</span>
                            <span className="ml-2 text-white">{incident.region}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Specific Location:</span>
                            <span className="ml-2 text-white">{incident.specificLocation}</span>
                          </div>
                          {incident.latitude && incident.longitude && (
                            <>
                              <div>
                                <span className="text-gray-500">Latitude:</span>
                                <span className="ml-2 font-mono text-white">{incident.latitude}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Longitude:</span>
                                <span className="ml-2 font-mono text-white">{incident.longitude}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Incident Timeline */}
                      <div className="rounded-lg bg-brand-navy p-4">
                        <h4 className="mb-2 text-sm font-semibold text-white">Timeline</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Incident Occurred:</span>
                            <span className="text-white">
                              {new Date(incident.incidentDate).toLocaleDateString()} at {incident.incidentTime || "Unknown"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Reported:</span>
                            <span className="text-white">
                              {new Date(incident.createdAt).toLocaleString()}
                            </span>
                          </div>
                          {incident.updatedAt && incident.updatedAt.toString() !== incident.createdAt.toString() && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Last Updated:</span>
                              <span className="text-white">
                                {new Date(incident.updatedAt).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Reporter Information */}
                      {(incident.reporterName || incident.reporterCompany || incident.reporterContact) && (
                        <div className="rounded-lg bg-brand-navy p-4">
                          <h4 className="mb-2 text-sm font-semibold text-white">Reporter Information</h4>
                          <div className="space-y-2 text-sm">
                            {incident.reporterName && (
                              <div className="flex justify-between">
                                <span className="text-gray-500">Name:</span>
                                <span className="text-white">{incident.reporterName}</span>
                              </div>
                            )}
                            {incident.reporterCompany && (
                              <div className="flex justify-between">
                                <span className="text-gray-500">Company:</span>
                                <span className="text-white">{incident.reporterCompany}</span>
                              </div>
                            )}
                            {incident.reporterContact && (
                              <div className="flex justify-between">
                                <span className="text-gray-500">Contact:</span>
                                <span className="text-white">{incident.reporterContact}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Engagement Stats */}
                      <div className="rounded-lg bg-brand-navy p-4">
                        <h4 className="mb-2 text-sm font-semibold text-white">Community Engagement</h4>
                        <div className="grid grid-cols-3 gap-4 text-center text-sm">
                          <div>
                            <div className="text-2xl font-bold text-blue-400">{incident.viewCount}</div>
                            <div className="text-gray-500">Views</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-400">{incident.commentCount}</div>
                            <div className="text-gray-500">Comments</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-purple-400">{incident.shareCount}</div>
                            <div className="text-gray-500">Shares</div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button className="flex-1 rounded-md border border-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-navy">
                          Share Alert
                        </button>
                        <button className="flex-1 rounded-md border border-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-navy">
                          Add Comment
                        </button>
                        <button className="flex-1 rounded-md bg-brand-red px-4 py-2 text-sm font-semibold text-white hover:bg-brand-red-hover">
                          Contact Reporter
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed CTA at bottom - Outside scrollable container */}
      <div className="border-t border-gray-700 bg-brand-navy-dark">
        <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
          <div className="rounded-lg border border-brand-red/50 bg-brand-red/10 p-6 text-center">
            <ExclamationTriangleIcon className="mx-auto h-10 w-10 text-brand-red" />
            <h3 className="mt-3 text-lg font-semibold text-white">
              See something suspicious?
            </h3>
            <p className="mt-1 text-sm text-gray-300">
              Report an incident to alert the community and law enforcement
            </p>
            <Link
              href="/report"
              className="mt-4 inline-block rounded-md bg-brand-red px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-red-hover"
            >
              Report an Incident
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
