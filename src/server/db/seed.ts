/**
 * CargoWatch Database Seed Script
 * Populates the database with realistic demo data
 */

// Load environment variables first
import dotenv from "dotenv";
dotenv.config();

import { db } from "./index";
import { users, incidents, regions, resources, comments } from "./schema";
import { generate128Incidents } from "./generate-128-incidents";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  console.log("Clearing existing data...");
  await db.delete(comments);
  await db.delete(incidents);
  await db.delete(resources);
  await db.delete(regions);
  await db.delete(users);

  // Seed Regions - Worldwide Coverage
  console.log("Seeding regions...");
  const regionData = await db.insert(regions).values([
    // North America
    { name: "Los Angeles, CA, USA", state: "CA", city: "Los Angeles", latitude: "34.0522", longitude: "-118.2436", isPriority: true, priorityRank: 1, incidentCount: 0 },
    { name: "Memphis, TN, USA", state: "TN", city: "Memphis", latitude: "35.1495", longitude: "-90.0489", isPriority: true, priorityRank: 2, incidentCount: 0 },
    { name: "Chicago, IL, USA", state: "IL", city: "Chicago", latitude: "41.8781", longitude: "-87.6298", isPriority: false, incidentCount: 0 },
    { name: "Dallas, TX, USA", state: "TX", city: "Dallas", latitude: "32.7766", longitude: "-96.7969", isPriority: false, incidentCount: 0 },
    { name: "Houston, TX, USA", state: "TX", city: "Houston", latitude: "29.7604", longitude: "-95.3698", isPriority: false, incidentCount: 0 },
    { name: "Newark, NJ, USA", state: "NJ", city: "Newark", latitude: "40.7357", longitude: "-74.1724", isPriority: false, incidentCount: 0 },
    { name: "Miami, FL, USA", state: "FL", city: "Miami", latitude: "25.7616", longitude: "-80.1917", isPriority: false, incidentCount: 0 },
    { name: "Atlanta, GA, USA", state: "GA", city: "Atlanta", latitude: "33.7489", longitude: "-84.3879", isPriority: false, incidentCount: 0 },
    { name: "Seattle, WA, USA", state: "WA", city: "Seattle", latitude: "47.6062", longitude: "-122.3320", isPriority: false, incidentCount: 0 },
    { name: "Toronto, ON, Canada", state: "ON", city: "Toronto", latitude: "43.6532", longitude: "-79.3832", isPriority: false, incidentCount: 0 },
    { name: "Vancouver, BC, Canada", state: "BC", city: "Vancouver", latitude: "49.2827", longitude: "-123.1207", isPriority: false, incidentCount: 0 },
    { name: "Montreal, QC, Canada", state: "QC", city: "Montreal", latitude: "45.5017", longitude: "-73.5673", isPriority: false, incidentCount: 0 },
    { name: "Mexico City, Mexico", state: "MX", city: "Mexico City", latitude: "19.4326", longitude: "-99.1332", isPriority: false, incidentCount: 0 },
    { name: "Monterrey, Mexico", state: "NL", city: "Monterrey", latitude: "25.6866", longitude: "-100.3161", isPriority: false, incidentCount: 0 },

    // Europe
    { name: "London, United Kingdom", state: "UK", city: "London", latitude: "51.5074", longitude: "-0.1278", isPriority: true, priorityRank: 3, incidentCount: 0 },
    { name: "Rotterdam, Netherlands", state: "NL", city: "Rotterdam", latitude: "51.9225", longitude: "4.4792", isPriority: false, incidentCount: 0 },
    { name: "Hamburg, Germany", state: "DE", city: "Hamburg", latitude: "53.5511", longitude: "9.9937", isPriority: false, incidentCount: 0 },
    { name: "Antwerp, Belgium", state: "BE", city: "Antwerp", latitude: "51.2194", longitude: "4.4025", isPriority: false, incidentCount: 0 },
    { name: "Paris, France", state: "FR", city: "Paris", latitude: "48.8566", longitude: "2.3522", isPriority: false, incidentCount: 0 },
    { name: "Barcelona, Spain", state: "ES", city: "Barcelona", latitude: "41.3851", longitude: "2.1734", isPriority: false, incidentCount: 0 },
    { name: "Milan, Italy", state: "IT", city: "Milan", latitude: "45.4642", longitude: "9.1900", isPriority: false, incidentCount: 0 },
    { name: "Warsaw, Poland", state: "PL", city: "Warsaw", latitude: "52.2297", longitude: "21.0122", isPriority: false, incidentCount: 0 },
    { name: "Prague, Czech Republic", state: "CZ", city: "Prague", latitude: "50.0755", longitude: "14.4378", isPriority: false, incidentCount: 0 },
    { name: "Athens, Greece", state: "GR", city: "Athens", latitude: "37.9838", longitude: "23.7275", isPriority: false, incidentCount: 0 },

    // Asia
    { name: "Singapore", state: "SG", city: "Singapore", latitude: "1.3521", longitude: "103.8198", isPriority: true, priorityRank: 4, incidentCount: 0 },
    { name: "Shanghai, China", state: "CN", city: "Shanghai", latitude: "31.2304", longitude: "121.4737", isPriority: false, incidentCount: 0 },
    { name: "Hong Kong", state: "HK", city: "Hong Kong", latitude: "22.3193", longitude: "114.1694", isPriority: false, incidentCount: 0 },
    { name: "Tokyo, Japan", state: "JP", city: "Tokyo", latitude: "35.6762", longitude: "139.6503", isPriority: false, incidentCount: 0 },
    { name: "Seoul, South Korea", state: "KR", city: "Seoul", latitude: "37.5665", longitude: "126.9780", isPriority: false, incidentCount: 0 },
    { name: "Dubai, UAE", state: "AE", city: "Dubai", latitude: "25.2048", longitude: "55.2708", isPriority: false, incidentCount: 0 },
    { name: "Mumbai, India", state: "IN", city: "Mumbai", latitude: "19.0760", longitude: "72.8777", isPriority: false, incidentCount: 0 },
    { name: "Bangkok, Thailand", state: "TH", city: "Bangkok", latitude: "13.7563", longitude: "100.5018", isPriority: false, incidentCount: 0 },
    { name: "Jakarta, Indonesia", state: "ID", city: "Jakarta", latitude: "-6.2088", longitude: "106.8456", isPriority: false, incidentCount: 0 },
    { name: "Kuala Lumpur, Malaysia", state: "MY", city: "Kuala Lumpur", latitude: "3.1390", longitude: "101.6869", isPriority: false, incidentCount: 0 },

    // Middle East
    { name: "Istanbul, Turkey", state: "TR", city: "Istanbul", latitude: "41.0082", longitude: "28.9784", isPriority: false, incidentCount: 0 },
    { name: "Jeddah, Saudi Arabia", state: "SA", city: "Jeddah", latitude: "21.5433", longitude: "39.1728", isPriority: false, incidentCount: 0 },
    { name: "Tel Aviv, Israel", state: "IL", city: "Tel Aviv", latitude: "32.0853", longitude: "34.7818", isPriority: false, incidentCount: 0 },

    // Africa
    { name: "Johannesburg, South Africa", state: "ZA", city: "Johannesburg", latitude: "-26.2041", longitude: "28.0473", isPriority: false, incidentCount: 0 },
    { name: "Lagos, Nigeria", state: "NG", city: "Lagos", latitude: "6.5244", longitude: "3.3792", isPriority: false, incidentCount: 0 },
    { name: "Cairo, Egypt", state: "EG", city: "Cairo", latitude: "30.0444", longitude: "31.2357", isPriority: false, incidentCount: 0 },
    { name: "Nairobi, Kenya", state: "KE", city: "Nairobi", latitude: "-1.2864", longitude: "36.8172", isPriority: false, incidentCount: 0 },

    // South America
    { name: "São Paulo, Brazil", state: "BR", city: "São Paulo", latitude: "-23.5505", longitude: "-46.6333", isPriority: false, incidentCount: 0 },
    { name: "Buenos Aires, Argentina", state: "AR", city: "Buenos Aires", latitude: "-34.6037", longitude: "-58.3816", isPriority: false, incidentCount: 0 },
    { name: "Lima, Peru", state: "PE", city: "Lima", latitude: "-12.0464", longitude: "-77.0428", isPriority: false, incidentCount: 0 },
    { name: "Bogotá, Colombia", state: "CO", city: "Bogotá", latitude: "4.7110", longitude: "-74.0721", isPriority: false, incidentCount: 0 },
    { name: "Santiago, Chile", state: "CL", city: "Santiago", latitude: "-33.4489", longitude: "-70.6693", isPriority: false, incidentCount: 0 },

    // Oceania
    { name: "Sydney, Australia", state: "AU", city: "Sydney", latitude: "-33.8688", longitude: "151.2093", isPriority: false, incidentCount: 0 },
    { name: "Melbourne, Australia", state: "AU", city: "Melbourne", latitude: "-37.8136", longitude: "144.9631", isPriority: false, incidentCount: 0 },
    { name: "Auckland, New Zealand", state: "NZ", city: "Auckland", latitude: "-36.8485", longitude: "174.7633", isPriority: false, incidentCount: 0 },
  ]).returning();

  // Seed Demo Users
  console.log("Seeding users...");
  const demoUsers = await db.insert(users).values([
    {
      authId: "00000000-0000-0000-0000-000000000001",
      fullName: "John Martinez",
      email: "john.martinez@example.com",
      phoneNumber: "(901) 555-0123",
      company: "Swift Transportation",
      role: "driver",
      isVerified: true,
    },
    {
      authId: "00000000-0000-0000-0000-000000000002",
      fullName: "Sarah Thompson",
      email: "sarah.thompson@example.com",
      phoneNumber: "(213) 555-0156",
      company: "XPO Logistics",
      role: "security",
      isVerified: true,
    },
    {
      authId: "00000000-0000-0000-0000-000000000003",
      fullName: "Michael Chen",
      email: "michael.chen@example.com",
      phoneNumber: "(214) 555-0198",
      company: "J.B. Hunt Transport",
      role: "driver",
      isVerified: true,
    },
    {
      authId: "00000000-0000-0000-0000-000000000004",
      fullName: "Officer James Rodriguez",
      email: "j.rodriguez@memphispd.gov",
      phoneNumber: "(901) 555-2000",
      company: "Memphis Police Department",
      role: "law_enforcement",
      isVerified: true,
    },
  ]).returning();

  // Seed Incidents - 128 Worldwide Incidents
  console.log("Seeding incidents...");
  const incidentData = generate128Incidents(demoUsers, regionData);
  await db.insert(incidents).values(incidentData);

  // Update region incident counts
  console.log("Updating region incident counts...");
  for (const region of regionData) {
    const [count] = await db
      .select({ count: sql<number>`count(*)` })
      .from(incidents)
      .where(sql`${incidents.region} = ${region.name}`);

    await db
      .update(regions)
      .set({ incidentCount: count?.count ?? 0 })
      .where(sql`${regions.id} = ${region.id}`);
  }

  // Seed Resources
  console.log("Seeding resources...");
  await db.insert(resources).values([
    {
      category: "product",
      subcategory: "gps_tracking",
      title: "CargoSafe GPS Tracker",
      description: "Real-time GPS tracking with tamper alerts and geofencing. Battery life up to 30 days.",
      url: "https://example.com/cargosafe",
      badge: "Partner",
      displayOrder: 1,
      isActive: true,
    },
    {
      category: "product",
      subcategory: "physical_security",
      title: "SmartSeal Electronic Locks",
      description: "Bluetooth-enabled trailer locks with instant breach notifications to your phone.",
      url: "https://example.com/smartseal",
      badge: "Featured",
      displayOrder: 2,
      isActive: true,
    },
    {
      category: "educational",
      subcategory: "guide",
      title: "Cargo Theft Prevention Guide",
      description: "Comprehensive 50-page guide covering best practices, risk assessment, and security protocols.",
      url: "https://example.com/guide",
      badge: "Guide",
      displayOrder: 3,
      isActive: true,
    },
    {
      category: "partnership",
      subcategory: "industry",
      title: "CargoNet Partnership",
      description: "CargoWatch integrates with CargoNet's national cargo theft database for enhanced tracking.",
      url: "https://cargonet.com",
      companyUrl: "https://cargonet.com",
      badge: "Partner",
      displayOrder: 4,
      isActive: true,
    },
    {
      category: "partnership",
      subcategory: "industry",
      title: "FBI Cargo Theft Program",
      description: "Direct reporting channel to FBI's Cargo Theft Program for high-value incidents.",
      url: "https://fbi.gov/investigate/violent-crime/cargo-theft",
      badge: "Partner",
      displayOrder: 5,
      isActive: true,
    },
    {
      category: "product",
      subcategory: "surveillance",
      title: "TrailerCam 360° Security System",
      description: "24/7 video surveillance with motion detection and cloud storage. Solar-powered option available.",
      url: "https://example.com/trailercam",
      badge: "Featured",
      displayOrder: 6,
      isActive: true,
    },
  ]);

  // Seed Comments
  console.log("Seeding comments...");
  const allIncidents = await db.select().from(incidents);
  await db.insert(comments).values([
    {
      incidentId: allIncidents[0]!.id,
      userId: demoUsers[3]!.id,
      content: "MPD is actively investigating. We've increased patrols in this area. If anyone has additional info, please contact our cargo theft unit at (901) 555-2000.",
    },
    {
      incidentId: allIncidents[0]!.id,
      userId: demoUsers[1]!.id,
      content: "We had a similar incident at the same location 3 weeks ago. They're definitely targeting this truck stop. Stay alert everyone.",
    },
    {
      incidentId: allIncidents[1]!.id,
      userId: demoUsers[2]!.id,
      content: "Port of Long Beach has been a hotspot lately. Recommend using extra security measures if hauling through there.",
    },
  ]);

  console.log("✅ Database seeded successfully!");
}

seed()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
