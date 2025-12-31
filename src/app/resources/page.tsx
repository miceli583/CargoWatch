/**
 * CargoWatch Resources Page
 * Security products, educational materials, and industry partnerships
 */

import {
  SignalIcon,
  LockClosedIcon,
  VideoCameraIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

export const dynamic = "force-dynamic";

export default function ResourcesPage() {
  return (
    <div className="w-full bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900">Security Resources</h1>
          <p className="mt-3 text-lg text-gray-600">
            Educational materials, security products, and industry partnerships to help combat cargo crime
          </p>
        </div>
      </div>

      {/* Security Products & Services */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Security Products & Services</h2>

          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            {/* GPS Tracking */}
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-red-50 p-3">
                  <SignalIcon className="h-6 w-6 text-brand-red" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">GPS Tracking</h3>
              </div>

              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900">Tive</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Real-time location and condition tracking sensors
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">Arviem</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Multi-modal cargo monitoring solutions
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">CargoNet</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    National cargo theft database and tracking
                  </p>
                </div>
              </div>
            </div>

            {/* Physical Security */}
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-red-50 p-3">
                  <LockClosedIcon className="h-6 w-6 text-brand-red" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Physical Security</h3>
              </div>

              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900">High-Security Seals</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Tamper-evident container seals
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">Smart Locks</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    IoT-enabled locking systems with alerts
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">Kingpin Locks</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Prevent unauthorized trailer coupling
                  </p>
                </div>
              </div>
            </div>

            {/* Surveillance */}
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-red-50 p-3">
                  <VideoCameraIcon className="h-6 w-6 text-brand-red" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Surveillance</h3>
              </div>

              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900">Dash Cameras</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    HD recording with cloud backup
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">Yard Cameras</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Perimeter monitoring systems
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900">AI-Powered Analytics</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Automated threat detection
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Resources */}
      <div className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Educational Resources</h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {/* Best Practices Guide */}
            <div className="group rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="rounded-lg bg-blue-50 p-3">
                  <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
                </div>
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  Guide
                </span>
              </div>

              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Best Practices for Cargo Security
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Comprehensive guide to preventing theft and securing loads
              </p>

              <a
                href="#"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-red hover:text-brand-red-hover"
              >
                View Resource
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </a>
            </div>

            {/* Whitepaper */}
            <div className="group rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="rounded-lg bg-blue-50 p-3">
                  <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                </div>
                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                  Research
                </span>
              </div>

              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Cargo Theft in America Whitepaper
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                IMC Logistics analysis of trends and prevention strategies
              </p>

              <a
                href="#"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-red hover:text-brand-red-hover"
              >
                View Resource
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </a>
            </div>

            {/* Law Enforcement */}
            <div className="group rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="rounded-lg bg-blue-50 p-3">
                  <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  Directory
                </span>
              </div>

              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Law Enforcement Contacts
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Directory of cargo theft task forces by region
              </p>

              <a
                href="#"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-red hover:text-brand-red-hover"
              >
                View Resource
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </a>
            </div>

            {/* 2024 Report */}
            <div className="group rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="rounded-lg bg-blue-50 p-3">
                  <ChartBarIcon className="h-6 w-6 text-blue-600" />
                </div>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                  Report
                </span>
              </div>

              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                2024 Cargo Theft Report
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Annual statistics and emerging threat analysis
              </p>

              <a
                href="#"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-red hover:text-brand-red-hover"
              >
                View Resource
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Industry Partners */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">Industry Partners</h2>
          <p className="mt-3 text-gray-600">
            Cargo Watch collaborates with leading security providers and industry organizations
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* CargoNet */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h3 className="font-semibold text-gray-900">CargoNet</h3>
              <p className="mt-2 text-sm text-gray-600">Theft Prevention</p>
              <a
                href="https://cargonet.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm text-brand-red hover:text-brand-red-hover"
              >
                cargonet.com
                <ArrowTopRightOnSquareIcon className="h-3 w-3" />
              </a>
            </div>

            {/* Overhaul */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h3 className="font-semibold text-gray-900">Overhaul</h3>
              <p className="mt-2 text-sm text-gray-600">Supply Chain Security</p>
              <a
                href="https://overhaul.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm text-brand-red hover:text-brand-red-hover"
              >
                overhaul.com
                <ArrowTopRightOnSquareIcon className="h-3 w-3" />
              </a>
            </div>

            {/* FreightWatch */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h3 className="font-semibold text-gray-900">FreightWatch</h3>
              <p className="mt-2 text-sm text-gray-600">Intelligence & Recovery</p>
              <a
                href="https://freightwatch.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm text-brand-red hover:text-brand-red-hover"
              >
                freightwatch.com
                <ArrowTopRightOnSquareIcon className="h-3 w-3" />
              </a>
            </div>

            {/* TAPA */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h3 className="font-semibold text-gray-900">TAPA</h3>
              <p className="mt-2 text-sm text-gray-600">Security Standards</p>
              <a
                href="https://tapa-global.org"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm text-brand-red hover:text-brand-red-hover"
              >
                tapa-global.org
                <ArrowTopRightOnSquareIcon className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Partner CTA */}
      <div className="bg-brand-navy-dark py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-red/20">
            <ShieldCheckIcon className="h-8 w-8 text-brand-red" />
          </div>

          <h2 className="text-3xl font-bold text-white">Partner with Cargo Watch</h2>
          <p className="mt-4 text-lg text-gray-300">
            Reach 12,000+ transportation professionals across the US freight network. Contact us about advertising your security products and services.
          </p>

          <button className="mt-8 rounded-lg bg-brand-red px-8 py-3 font-semibold text-white transition hover:bg-brand-red-hover">
            Learn About Advertising
          </button>
        </div>
      </div>
    </div>
  );
}
