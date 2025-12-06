import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Trash2 } from "lucide-react";
import InteractiveMap from "./InteractiveMap";
import WaypointControls from "./WaypointControls";
import RouteInfoPanel from "./RouteInfoPanel";
import {
  Waypoint,
  RouteData,
  RoutePlannerProps,
  RouteStatistics,
} from "@/types/routePlanner";

const RoutePlanner = ({
  onRouteGenerated,
  onRouteCleared,
  className = "",
}: RoutePlannerProps) => {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [routeCoordinates, setRouteCoordinates] = useState<
    [number, number][] | null
  >(null);
  const [routeStatistics, setRouteStatistics] =
    useState<RouteStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextWaypointId, setNextWaypointId] = useState(0);

  const handleMapClick = (lat: number, lon: number) => {
    // Always add a new waypoint when clicking the map
    const newWaypoint: Waypoint = {
      id: nextWaypointId,
      lon,
      lat,
      label: `Waypoint ${nextWaypointId}`,
    };
    setWaypoints((prev) => [...prev, newWaypoint]);
    setNextWaypointId((prev) => prev + 1);
  };

  const handleWaypointChange = (id: number, lon: number, lat: number) => {
    setWaypoints((prev) =>
      prev.map((wp) =>
        wp.id === id ? { ...wp, lon, lat, label: `Waypoint ${id}` } : wp
      )
    );
  };

  const handleGenerateRoute = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // Filter valid waypoints
      const validWaypoints = waypoints.filter(
        (wp) => wp.lon !== 0 && wp.lat !== 0
      );

      if (validWaypoints.length < 2) {
        throw new Error("Please provide at least 2 waypoints");
      }

      // Build waypoints parameter for API
      const waypointsParam = validWaypoints
        .map((wp) => `${wp.lon},${wp.lat}`)
        .join(";");

      // Use 'shortest' profile for direct car-friendly routing
      const profile = "shortest";

      // Call backend API
      const url = `http://localhost:5001/api/route?waypoints=${waypointsParam}&profile=${profile}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to generate route");
      }

      // Extract route data
      const coordinates = data.features[0].geometry.coordinates;
      const latLngs: [number, number][] = coordinates.map((coord: number[]) => [
        coord[1],
        coord[0],
      ]);

      const props = data.features[0].properties;
      const statistics: RouteStatistics = {
        distance: parseFloat(props["track-length"]),
        time: parseFloat(props["total-time"]),
        elevationGain: parseFloat(props["filtered ascend"]),
        elevationLoss: parseFloat(props["filtered descend"]),
      };

      setRouteCoordinates(latLngs);
      setRouteStatistics(statistics);

      // Prepare data to send to parent
      const routeData: RouteData = {
        coordinates: latLngs,
        waypoints: validWaypoints,
        profile,
        statistics,
        rawGeoJSON: data,
      };

      // Call callback if provided
      if (onRouteGenerated) {
        onRouteGenerated(routeData);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Route generation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearRoute = () => {
    setRouteCoordinates(null);
    setRouteStatistics(null);
    setError(null);
    setWaypoints([]);
    setNextWaypointId(0);

    if (onRouteCleared) {
      onRouteCleared();
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Controls Panel */}
      <Card className="p-4 mb-4 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Plan Your Route
          </h2>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg text-sm text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          <strong>How to use:</strong>
          <br />
          1. Click on the map to add waypoints
          <br />
          2. Or enter coordinates manually
          <br />
          3. Click "Generate Route" to see the path
          <br />
          4. Use "Clear" to remove all waypoints
        </div>

        <WaypointControls
          waypoints={waypoints}
          onWaypointChange={handleWaypointChange}
        />

        <div className="flex gap-2">
          <Button
            onClick={handleGenerateRoute}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? "Generating..." : "Generate Route"}
          </Button>
          <Button
            onClick={handleClearRoute}
            variant="outline"
            className="flex-1"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>

        <RouteInfoPanel
          statistics={routeStatistics}
          isLoading={isLoading}
          error={error}
        />
      </Card>

      {/* Map */}
      <div className="flex-1 min-h-[400px]">
        <InteractiveMap
          waypoints={waypoints.filter((wp) => wp.lon !== 0 && wp.lat !== 0)}
          routeCoordinates={routeCoordinates}
          onMapClick={handleMapClick}
          className="h-full"
        />
      </div>
    </div>
  );
};

export default RoutePlanner;
