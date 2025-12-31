/**
 * CargoWatch Resources Page
 * Security products, educational materials, and partnerships
 */

import {
  ShieldCheckIcon,
  AcademicCapIcon,
  BuildingOffice2Icon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { db } from "~/server/db";
import { resources } from "~/server/db/schema";
import { asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

async function getResources() {
  return db.select().from(resources).orderBy(asc(resources.displayOrder));
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "product":
      return <ShieldCheckIcon className="h-6 w-6 text-brand-red" />;
    case "educational":
      return <AcademicCapIcon className="h-6 w-6 text-brand-red" />;
    case "partnership":
      return <BuildingOffice2Icon className="h-6 w-6 text-brand-red" />;
    default:
      return <ShieldCheckIcon className="h-6 w-6 text-brand-red" />;
  }
}

function getBadgeColor(badge: string | null) {
  switch (badge) {
    case "Partner":
      return "bg-blue-600/20 text-blue-400";
    case "Featured":
      return "bg-brand-red/20 text-brand-red";
    case "Guide":
      return "bg-green-600/20 text-green-400";
    default:
      return "bg-gray-600/20 text-gray-400";
  }
}

export default async function ResourcesPage() {
  const allResources = await getResources();

  const products = allResources.filter((r) => r.category === "product");
  const educational = allResources.filter((r) => r.category === "educational");
  const partnerships = allResources.filter((r) => r.category === "partnership");

  return (
    <div className="w-full">
      {/* Header */}
      <div className="border-b border-gray-700 bg-brand-navy-dark">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Security Resources</h1>
          <p className="mt-2 text-gray-400">
            Trusted products, educational materials, and industry partnerships to help protect
            your cargo
          </p>
        </div>
      </div>

      {/* Security Products */}
      <div className="bg-brand-navy py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-3">
            <ShieldCheckIcon className="h-8 w-8 text-brand-red" />
            <div>
              <h2 className="text-2xl font-bold text-white">Security Products</h2>
              <p className="text-gray-400">
                Recommended solutions from our trusted partners
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((resource) => (
              <a
                key={resource.id}
                href={resource.url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-lg border border-gray-700 bg-brand-navy-light p-6 transition hover:border-gray-600 hover:bg-brand-navy"
              >
                <div className="mb-4 flex items-start justify-between">
                  {getCategoryIcon(resource.category)}
                  {resource.badge && (
                    <span
                      className={`rounded px-2 py-1 text-xs font-semibold ${getBadgeColor(resource.badge)}`}
                    >
                      {resource.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-white group-hover:text-brand-red">
                  {resource.title}
                  <ArrowTopRightOnSquareIcon className="ml-1 inline-block h-4 w-4" />
                </h3>

                {resource.subcategory && (
                  <div className="mt-1 text-xs text-gray-500">
                    {resource.subcategory.replace("_", " ").toUpperCase()}
                  </div>
                )}

                <p className="mt-3 text-sm text-gray-400">{resource.description}</p>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Educational Resources */}
      <div className="bg-brand-navy-dark py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-3">
            <AcademicCapIcon className="h-8 w-8 text-brand-red" />
            <div>
              <h2 className="text-2xl font-bold text-white">Educational Materials</h2>
              <p className="text-gray-400">
                Learn best practices for cargo security and theft prevention
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {educational.map((resource) => (
              <a
                key={resource.id}
                href={resource.url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-lg border border-gray-700 bg-brand-navy-light p-6 transition hover:border-gray-600 hover:bg-brand-navy"
              >
                <div className="mb-4 flex items-start justify-between">
                  {getCategoryIcon(resource.category)}
                  {resource.badge && (
                    <span
                      className={`rounded px-2 py-1 text-xs font-semibold ${getBadgeColor(resource.badge)}`}
                    >
                      {resource.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-white group-hover:text-brand-red">
                  {resource.title}
                  <ArrowTopRightOnSquareIcon className="ml-1 inline-block h-4 w-4" />
                </h3>

                <p className="mt-3 text-sm text-gray-400">{resource.description}</p>
              </a>
            ))}
          </div>

          {/* Quick Tips */}
          <div className="mt-12 rounded-lg border border-gray-700 bg-brand-navy p-8">
            <h3 className="text-xl font-semibold text-white">Quick Security Tips</h3>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="font-semibold text-brand-red">Before You Park</h4>
                <ul className="mt-3 space-y-2 text-sm text-gray-300">
                  <li>• Check CargoWatch alerts for recent incidents in the area</li>
                  <li>• Choose well-lit, high-traffic truck stops</li>
                  <li>• Park with trailer doors against a barrier when possible</li>
                  <li>• Note security cameras and patrol presence</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-brand-red">During Your Stop</h4>
                <ul className="mt-3 space-y-2 text-sm text-gray-300">
                  <li>• Use high-quality locks and seals on trailer doors</li>
                  <li>• Enable GPS tracking and tamper alerts</li>
                  <li>• Check trailer every few hours if possible</li>
                  <li>• Report suspicious activity immediately via CargoWatch</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-brand-red">High-Value Loads</h4>
                <ul className="mt-3 space-y-2 text-sm text-gray-300">
                  <li>• Never discuss cargo contents in public</li>
                  <li>• Use team drivers for continuous movement</li>
                  <li>• Install covert tracking in addition to standard GPS</li>
                  <li>• Coordinate with law enforcement for high-risk routes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-brand-red">If You're Targeted</h4>
                <ul className="mt-3 space-y-2 text-sm text-gray-300">
                  <li>• Call 911 immediately if threat is imminent</li>
                  <li>• Report via CargoWatch to alert nearby drivers</li>
                  <li>• Don't confront suspects - your safety is priority #1</li>
                  <li>• Take photos/video from a safe distance if possible</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Industry Partnerships */}
      <div className="bg-brand-navy py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-3">
            <BuildingOffice2Icon className="h-8 w-8 text-brand-red" />
            <div>
              <h2 className="text-2xl font-bold text-white">Industry Partnerships</h2>
              <p className="text-gray-400">
                Working together with law enforcement and industry leaders
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {partnerships.map((resource) => (
              <a
                key={resource.id}
                href={resource.url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-lg border border-gray-700 bg-brand-navy-light p-6 transition hover:border-gray-600 hover:bg-brand-navy"
              >
                <div className="mb-4 flex items-start justify-between">
                  {getCategoryIcon(resource.category)}
                  {resource.badge && (
                    <span
                      className={`rounded px-2 py-1 text-xs font-semibold ${getBadgeColor(resource.badge)}`}
                    >
                      {resource.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-white group-hover:text-brand-red">
                  {resource.title}
                  <ArrowTopRightOnSquareIcon className="ml-1 inline-block h-4 w-4" />
                </h3>

                <p className="mt-3 text-sm text-gray-400">{resource.description}</p>
              </a>
            ))}
          </div>

          {/* Partnership CTA */}
          <div className="mt-12 rounded-lg border border-brand-red/50 bg-brand-red/10 p-8 text-center">
            <BuildingOffice2Icon className="mx-auto h-12 w-12 text-brand-red" />
            <h3 className="mt-4 text-xl font-semibold text-white">
              Interested in Partnering with CargoWatch?
            </h3>
            <p className="mt-2 text-gray-300">
              We're actively seeking partnerships with security vendors, law enforcement agencies,
              and industry organizations
            </p>
            <button className="mt-6 rounded-md bg-brand-red px-6 py-3 font-semibold text-white hover:bg-brand-red-hover">
              Contact Us About Partnerships
            </button>
          </div>
        </div>
      </div>

      {/* Contact Law Enforcement */}
      <div className="border-t border-gray-700 bg-brand-navy-dark py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-white">
            Emergency Contacts
          </h2>
          <p className="mt-2 text-center text-gray-400">
            For immediate threats, always call 911 first
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-gray-700 bg-brand-navy p-6 text-center">
              <div className="text-2xl font-bold text-brand-red">911</div>
              <div className="mt-2 text-white">Emergency Services</div>
              <p className="mt-2 text-sm text-gray-400">
                Immediate threats or crimes in progress
              </p>
            </div>

            <div className="rounded-lg border border-gray-700 bg-brand-navy p-6 text-center">
              <div className="text-2xl font-bold text-brand-red">1-800-CARGO-TIP</div>
              <div className="mt-2 text-white">CargoNet Hotline</div>
              <p className="mt-2 text-sm text-gray-400">
                Report cargo theft 24/7
              </p>
            </div>

            <div className="rounded-lg border border-gray-700 bg-brand-navy p-6 text-center">
              <div className="text-2xl font-bold text-brand-red">1-800-CALL-FBI</div>
              <div className="mt-2 text-white">FBI Cargo Theft</div>
              <p className="mt-2 text-sm text-gray-400">
                Report organized cargo crime
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
