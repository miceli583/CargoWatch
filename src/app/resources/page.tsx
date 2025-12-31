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
    <div className="w-full">
      {/* Header */}
      <div className="border-b border-gray-700 bg-brand-navy-dark px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-white">Security Resources</h1>
          <p className="mt-2 text-gray-400">
            Educational materials, security products, and industry partnerships to help combat cargo crime
          </p>
        </div>
      </div>

      {/* Security Products & Services */}
      <div className="bg-brand-navy py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white">Security Products & Services</h2>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {/* GPS Tracking */}
            <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-brand-red/10 p-2">
                  <SignalIcon className="h-6 w-6 text-brand-red" />
                </div>
                <h3 className="text-lg font-semibold text-white">GPS Tracking</h3>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-white">Tive</h4>
                  <p className="mt-1 text-sm text-gray-400">
                    Real-time location and condition tracking sensors
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-white">Arviem</h4>
                  <p className="mt-1 text-sm text-gray-400">
                    Multi-modal cargo monitoring solutions
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-white">CargoNet</h4>
                  <p className="mt-1 text-sm text-gray-400">
                    National cargo theft database and tracking
                  </p>
                </div>
              </div>
            </div>

            {/* Physical Security */}
            <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-brand-red/10 p-2">
                  <LockClosedIcon className="h-6 w-6 text-brand-red" />
                </div>
                <h3 className="text-lg font-semibold text-white">Physical Security</h3>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-white">High-Security Seals</h4>
                  <p className="mt-1 text-sm text-gray-400">
                    Tamper-evident container seals
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-white">Smart Locks</h4>
                  <p className="mt-1 text-sm text-gray-400">
                    IoT-enabled locking systems with alerts
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-white">Kingpin Locks</h4>
                  <p className="mt-1 text-sm text-gray-400">
                    Prevent unauthorized trailer coupling
                  </p>
                </div>
              </div>
            </div>

            {/* Surveillance */}
            <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-brand-red/10 p-2">
                  <VideoCameraIcon className="h-6 w-6 text-brand-red" />
                </div>
                <h3 className="text-lg font-semibold text-white">Surveillance</h3>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-white">Dash Cameras</h4>
                  <p className="mt-1 text-sm text-gray-400">
                    HD recording with cloud backup
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-white">Yard Cameras</h4>
                  <p className="mt-1 text-sm text-gray-400">
                    Perimeter monitoring systems
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-white">AI-Powered Analytics</h4>
                  <p className="mt-1 text-sm text-gray-400">
                    Automated threat detection
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Resources */}
      <div className="bg-brand-navy-dark py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white">Educational Resources</h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* Best Practices Guide */}
            <div className="group rounded-lg border border-gray-700 bg-brand-navy p-6 transition hover:bg-brand-navy-light">
              <div className="flex items-start justify-between">
                <div className="rounded-lg bg-brand-red/10 p-2">
                  <ShieldCheckIcon className="h-6 w-6 text-brand-red" />
                </div>
                <span className="rounded-full bg-green-600/20 px-3 py-1 text-xs font-semibold text-green-400">
                  Guide
                </span>
              </div>

              <h3 className="mt-4 text-lg font-semibold text-white">
                Best Practices for Cargo Security
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                Comprehensive guide to preventing theft and securing loads
              </p>

              <a
                href="#"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-red hover:text-brand-red-hover"
              >
                View Resource
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </a>
            </div>

            {/* Whitepaper */}
            <div className="group rounded-lg border border-gray-700 bg-brand-navy p-6 transition hover:bg-brand-navy-light">
              <div className="flex items-start justify-between">
                <div className="rounded-lg bg-brand-red/10 p-2">
                  <DocumentTextIcon className="h-6 w-6 text-brand-red" />
                </div>
                <span className="rounded-full bg-purple-600/20 px-3 py-1 text-xs font-semibold text-purple-400">
                  Research
                </span>
              </div>

              <h3 className="mt-4 text-lg font-semibold text-white">
                Cargo Theft in America Whitepaper
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                IMC Logistics analysis of trends and prevention strategies
              </p>

              <a
                href="#"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-red hover:text-brand-red-hover"
              >
                View Resource
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </a>
            </div>

            {/* Law Enforcement */}
            <div className="group rounded-lg border border-gray-700 bg-brand-navy p-6 transition hover:bg-brand-navy-light">
              <div className="flex items-start justify-between">
                <div className="rounded-lg bg-brand-red/10 p-2">
                  <DocumentTextIcon className="h-6 w-6 text-brand-red" />
                </div>
                <span className="rounded-full bg-blue-600/20 px-3 py-1 text-xs font-semibold text-blue-400">
                  Directory
                </span>
              </div>

              <h3 className="mt-4 text-lg font-semibold text-white">
                Law Enforcement Contacts
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                Directory of cargo theft task forces by region
              </p>

              <a
                href="#"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-red hover:text-brand-red-hover"
              >
                View Resource
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </a>
            </div>

            {/* 2024 Report */}
            <div className="group rounded-lg border border-gray-700 bg-brand-navy p-6 transition hover:bg-brand-navy-light">
              <div className="flex items-start justify-between">
                <div className="rounded-lg bg-brand-red/10 p-2">
                  <ChartBarIcon className="h-6 w-6 text-brand-red" />
                </div>
                <span className="rounded-full bg-orange-600/20 px-3 py-1 text-xs font-semibold text-orange-400">
                  Report
                </span>
              </div>

              <h3 className="mt-4 text-lg font-semibold text-white">
                2024 Cargo Theft Report
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                Annual statistics and emerging threat analysis
              </p>

              <a
                href="#"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-red hover:text-brand-red-hover"
              >
                View Resource
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Industry Partners */}
      <div className="bg-brand-navy py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white">Industry Partners</h2>
          <p className="mt-2 text-gray-400">
            Cargo Watch collaborates with leading security providers and industry organizations
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* CargoNet */}
            <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-6">
              <h3 className="font-semibold text-white">CargoNet</h3>
              <p className="mt-2 text-sm text-gray-400">Theft Prevention</p>
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
            <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-6">
              <h3 className="font-semibold text-white">Overhaul</h3>
              <p className="mt-2 text-sm text-gray-400">Supply Chain Security</p>
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
            <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-6">
              <h3 className="font-semibold text-white">FreightWatch</h3>
              <p className="mt-2 text-sm text-gray-400">Intelligence & Recovery</p>
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
            <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-6">
              <h3 className="font-semibold text-white">TAPA</h3>
              <p className="mt-2 text-sm text-gray-400">Security Standards</p>
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
      <div className="bg-brand-navy-dark py-16">
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
