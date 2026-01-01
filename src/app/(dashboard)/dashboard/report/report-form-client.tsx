"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPinIcon,
  CameraIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { api } from "~/trpc/react";
import type { Region } from "~/server/db/schema";

interface ReportFormClientProps {
  regions: Region[];
}

export function ReportFormClient({ regions }: ReportFormClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    incidentType: "",
    severityLevel: "",
    title: "",
    description: "",
    region: "",
    specificLocation: "",
    cargoType: "",
    latitude: "",
    longitude: "",
    incidentDate: "",
    incidentTime: "",
    estimatedLoss: "",
    reporterName: "",
    reporterCompany: "",
    reporterContact: "",
    confirmAccuracy: false,
  });

  const createIncident = api.incidents.create.useMutation({
    onSuccess: () => {
      setSubmitSuccess(true);
      setSubmitError(null);
      setIsSubmitting(false);

      // Redirect to alerts page after 2 seconds
      setTimeout(() => {
        router.push("/alerts");
      }, 2000);
    },
    onError: (error) => {
      setSubmitError(error.message);
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.confirmAccuracy) {
      setSubmitError("Please confirm that the information provided is accurate");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Find the selected region to get coordinates if not manually entered
      const selectedRegion = regions.find((r) => r.name === formData.region);

      // Use manual coordinates if provided, otherwise use region center coordinates
      const latitude = formData.latitude || selectedRegion?.latitude || "";
      const longitude = formData.longitude || selectedRegion?.longitude || "";

      createIncident.mutate({
        incidentType: formData.incidentType,
        severityLevel: formData.severityLevel,
        title: formData.title,
        description: formData.description,
        region: formData.region,
        specificLocation: formData.specificLocation,
        incidentDate: new Date(formData.incidentDate),
        incidentTime: formData.incidentTime || undefined,
        cargoType: formData.cargoType || undefined,
        estimatedLoss: formData.estimatedLoss ? parseFloat(formData.estimatedLoss) : undefined,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "An error occurred");
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  if (submitSuccess) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-4 text-2xl font-bold text-white">Report Submitted Successfully!</h2>
          <p className="mt-2 text-gray-400">
            Your incident report has been published to the alert feed.
          </p>
          <p className="mt-1 text-sm text-gray-500">Redirecting to alerts page...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Error Display */}
      {submitError && (
        <div className="rounded-lg border border-red-500 bg-red-500/10 p-4">
          <div className="flex items-center gap-3">
            <XCircleIcon className="h-6 w-6 text-red-500" />
            <div>
              <p className="font-medium text-red-500">Error submitting report</p>
              <p className="text-sm text-red-400">{submitError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Incident Type & Severity */}
      <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-6">
        <h2 className="mb-6 text-xl font-semibold text-white">Incident Details</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Incident Type *
            </label>
            <select
              name="incidentType"
              value={formData.incidentType}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-600 bg-brand-navy px-4 py-3 text-white focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
            >
              <option value="">Select type...</option>
              <option value="theft">Cargo Theft</option>
              <option value="suspicious">Suspicious Activity</option>
              <option value="tampering">Tampering</option>
              <option value="attempted_break_in">Attempted Break-in</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Severity Level *
            </label>
            <select
              name="severityLevel"
              value={formData.severityLevel}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-600 bg-brand-navy px-4 py-3 text-white focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
            >
              <option value="">Select severity...</option>
              <option value="critical">Critical - Active threat/theft in progress</option>
              <option value="high">High - Recent theft or significant threat</option>
              <option value="medium">Medium - Suspicious activity</option>
              <option value="low">Low - Minor concern or observation</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-gray-300">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Brief description (e.g., 'Trailer theft at truck stop')"
            className="w-full rounded-md border border-gray-600 bg-brand-navy px-4 py-3 text-white placeholder-gray-500 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
          />
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Detailed Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={6}
            placeholder="Provide as much detail as possible: what happened, when, suspect descriptions, vehicle information, etc."
            className="w-full rounded-md border border-gray-600 bg-brand-navy px-4 py-3 text-white placeholder-gray-500 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
          />
        </div>
      </div>

      {/* Location */}
      <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-6">
        <div className="mb-6 flex items-center gap-2">
          <MapPinIcon className="h-6 w-6 text-brand-red" />
          <h2 className="text-xl font-semibold text-white">Location Information</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Region *</label>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-600 bg-brand-navy px-4 py-3 text-white focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
            >
              <option value="">Select region...</option>
              {regions.map((region) => (
                <option key={region.id} value={region.name}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Cargo Type (if applicable)
            </label>
            <select
              name="cargoType"
              value={formData.cargoType}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-600 bg-brand-navy px-4 py-3 text-white focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
            >
              <option value="">Select cargo type...</option>
              <option value="electronics">Electronics</option>
              <option value="pharmaceuticals">Pharmaceuticals</option>
              <option value="food">Food & Beverage</option>
              <option value="general">General Freight</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Specific Location *
          </label>
          <input
            type="text"
            name="specificLocation"
            value={formData.specificLocation}
            onChange={handleChange}
            required
            placeholder="e.g., 'I-40 Pilot Travel Center, Exit 12' or 'Port of Long Beach, Pier J'"
            className="w-full rounded-md border border-gray-600 bg-brand-navy px-4 py-3 text-white placeholder-gray-500 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
          />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Latitude (optional)
            </label>
            <input
              type="text"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="e.g., 35.1495"
              className="w-full rounded-md border border-gray-600 bg-brand-navy px-4 py-3 text-white placeholder-gray-500 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Longitude (optional)
            </label>
            <input
              type="text"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="e.g., -90.0490"
              className="w-full rounded-md border border-gray-600 bg-brand-navy px-4 py-3 text-white placeholder-gray-500 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
            />
          </div>
        </div>
      </div>

      {/* Time Information */}
      <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-6">
        <div className="mb-6 flex items-center gap-2">
          <ClockIcon className="h-6 w-6 text-brand-red" />
          <h2 className="text-xl font-semibold text-white">When Did This Occur?</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Incident Date *
            </label>
            <input
              type="date"
              name="incidentDate"
              value={formData.incidentDate}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-600 bg-brand-navy px-4 py-3 text-white focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Approximate Time
            </label>
            <input
              type="time"
              name="incidentTime"
              value={formData.incidentTime}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-600 bg-brand-navy px-4 py-3 text-white focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Estimated Loss (if applicable)
          </label>
          <input
            type="number"
            name="estimatedLoss"
            value={formData.estimatedLoss}
            onChange={handleChange}
            placeholder="Dollar amount"
            className="w-full rounded-md border border-gray-600 bg-brand-navy px-4 py-3 text-white placeholder-gray-500 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
          />
        </div>
      </div>

      {/* Evidence Upload - Placeholder for now */}
      <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-6">
        <div className="mb-6 flex items-center gap-2">
          <CameraIcon className="h-6 w-6 text-brand-red" />
          <h2 className="text-xl font-semibold text-white">Evidence (Photos/Videos)</h2>
        </div>

        <div className="rounded-lg border-2 border-dashed border-gray-600 p-12 text-center">
          <CameraIcon className="mx-auto h-12 w-12 text-gray-500" />
          <p className="mt-4 text-gray-400">Evidence upload coming soon</p>
          <p className="mt-2 text-sm text-gray-500">
            For now, please include photo/video descriptions in the detailed description above
          </p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-6">
        <h2 className="mb-6 text-xl font-semibold text-white">Your Information</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Your Name *
            </label>
            <input
              type="text"
              name="reporterName"
              value={formData.reporterName}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-600 bg-brand-navy px-4 py-3 text-white focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Company/Organization
            </label>
            <input
              type="text"
              name="reporterCompany"
              value={formData.reporterCompany}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-600 bg-brand-navy px-4 py-3 text-white focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Email or Phone *
            </label>
            <input
              type="text"
              name="reporterContact"
              value={formData.reporterContact}
              onChange={handleChange}
              required
              placeholder="Email address or phone number"
              className="w-full rounded-md border border-gray-600 bg-brand-navy px-4 py-3 text-white placeholder-gray-500 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="rounded-lg border border-brand-red/50 bg-brand-red/10 p-6">
        <div className="flex items-start gap-4">
          <input
            type="checkbox"
            name="confirmAccuracy"
            checked={formData.confirmAccuracy}
            onChange={handleChange}
            required
            className="mt-1 h-4 w-4 rounded border-gray-600 bg-brand-navy text-brand-red focus:ring-brand-red"
          />
          <div className="flex-1">
            <label className="text-sm text-gray-300">
              I confirm that the information provided is accurate to the best of my
              knowledge. I understand this report may be shared with law enforcement and
              other network members.
            </label>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-md bg-brand-red px-6 py-4 text-lg font-semibold text-white hover:bg-brand-red-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-400">
          Your report will be published to the alert feed immediately
        </p>
      </div>
    </form>
  );
}
