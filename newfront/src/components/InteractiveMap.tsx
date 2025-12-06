import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Waypoint } from "@/types/routePlanner";

// Fix for default marker icons in Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface InteractiveMapProps {
  waypoints: Waypoint[];
  routeCoordinates: [number, number][] | null;
  onMapClick: (lat: number, lon: number) => void;
  className?: string;
}

const InteractiveMap = ({
  waypoints,
  routeCoordinates,
  onMapClick,
  className = "",
}: InteractiveMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView([37.7749, -122.4194], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    map.on("click", (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when waypoints change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    waypoints.forEach((waypoint) => {
      const marker = L.marker([waypoint.lat, waypoint.lon])
        .addTo(mapRef.current!)
        .bindPopup(waypoint.label);

      markersRef.current.push(marker);
    });
  }, [waypoints]);

  // Update route line when coordinates change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing route line
    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }

    // Add new route line
    if (routeCoordinates && routeCoordinates.length > 0) {
      const routeLine = L.polyline(routeCoordinates, {
        color: "hsl(var(--primary))",
        weight: 4,
        opacity: 0.8,
      }).addTo(mapRef.current);

      routeLineRef.current = routeLine;

      // Fit bounds to show entire route
      mapRef.current.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
    }
  }, [routeCoordinates]);

  return (
    <div
      ref={mapContainerRef}
      className={`w-full h-full rounded-xl overflow-hidden ${className}`}
      style={{ minHeight: "400px" }}
    />
  );
};

export default InteractiveMap;
