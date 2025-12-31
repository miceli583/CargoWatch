/**
 * CargoWatch About Page
 * Mission, problem/solution, market opportunity, and team
 */

import {
  ShieldCheckIcon,
  UserGroupIcon,
  ChartBarIcon,
  GlobeAmericasIcon,
  TruckIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Hero */}
      <div className="border-b border-gray-700 bg-gradient-to-b from-brand-navy-dark to-brand-navy">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="text-center">
            <ShieldCheckIcon className="mx-auto h-16 w-16 text-brand-red" />
            <h1 className="mt-6 text-4xl font-bold text-white">
              Protecting America's Freight Network
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-xl text-gray-300">
              CargoWatch is a collaborative community technology platform designed to watch, alert,
              and protect our US freight network, our people, and our cargo.
            </p>
          </div>
        </div>
      </div>

      {/* The Problem */}
      <div className="bg-brand-red py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">The $35 Billion Problem</h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-white/90">
              Cargo theft is a massive, growing crisis affecting the entire US supply chain
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white/10 p-6 text-center backdrop-blur">
              <div className="text-4xl font-bold text-white">$35B+</div>
              <div className="mt-2 text-white/90">Annual Losses</div>
              <p className="mt-3 text-sm text-white/75">
                Cargo theft costs the US economy over $35 billion annually and rising
              </p>
            </div>

            <div className="rounded-lg bg-white/10 p-6 text-center backdrop-blur">
              <div className="text-4xl font-bold text-white">1,247</div>
              <div className="mt-2 text-white/90">Incidents in 2024</div>
              <p className="mt-3 text-sm text-white/75">
                Reported cargo thefts increased 18% year-over-year with organized crime involvement
              </p>
            </div>

            <div className="rounded-lg bg-white/10 p-6 text-center backdrop-blur">
              <div className="text-4xl font-bold text-white">72 Hours</div>
              <div className="mt-2 text-white/90">Average Response Time</div>
              <p className="mt-3 text-sm text-white/75">
                Most incidents go unreported or reported too late, allowing criminals to escape
              </p>
            </div>
          </div>

          <div className="mt-12 rounded-lg bg-white/10 p-8 backdrop-blur">
            <h3 className="text-xl font-semibold text-white">Why This Happens</h3>
            <ul className="mt-4 space-y-3 text-white/90">
              <li className="flex items-start gap-3">
                <span className="text-brand-red">•</span>
                <span>
                  <strong>Fragmented Communication:</strong> Drivers, carriers, and law enforcement
                  lack a unified platform to share real-time threat intelligence
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-red">•</span>
                <span>
                  <strong>Slow Response Times:</strong> By the time incidents are reported through
                  traditional channels, stolen cargo has often crossed state lines
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-red">•</span>
                <span>
                  <strong>Organized Crime:</strong> Professional cargo theft rings operate across
                  regions, but information sharing remains siloed
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-red">•</span>
                <span>
                  <strong>Hotspot Blindness:</strong> Drivers unknowingly park in high-risk areas
                  without access to recent threat data
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* The Solution */}
      <div className="gradient-navy-diagonal py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">How CargoWatch Solves This</h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-300">
              A real-time, community-driven platform that connects everyone in the freight
              ecosystem
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-red/10">
                <UserGroupIcon className="h-6 w-6 text-brand-red" />
              </div>
              <h3 className="text-xl font-semibold text-white">Real-Time Community Alerts</h3>
              <p className="mt-3 text-gray-300">
                Drivers, security personnel, and law enforcement share incidents instantly. See
                threats as they happen, not days later. Community-verified reports create a
                trusted network of protection.
              </p>
            </div>

            <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-red/10">
                <GlobeAmericasIcon className="h-6 w-6 text-brand-red" />
              </div>
              <h3 className="text-xl font-semibold text-white">Geolocation Intelligence</h3>
              <p className="mt-3 text-gray-300">
                Automatic routing to nearest law enforcement. Real-time hotspot mapping shows
                high-risk areas. Region-specific alerts keep you informed about threats along your
                route.
              </p>
            </div>

            <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-red/10">
                <ShieldCheckIcon className="h-6 w-6 text-brand-red" />
              </div>
              <h3 className="text-xl font-semibold text-white">Law Enforcement Integration</h3>
              <p className="mt-3 text-gray-300">
                Direct reporting to police departments, FBI Cargo Theft Program, and CargoNet.
                Automated evidence collection and chain of custody. Faster response times save
                millions in recovered cargo.
              </p>
            </div>

            <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-red/10">
                <TruckIcon className="h-6 w-6 text-brand-red" />
              </div>
              <h3 className="text-xl font-semibold text-white">Driver Empowerment</h3>
              <p className="mt-3 text-gray-300">
                One-button alerts during emergencies. Photo/video evidence upload from mobile
                devices. Satellite connectivity (Globalstar) for remote areas without cell service.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Market Opportunity */}
      <div className="gradient-navy-section py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <ChartBarIcon className="mx-auto h-12 w-12 text-brand-red" />
            <h2 className="mt-6 text-3xl font-bold text-white">Massive Market Opportunity</h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-red">3.5M+</div>
              <div className="mt-2 text-white">Commercial Truck Drivers</div>
              <p className="mt-2 text-sm text-gray-400">
                Potential users across the US freight industry
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-brand-red">15,000+</div>
              <div className="mt-2 text-white">Law Enforcement Agencies</div>
              <p className="mt-2 text-sm text-gray-400">
                Departments nationwide handling cargo theft
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-brand-red">$900B+</div>
              <div className="mt-2 text-white">Annual Freight Value</div>
              <p className="mt-2 text-sm text-gray-400">
                Total cargo moving through US supply chain
              </p>
            </div>
          </div>

          <div className="mt-12 rounded-lg border border-gray-700 bg-brand-navy p-8">
            <h3 className="text-xl font-semibold text-white">Priority Regions (Phase 1)</h3>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-4">
                <div className="font-semibold text-white">Memphis, TN</div>
                <div className="mt-1 text-sm text-gray-400">I-40/I-55 Freight Hub</div>
                <div className="mt-2 text-xs text-severity-high">247 incidents in 2024</div>
              </div>
              <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-4">
                <div className="font-semibold text-white">Los Angeles, CA</div>
                <div className="mt-1 text-sm text-gray-400">Port Complex & Distribution</div>
                <div className="mt-2 text-xs text-severity-critical">518 incidents in 2024</div>
              </div>
              <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-4">
                <div className="font-semibold text-white">Dallas, TX</div>
                <div className="mt-1 text-sm text-gray-400">Central Distribution Hub</div>
                <div className="mt-2 text-xs text-severity-high">189 incidents in 2024</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Who We Serve */}
      <div className="gradient-navy-reverse py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Who We Serve</h2>
            <p className="mt-4 text-gray-300">
              CargoWatch brings together every stakeholder in freight security
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-4">
            <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-6 text-center">
              <TruckIcon className="mx-auto h-10 w-10 text-brand-red" />
              <div className="mt-4 font-semibold text-white">Truck Drivers</div>
              <p className="mt-2 text-sm text-gray-400">
                Report incidents, receive alerts, stay informed about threats
              </p>
            </div>

            <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-6 text-center">
              <BuildingOfficeIcon className="mx-auto h-10 w-10 text-brand-red" />
              <div className="mt-4 font-semibold text-white">Carriers & Fleets</div>
              <p className="mt-2 text-sm text-gray-400">
                Protect assets, monitor routes, reduce insurance costs
              </p>
            </div>

            <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-6 text-center">
              <ShieldCheckIcon className="mx-auto h-10 w-10 text-brand-red" />
              <div className="mt-4 font-semibold text-white">Law Enforcement</div>
              <p className="mt-2 text-sm text-gray-400">
                Receive real-time reports, coordinate responses, track patterns
              </p>
            </div>

            <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-6 text-center">
              <UserGroupIcon className="mx-auto h-10 w-10 text-brand-red" />
              <div className="mt-4 font-semibold text-white">Security Personnel</div>
              <p className="mt-2 text-sm text-gray-400">
                Monitor facilities, share intelligence, prevent losses
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-gray-700 gradient-navy-reverse py-16">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-bold text-white">Join the Network</h2>
          <p className="mt-4 text-xl text-gray-300">
            Together, we can protect America's freight network and stop organized cargo theft
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <a
              href="/report"
              className="rounded-md bg-brand-red px-8 py-4 text-lg font-semibold text-white hover:bg-brand-red-hover"
            >
              Report an Incident
            </a>
            <a
              href="/alerts"
              className="rounded-md border border-gray-600 px-8 py-4 text-lg font-semibold text-white hover:bg-brand-navy"
            >
              View Alert Feed
            </a>
          </div>
          <p className="mt-8 text-gray-400">
            CargoWatch is 100% free for all transportation stakeholders
          </p>
        </div>
      </div>
    </div>
  );
}
