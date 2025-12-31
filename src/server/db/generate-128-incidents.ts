/**
 * Generate 128 diverse incidents spread worldwide
 */

export function generate128Incidents(demoUsers: any[], regions: any[]) {
  const now = Date.now();

  const incidentTypes = ["theft", "suspicious", "tampering", "attempted_break_in"];
  const severityLevels = ["critical", "high", "medium", "low"];
  const cargoTypes = ["electronics", "pharmaceuticals", "food", "general", null];
  const statuses = ["active", "investigating", "resolved", "closed"];

  const incidents = [];

  // Define incident templates for variety
  const templates = [
    {
      type: "theft",
      severity: "critical",
      cargo: "electronics",
      titleTemplate: "Cargo Theft - Electronics Load Stolen",
      descTemplate: "Full trailer of consumer electronics stolen from {location}. Professional operation with security bypass. Estimated value {value}. Local authorities investigating.",
    },
    {
      type: "theft",
      severity: "critical",
      cargo: "pharmaceuticals",
      titleTemplate: "High-Value Pharmaceutical Theft",
      descTemplate: "Pharmaceutical shipment stolen during {timeOfDay}. GPS jammer suspected. Contains controlled substances. Law enforcement notified.",
    },
    {
      type: "suspicious",
      severity: "high",
      cargo: null,
      titleTemplate: "Suspicious Activity Near Facility",
      descTemplate: "Multiple individuals observed {activity} near cargo facility. Security team alerted. Subjects fled when approached. {vehicle} description provided to authorities.",
    },
    {
      type: "tampering",
      severity: "medium",
      cargo: "food",
      titleTemplate: "Container Seal Tampering Detected",
      descTemplate: "Seal found broken during inspection. {cargo} shipment may be compromised. Full inventory check required. Incident logged with authorities.",
    },
    {
      type: "attempted_break_in",
      severity: "high",
      cargo: "general",
      titleTemplate: "Attempted Break-in at {facility}",
      descTemplate: "Bolt cutters and pry tools found near trailer. Locks show tampering but held. Incident occurred during overnight hours. Security footage being reviewed.",
    },
    {
      type: "suspicious",
      severity: "medium",
      cargo: null,
      titleTemplate: "Suspicious Vehicle Circling Facility",
      descTemplate: "Unmarked vehicle observed circling distribution center multiple times. Occupants appeared to be surveying cargo movements. License plate captured and reported.",
    },
    {
      type: "theft",
      severity: "high",
      cargo: "electronics",
      titleTemplate: "Container Theft from Secured Yard",
      descTemplate: "Container removed from secured facility overnight. Gate locks cut. Contains high-value electronics. Estimated loss {value}. Investigation ongoing.",
    },
    {
      type: "suspicious",
      severity: "low",
      cargo: null,
      titleTemplate: "Drone Activity Over Cargo Area",
      descTemplate: "Drone observed flying over secure container yard for extended period. Appeared to be surveying cargo areas. Operator not located. Increased vigilance recommended.",
    },
    {
      type: "tampering",
      severity: "high",
      cargo: "pharmaceuticals",
      titleTemplate: "GPS Signal Interference Detected",
      descTemplate: "Multiple carriers reporting GPS signal loss in concentrated area. Possible jamming device in operation. Law enforcement investigating. Exercise extreme caution.",
    },
    {
      type: "attempted_break_in",
      severity: "medium",
      cargo: "general",
      titleTemplate: "Security Lock Tampering Detected",
      descTemplate: "Lock shows signs of attempted tampering during rest stop. No cargo missing. Tools left at scene. Driver reported suspicious individuals in area.",
    },
  ];

  // Generate 128 incidents with good distribution
  for (let i = 0; i < 128; i++) {
    const template = templates[i % templates.length]!;
    const region = regions[Math.floor(Math.random() * regions.length)]!;
    const user = demoUsers[i % demoUsers.length]!;

    // Vary the timing (0-30 days ago)
    const hoursAgo = Math.floor(Math.random() * 720); // 30 days = 720 hours
    const incidentDate = new Date(now - hoursAgo * 60 * 60 * 1000);

    // Generate random but realistic values
    const hasPhotos = Math.random() > 0.4;
    const hasVideo = Math.random() > 0.7;
    const evidenceCount = hasPhotos ? Math.floor(Math.random() * 6) + 1 : 0;
    const loss = template.severity === "critical" ?
      (Math.floor(Math.random() * 2000000) + 500000).toString() :
      template.severity === "high" ?
      (Math.floor(Math.random() * 500000) + 100000).toString() :
      template.severity === "medium" ?
      (Math.floor(Math.random() * 100000) + 10000).toString() :
      "0";

    const viewCount = Math.floor(Math.random() * 800) + 50;
    const commentCount = Math.floor(Math.random() * 40);
    const shareCount = Math.floor(Math.random() * 80);

    // Create description with variety
    let description = template.descTemplate;
    description = description.replace("{location}", "secured facility");
    description = description.replace("{value}", `$${parseInt(loss).toLocaleString()}`);
    description = description.replace("{timeOfDay}", ["overnight", "during rest break", "early morning hours", "late evening"][Math.floor(Math.random() * 4)]!);
    description = description.replace("{activity}", ["surveying trucks", "photographing facility", "approaching drivers", "inspecting trailers"][Math.floor(Math.random() * 4)]!);
    description = description.replace("{vehicle}", ["Dark SUV", "White van", "Black sedan", "Unmarked truck"][Math.floor(Math.random() * 4)]!);
    description = description.replace("{cargo}", template.cargo || "general freight");
    description = description.replace("{facility}", ["Staging Area", "Distribution Center", "Container Yard", "Truck Stop"][Math.floor(Math.random() * 4)]!);

    // Use actual region coordinates with small random offset (0.01-0.1 degrees, ~1-10km)
    const latOffset = (Math.random() - 0.5) * 0.1;
    const lngOffset = (Math.random() - 0.5) * 0.1;
    const latitude = (parseFloat(region!.latitude) + latOffset).toFixed(4);
    const longitude = (parseFloat(region!.longitude) + lngOffset).toFixed(4);

    incidents.push({
      reporterId: user!.id,
      incidentType: template.type,
      severityLevel: template.severity,
      cargoType: template.cargo,
      status: statuses[Math.floor(Math.random() * statuses.length)]!,
      region: region!.name,
      specificLocation: getLocationForRegion(region!.name),
      latitude: latitude,
      longitude: longitude,
      title: template.titleTemplate.replace("{facility}", ["Staging Area", "Distribution Center"][Math.floor(Math.random() * 2)]!),
      description: description,
      incidentDate: incidentDate,
      incidentTime: `${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      hasPhotos: hasPhotos,
      hasVideo: hasVideo,
      evidenceCount: evidenceCount,
      estimatedLoss: loss,
      viewCount: viewCount,
      commentCount: commentCount,
      shareCount: shareCount,
      reporterName: ["Fleet Manager", "Security Officer", "Driver", "Facility Security", "Independent O/O"][Math.floor(Math.random() * 5)],
      reporterCompany: ["Swift Transportation", "XPO Logistics", "J.B. Hunt Transport", "Independent O/O", "Warehouse Security"][Math.floor(Math.random() * 5)],
    });
  }

  return incidents;
}

function getLocationForRegion(region: string): string {
  const locationTypes = [
    "Port Container Terminal",
    "Distribution Center",
    "Highway Rest Area",
    "Truck Stop",
    "Warehouse District",
    "Border Crossing",
    "Staging Facility",
    "Intermodal Yard",
  ];
  return locationTypes[Math.floor(Math.random() * locationTypes.length)]!;
}
