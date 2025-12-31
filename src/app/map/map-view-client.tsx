"use client";

/**
 * CargoWatch Map View - Optimized Mapbox GL Implementation
 * High-performance map with native GeoJSON layers for smooth rendering
 */

import { useState, useMemo, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { MapPinIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type { Incident, Region } from "~/server/db/schema";

interface MapViewClientProps {
  incidents: Incident[];
  regions: Region[];
  topRegions: Region[];
  recentIncidents: Incident[];
  stats: {
    totalIncidents: number;
  };
}

// Mapbox access token from environment variable
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export function MapViewClient({
  incidents,
  regions,
  topRegions,
  recentIncidents,
  stats,
}: MapViewClientProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popup = useRef<mapboxgl.Popup | null>(null);

  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [regionSearch, setRegionSearch] = useState("");
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showRoutes, setShowRoutes] = useState(false);

  // Filter incidents based on selections
  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      const matchesRegion =
        selectedRegion === "all" || incident.region === selectedRegion;
      const matchesSeverity =
        selectedSeverity === "all" || incident.severityLevel === selectedSeverity;
      const matchesType =
        selectedType === "all" || incident.incidentType === selectedType;
      return matchesRegion && matchesSeverity && matchesType;
    });
  }, [incidents, selectedRegion, selectedSeverity, selectedType]);

  // Filter regions by search
  const filteredRegions = useMemo(() => {
    if (!regionSearch) return regions;
    return regions.filter((region) =>
      region.name.toLowerCase().includes(regionSearch.toLowerCase())
    );
  }, [regions, regionSearch]);

  // Convert incidents to GeoJSON
  const incidentsGeoJSON = useMemo(() => {
    return {
      type: "FeatureCollection" as const,
      features: filteredIncidents
        .filter((incident) => incident.longitude && incident.latitude)
        .map((incident) => ({
          type: "Feature" as const,
          geometry: {
            type: "Point" as const,
            coordinates: [parseFloat(incident.longitude!), parseFloat(incident.latitude!)],
          },
          properties: {
            id: incident.id,
            title: incident.title,
            region: incident.region,
            severity: incident.severityLevel,
            type: incident.incidentType,
            description: incident.description,
          },
        })),
    };
  }, [filteredIncidents]);

  // Comprehensive cargo routes connecting all major hubs
  const cargoRoutes = useMemo(() => {
    return {
      type: "FeatureCollection" as const,
      features: [
        // ========== NORTH AMERICA ROUTES ==========
        // West Coast Hub Network
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[-118.2436, 34.0522], [-90.0489, 35.1495]] }, properties: { name: "LA-Memphis" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[-118.2436, 34.0522], [-87.6298, 41.8781]] }, properties: { name: "LA-Chicago" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[-118.2436, 34.0522], [-96.7969, 32.7766]] }, properties: { name: "LA-Dallas" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[-118.2436, 34.0522], [-122.3320, 47.6062]] }, properties: { name: "LA-Seattle" }},

        // Central Hub Network
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[-90.0489, 35.1495], [-87.6298, 41.8781]] }, properties: { name: "Memphis-Chicago" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[-90.0489, 35.1495], [-84.3879, 33.7489]] }, properties: { name: "Memphis-Atlanta" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[-90.0489, 35.1495], [-96.7969, 32.7766]] }, properties: { name: "Memphis-Dallas" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[-87.6298, 41.8781], [-74.1724, 40.7357]] }, properties: { name: "Chicago-Newark" }},

        // Texas Network
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[-96.7969, 32.7766], [-95.3698, 29.7604]] }, properties: { name: "Dallas-Houston" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[-95.3698, 29.7604], [-84.3879, 33.7489]] }, properties: { name: "Houston-Atlanta" }},

        // East Coast Network
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[-74.1724, 40.7357], [-80.1917, 25.7616]] }, properties: { name: "Newark-Miami" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[-74.1724, 40.7357], [-84.3879, 33.7489]] }, properties: { name: "Newark-Atlanta" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[-84.3879, 33.7489], [-80.1917, 25.7616]] }, properties: { name: "Atlanta-Miami" }},

        // Pacific Northwest
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[-122.3320, 47.6062], [-123.1207, 49.2827]] }, properties: { name: "Seattle-Vancouver" }},

        // Canada Network
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[-79.3832, 43.6532], [-73.5673, 45.5017]] }, properties: { name: "Toronto-Montreal" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[-123.1207, 49.2827], [-79.3832, 43.6532]] }, properties: { name: "Vancouver-Toronto" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[-79.3832, 43.6532], [-87.6298, 41.8781]] }, properties: { name: "Toronto-Chicago" }},

        // Mexico Network
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[-99.1332, 19.4326], [-100.3161, 25.6866]] }, properties: { name: "Mexico City-Monterrey" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[-100.3161, 25.6866], [-96.7969, 32.7766]] }, properties: { name: "Monterrey-Dallas" }},

        // ========== EUROPEAN ROUTES ==========
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[-0.1278, 51.5074], [4.4792, 51.9225]] }, properties: { name: "London-Rotterdam" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[-0.1278, 51.5074], [2.3522, 48.8566]] }, properties: { name: "London-Paris" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[4.4792, 51.9225], [4.4025, 51.2194]] }, properties: { name: "Rotterdam-Antwerp" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[4.4792, 51.9225], [9.9937, 53.5511]] }, properties: { name: "Rotterdam-Hamburg" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[9.9937, 53.5511], [21.0122, 52.2297]] }, properties: { name: "Hamburg-Warsaw" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[2.3522, 48.8566], [2.1734, 41.3851]] }, properties: { name: "Paris-Barcelona" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[2.3522, 48.8566], [9.1900, 45.4642]] }, properties: { name: "Paris-Milan" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[9.1900, 45.4642], [23.7275, 37.9838]] }, properties: { name: "Milan-Athens" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[21.0122, 52.2297], [14.4378, 50.0755]] }, properties: { name: "Warsaw-Prague" }},

        // ========== ASIAN ROUTES ==========
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[103.8198, 1.3521], [114.1694, 22.3193]] }, properties: { name: "Singapore-Hong Kong" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[103.8198, 1.3521], [100.5018, 13.7563]] }, properties: { name: "Singapore-Bangkok" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[103.8198, 1.3521], [101.6869, 3.1390]] }, properties: { name: "Singapore-Kuala Lumpur" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[103.8198, 1.3521], [106.8456, -6.2088]] }, properties: { name: "Singapore-Jakarta" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[121.4737, 31.2304], [114.1694, 22.3193]] }, properties: { name: "Shanghai-Hong Kong" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[121.4737, 31.2304], [139.6503, 35.6762]] }, properties: { name: "Shanghai-Tokyo" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[121.4737, 31.2304], [126.9780, 37.5665]] }, properties: { name: "Shanghai-Seoul" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[139.6503, 35.6762], [126.9780, 37.5665]] }, properties: { name: "Tokyo-Seoul" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[72.8777, 19.0760], [55.2708, 25.2048]] }, properties: { name: "Mumbai-Dubai" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[100.5018, 13.7563], [114.1694, 22.3193]] }, properties: { name: "Bangkok-Hong Kong" }},

        // ========== MIDDLE EAST ROUTES ==========
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[55.2708, 25.2048], [103.8198, 1.3521]] }, properties: { name: "Dubai-Singapore" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[55.2708, 25.2048], [39.1728, 21.5433]] }, properties: { name: "Dubai-Jeddah" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[28.9784, 41.0082], [34.7818, 32.0853]] }, properties: { name: "Istanbul-Tel Aviv" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[28.9784, 41.0082], [23.7275, 37.9838]] }, properties: { name: "Istanbul-Athens" }},

        // ========== AFRICA ROUTES ==========
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[28.0473, -26.2041], [3.3792, 6.5244]] }, properties: { name: "Johannesburg-Lagos" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[31.2357, 30.0444], [3.3792, 6.5244]] }, properties: { name: "Cairo-Lagos" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[31.2357, 30.0444], [36.8172, -1.2864]] }, properties: { name: "Cairo-Nairobi" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[36.8172, -1.2864], [28.0473, -26.2041]] }, properties: { name: "Nairobi-Johannesburg" }},

        // ========== SOUTH AMERICA ROUTES ==========
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[-46.6333, -23.5505], [-58.3816, -34.6037]] }, properties: { name: "São Paulo-Buenos Aires" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[-46.6333, -23.5505], [-77.0428, -12.0464]] }, properties: { name: "São Paulo-Lima" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[-74.0721, 4.7110], [-77.0428, -12.0464]] }, properties: { name: "Bogotá-Lima" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[-70.6693, -33.4489], [-58.3816, -34.6037]] }, properties: { name: "Santiago-Buenos Aires" }},

        // ========== OCEANIA ROUTES ==========
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[151.2093, -33.8688], [144.9631, -37.8136]] }, properties: { name: "Sydney-Melbourne" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[151.2093, -33.8688], [174.7633, -36.8485]] }, properties: { name: "Sydney-Auckland" }},

        // ========== TRANSOCEANIC ROUTES ==========
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[-74.1724, 40.7357], [-0.1278, 51.5074]] }, properties: { name: "Newark-London" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[-118.2436, 34.0522], [103.8198, 1.3521]] }, properties: { name: "LA-Singapore" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[-118.2436, 34.0522], [121.4737, 31.2304]] }, properties: { name: "LA-Shanghai" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[-118.2436, 34.0522], [139.6503, 35.6762]] }, properties: { name: "LA-Tokyo" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[-122.3320, 47.6062], [103.8198, 1.3521]] }, properties: { name: "Seattle-Singapore" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[-0.1278, 51.5074], [103.8198, 1.3521]] }, properties: { name: "London-Singapore" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[4.4792, 51.9225], [-74.1724, 40.7357]] }, properties: { name: "Rotterdam-Newark" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[103.8198, 1.3521], [151.2093, -33.8688]] }, properties: { name: "Singapore-Sydney" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[-46.6333, -23.5505], [-0.1278, 51.5074]] }, properties: { name: "São Paulo-London" }},
        { type: "Feature" as const, geometry: { type: "LineString" as const, coordinates: [[-80.1917, 25.7616], [-46.6333, -23.5505]] }, properties: { name: "Miami-São Paulo" }},
      ],
    };
  }, []);

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "#d93025";
      case "high":
        return "#f97316";
      case "medium":
        return "#fbbf24";
      case "low":
        return "#10b981";
      default:
        return "#d93025";
    }
  };

  // Format time ago
  const timeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const days = Math.floor(diffInHours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    return `${weeks}w ago`;
  };

  // Function to add incident layers
  const addIncidentLayers = () => {
    if (!map.current || map.current.getSource("incidents")) return;

    // Add source for incidents
    map.current.addSource("incidents", {
      type: "geojson",
      data: incidentsGeoJSON,
    });

    // Add layers for each severity level
    const severities = ["critical", "high", "medium", "low"];
    severities.forEach((severity) => {
      if (!map.current) return;

      map.current.addLayer({
        id: `incidents-${severity}`,
        type: "circle",
        source: "incidents",
        filter: ["==", ["get", "severity"], severity],
        paint: {
          "circle-radius": 4,
          "circle-color": getSeverityColor(severity),
          "circle-stroke-width": 2,
          "circle-stroke-color": getSeverityColor(severity),
          "circle-stroke-opacity": 0.3,
          "circle-opacity": 0.9,
        },
      });

      // Add hover effect
      map.current.on("mouseenter", `incidents-${severity}`, () => {
        if (map.current) map.current.getCanvas().style.cursor = "pointer";
      });

      map.current.on("mouseleave", `incidents-${severity}`, () => {
        if (map.current) map.current.getCanvas().style.cursor = "";
      });

      // Add click handler
      map.current.on("click", `incidents-${severity}`, (e) => {
        if (!e.features || !e.features[0]) return;

        const feature = e.features[0];
        const props = feature.properties;
        const incident = filteredIncidents.find((i) => i.id === props?.id);

        if (incident && popup.current && map.current) {
          const coordinates = (feature.geometry as any).coordinates.slice();

          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          popup.current
            .setLngLat(coordinates)
            .setHTML(`
              <div style="padding: 8px; max-width: 280px;">
                <h3 style="font-weight: 600; color: #1f2937; font-size: 14px; margin-bottom: 4px;">
                  ${props?.title || ""}
                </h3>
                <p style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">
                  ${props?.region || ""}
                </p>
                <div style="margin-bottom: 8px;">
                  <span style="
                    background-color: ${getSeverityColor(props?.severity || "")}20;
                    color: ${getSeverityColor(props?.severity || "")};
                    padding: 2px 8px;
                    border-radius: 9999px;
                    font-size: 11px;
                    font-weight: 500;
                  ">
                    ${(props?.severity || "").toUpperCase()}
                  </span>
                </div>
                <p style="font-size: 12px; color: #4b5563; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                  ${props?.description || ""}
                </p>
                <button
                  onclick="window.dispatchEvent(new CustomEvent('view-incident', { detail: '${props?.id}' }))"
                  style="
                    margin-top: 12px;
                    width: 100%;
                    background-color: #d93025;
                    color: white;
                    padding: 6px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 500;
                    border: none;
                    cursor: pointer;
                  "
                  onmouseover="this.style.backgroundColor='#c72419'"
                  onmouseout="this.style.backgroundColor='#d93025'"
                >
                  View Full Details
                </button>
              </div>
            `)
            .addTo(map.current);
        }
      });
    });
  };

  // Function to add cargo route layers
  const addCargoRoutes = () => {
    if (!map.current || map.current.getSource("routes")) return;

    console.log(`Adding ${cargoRoutes.features.length} cargo routes to map`);

    // Add source for routes
    map.current.addSource("routes", {
      type: "geojson",
      data: cargoRoutes,
    });

    // Add route lines
    map.current.addLayer({
      id: "routes-line",
      type: "line",
      source: "routes",
      layout: {
        "line-join": "round",
        "line-cap": "round",
        visibility: showRoutes ? "visible" : "none",
      },
      paint: {
        "line-color": "#6366f1",
        "line-width": 1.5,
        "line-opacity": 0.6,
        "line-dasharray": [3, 3],
      },
    });

    console.log("Cargo routes layer added successfully");
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [0, 20],
      zoom: 1.5,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.current.addControl(new mapboxgl.FullscreenControl(), "top-right");
    map.current.addControl(new mapboxgl.ScaleControl());

    // Create popup instance
    popup.current = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: true,
      offset: 15,
    });

    // Wait for map to load before adding layers
    map.current.on("load", () => {
      addCargoRoutes();      // Add routes first (bottom layer)
      addIncidentLayers();   // Add incidents second (top layer)
    });

    return () => {
      popup.current?.remove();
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update GeoJSON data when filtered incidents change
  useEffect(() => {
    if (!map.current || !map.current.getSource("incidents")) return;

    const source = map.current.getSource("incidents") as mapboxgl.GeoJSONSource;
    source.setData(incidentsGeoJSON);
  }, [incidentsGeoJSON]);

  // Toggle route visibility
  useEffect(() => {
    if (!map.current || !map.current.getLayer("routes-line")) return;

    map.current.setLayoutProperty(
      "routes-line",
      "visibility",
      showRoutes ? "visible" : "none"
    );
  }, [showRoutes]);

  // Listen for view incident events from popup
  useEffect(() => {
    const handleViewIncident = (e: Event) => {
      const customEvent = e as CustomEvent;
      const incidentId = customEvent.detail;
      const incident = incidents.find((i) => i.id === incidentId);
      if (incident) {
        setSelectedIncident(incident);
        popup.current?.remove();
      }
    };

    window.addEventListener("view-incident", handleViewIncident);
    return () => window.removeEventListener("view-incident", handleViewIncident);
  }, [incidents]);

  // Fly to region
  const flyToRegion = (regionName: string) => {
    const region = regions.find((r) => r.name === regionName);
    if (region && region.longitude && region.latitude && map.current) {
      // Close popup when flying to region
      popup.current?.remove();

      map.current.flyTo({
        center: [parseFloat(region.longitude), parseFloat(region.latitude)],
        zoom: 8,
        duration: 2000,
      });
    }
  };

  // Fly to incident
  const flyToIncident = (incident: Incident) => {
    if (!incident.latitude || !incident.longitude) return;
    const lat = parseFloat(incident.latitude);
    const lng = parseFloat(incident.longitude);
    if (!isNaN(lat) && !isNaN(lng) && map.current) {
      // Clear filters to ensure incident is visible
      setSelectedRegion("all");
      setSelectedSeverity("all");
      setSelectedType("all");

      // Close popup when flying to incident
      popup.current?.remove();

      // Fly to incident location
      map.current.flyTo({
        center: [lng, lat],
        zoom: 10,
        duration: 2000,
      });

      // Show popup after animation
      setTimeout(() => {
        if (popup.current && map.current) {
          popup.current
            .setLngLat([lng, lat])
            .setHTML(`
              <div style="padding: 8px; max-width: 280px;">
                <h3 style="font-weight: 600; color: #1f2937; font-size: 14px; margin-bottom: 4px;">
                  ${incident.title}
                </h3>
                <p style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">
                  ${incident.region}
                </p>
                <div style="margin-bottom: 8px;">
                  <span style="
                    background-color: ${getSeverityColor(incident.severityLevel)}20;
                    color: ${getSeverityColor(incident.severityLevel)};
                    padding: 2px 8px;
                    border-radius: 9999px;
                    font-size: 11px;
                    font-weight: 500;
                  ">
                    ${incident.severityLevel.toUpperCase()}
                  </span>
                </div>
                <p style="font-size: 12px; color: #4b5563; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                  ${incident.description}
                </p>
                <button
                  onclick="window.dispatchEvent(new CustomEvent('view-incident', { detail: '${incident.id}' }))"
                  style="
                    margin-top: 12px;
                    width: 100%;
                    background-color: #d93025;
                    color: white;
                    padding: 6px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 500;
                    border: none;
                    cursor: pointer;
                  "
                  onmouseover="this.style.backgroundColor='#c72419'"
                  onmouseout="this.style.backgroundColor='#d93025'"
                >
                  View Full Details
                </button>
              </div>
            `)
            .addTo(map.current);
        }
      }, 2100);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-brand-navy-dark">
      {/* Header */}
      <div className="gradient-navy-section border-b border-gray-700 px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-white">Interactive Incident Map</h1>
          <p className="mt-2 text-gray-400">
            Geographic view of cargo theft and suspicious activity across monitored regions
          </p>
        </div>
      </div>

      {/* Real-Time Monitoring Banner */}
      <div className="border-b border-gray-700 px-6 py-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-lg bg-brand-red p-6">
            <div className="flex items-center gap-3">
              <MapPinIcon className="h-8 w-8 text-white" />
              <div>
                <h2 className="text-lg font-semibold text-white">Real-Time Monitoring</h2>
                <p className="mt-2 text-sm text-white/90">
                  This map updates in real-time as incidents are reported by community
                  members across the freight network.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Map Section */}
        <div className="p-6">
          <div className="rounded-lg border-2 border-gray-700 bg-brand-navy-light/30 p-4">
            {/* Filters */}
            <div className="mb-4 flex flex-wrap gap-4">
              {/* Region Filter */}
              <div className="relative flex-1 min-w-[200px]">
                <button
                  onClick={() => setShowRegionDropdown(!showRegionDropdown)}
                  className="flex w-full items-center justify-between rounded-lg border border-gray-600 bg-brand-navy px-4 py-2 text-sm text-white hover:bg-brand-navy-light"
                >
                  <div className="flex items-center gap-2">
                    <FunnelIcon className="h-4 w-4 text-gray-400" />
                    <span>
                      {selectedRegion === "all"
                        ? "All Regions"
                        : regions.find((r) => r.name === selectedRegion)?.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    ({filteredIncidents.length})
                  </span>
                </button>

                {showRegionDropdown && (
                  <div className="absolute z-50 mt-2 max-h-96 w-full overflow-y-auto rounded-lg border border-gray-600 bg-brand-navy shadow-xl">
                    <div className="sticky top-0 bg-brand-navy p-2">
                      <input
                        type="text"
                        placeholder="Search regions..."
                        value={regionSearch}
                        onChange={(e) => setRegionSearch(e.target.value)}
                        className="w-full rounded bg-brand-navy-dark px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-red"
                      />
                    </div>
                    <button
                      onClick={() => {
                        setSelectedRegion("all");
                        setShowRegionDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-white hover:bg-brand-navy-light"
                    >
                      All Regions ({incidents.length})
                    </button>
                    {filteredRegions.map((region) => (
                      <button
                        key={region.id}
                        onClick={() => {
                          setSelectedRegion(region.name);
                          setShowRegionDropdown(false);
                          flyToRegion(region.name);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-white hover:bg-brand-navy-light"
                      >
                        {region.name} ({region.incidentCount})
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Severity Filter */}
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="rounded-lg border border-gray-600 bg-brand-navy px-4 py-2 text-sm text-white hover:bg-brand-navy-light focus:outline-none focus:ring-2 focus:ring-brand-red"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="rounded-lg border border-gray-600 bg-brand-navy px-4 py-2 text-sm text-white hover:bg-brand-navy-light focus:outline-none focus:ring-2 focus:ring-brand-red"
              >
                <option value="all">All Types</option>
                <option value="theft">Theft</option>
                <option value="suspicious">Suspicious Activity</option>
                <option value="tampering">Tampering</option>
                <option value="attempted_break_in">Attempted Break-in</option>
              </select>

              {/* Routes Toggle */}
              <button
                onClick={() => setShowRoutes(!showRoutes)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  showRoutes
                    ? "border-indigo-500 bg-indigo-500 text-white"
                    : "border-gray-600 bg-brand-navy text-white hover:bg-brand-navy-light"
                }`}
              >
                {showRoutes ? "Hide Routes" : "Show Routes"}
              </button>
            </div>

            {/* Map Container */}
            <div ref={mapContainer} className="h-[600px] w-full overflow-hidden rounded-lg" />

            {/* Map Legend */}
            <div className="mt-4 flex items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-brand-red"></div>
                <span>Critical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                <span>High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span>Low</span>
              </div>
              <span className="ml-auto">Total Incidents: {filteredIncidents.length}</span>
            </div>
          </div>
        </div>

        {/* Statistics and Activity Section - Below Map */}
        <div className="px-6 pb-6">
          <div className="mx-auto grid gap-6 lg:grid-cols-2">
            {/* Regional Statistics */}
            <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-6">
              <h2 className="text-lg font-semibold text-white">Regional Statistics</h2>
              <div className="mt-4 space-y-4">
                {topRegions.map((region) => (
                  <div
                    key={region.id}
                    className="cursor-pointer rounded-lg border border-gray-700 bg-brand-navy p-4 hover:bg-brand-navy-dark"
                    onClick={() => {
                      setSelectedRegion(region.name);
                      flyToRegion(region.name);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium text-white">{region.city}, {region.state}</h3>
                      <div className="text-xs text-brand-red">↗</div>
                    </div>
                    <div className="mt-2 text-3xl font-bold text-white">
                      {region.incidentCount}
                    </div>
                    <div className="mt-1 text-xs text-gray-400">incidents in 2024</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-6">
              <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
              <div className="mt-4 space-y-4">
                {recentIncidents.map((incident) => (
                  <div
                    key={incident.id}
                    className="cursor-pointer rounded-lg border border-gray-700 bg-brand-navy p-3 hover:bg-brand-navy-dark"
                    onClick={() => flyToIncident(incident)}
                  >
                    <h3 className="text-sm font-medium text-white">
                      {incident.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                      <MapPinIcon className="h-3 w-3" />
                      <span>{incident.specificLocation}</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {timeAgo(incident.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-gray-700 bg-brand-navy shadow-xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-700 bg-brand-navy p-4">
              <h2 className="text-xl font-semibold text-white">
                Incident Details
              </h2>
              <button
                onClick={() => setSelectedIncident(null)}
                className="rounded-lg p-2 text-gray-400 hover:bg-brand-navy-light hover:text-white"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {selectedIncident.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className="rounded-full px-2 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: `${getSeverityColor(selectedIncident.severityLevel)}20`,
                        color: getSeverityColor(selectedIncident.severityLevel),
                      }}
                    >
                      {selectedIncident.severityLevel.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-400">
                      {selectedIncident.incidentType.replace(/_/g, " ").toUpperCase()}
                    </span>
                  </div>
                </div>
                <span className="text-sm text-gray-400">
                  {timeAgo(selectedIncident.createdAt)}
                </span>
              </div>

              {/* Description */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-400">Description</h4>
                <p className="mt-2 text-sm text-gray-300">
                  {selectedIncident.description}
                </p>
              </div>

              {/* Location */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-400">Location</h4>
                <div className="mt-2 space-y-1 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-brand-red" />
                    <span>{selectedIncident.region}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {selectedIncident.specificLocation}
                  </div>
                  <div className="text-xs text-gray-600">
                    {selectedIncident.latitude}, {selectedIncident.longitude}
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Date</h4>
                  <p className="mt-1 text-sm text-gray-300">
                    {new Date(selectedIncident.incidentDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Time</h4>
                  <p className="mt-1 text-sm text-gray-300">
                    {selectedIncident.incidentTime}
                  </p>
                </div>
              </div>

              {/* Reporter */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-400">Reported By</h4>
                <div className="mt-2 text-sm text-gray-300">
                  <div>{selectedIncident.reporterName}</div>
                  <div className="text-xs text-gray-500">
                    {selectedIncident.reporterCompany}
                  </div>
                </div>
              </div>

              {/* Cargo Type */}
              {selectedIncident.cargoType && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-400">Cargo Type</h4>
                  <p className="mt-1 text-sm text-gray-300">
                    {selectedIncident.cargoType.replace(/_/g, " ").toUpperCase()}
                  </p>
                </div>
              )}

              {/* Estimated Loss */}
              {selectedIncident.estimatedLoss && selectedIncident.estimatedLoss !== "0" && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-400">Estimated Loss</h4>
                  <p className="mt-1 text-sm font-semibold text-brand-red">
                    ${parseInt(selectedIncident.estimatedLoss).toLocaleString()}
                  </p>
                </div>
              )}

              {/* Evidence */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-400">Evidence</h4>
                <div className="mt-2 flex gap-2 text-xs text-gray-400">
                  {selectedIncident.hasPhotos && (
                    <span className="rounded-full bg-brand-navy-light px-3 py-1">
                      📷 {selectedIncident.evidenceCount} Photos
                    </span>
                  )}
                  {selectedIncident.hasVideo && (
                    <span className="rounded-full bg-brand-navy-light px-3 py-1">
                      🎥 Video Available
                    </span>
                  )}
                </div>
              </div>

              {/* Engagement */}
              <div className="mt-4 flex gap-4 text-xs text-gray-400">
                <span>{selectedIncident.viewCount} views</span>
                <span>{selectedIncident.commentCount} comments</span>
                <span>{selectedIncident.shareCount} shares</span>
              </div>

              {/* Action Buttons */}
              <div className="mt-6">
                <button className="w-full rounded-lg border border-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-navy-light">
                  Share Alert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
