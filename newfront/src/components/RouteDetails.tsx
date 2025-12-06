import { useEffect, useState } from "react";
import { RouteData } from "@/types/routePlanner";
import {
  Clock,
  Gauge,
  TrendingUp,
  TrendingDown,
  MapPin,
  ExternalLink,
  Navigation,
  Route as RouteIcon,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import RouteStreetView from "./RouteStreetView";
import RoutePOIs from "./RoutePOIs";

interface RouteDetailsProps {
  routeData: RouteData | null;
}

const RouteDetails = ({ routeData }: RouteDetailsProps) => {
  // ALL HOOKS MUST BE AT THE TOP - before any conditional returns!
  const [summary, setSummary] = useState<string>("");
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Fetch AI-generated route summary
  useEffect(() => {
    // Guard: only fetch if routeData exists
    if (!routeData) return;

    const fetchSummary = async () => {
      setLoadingSummary(true);
      try {
        const { statistics, waypoints } = routeData;
        
        // Format data
        const distanceKm = (statistics.distance / 1000).toFixed(2);
        const distanceMiles = (statistics.distance / 1609.34).toFixed(2);
        const adjustedTime = statistics.time / 12;
        const timeHours = Math.floor(adjustedTime / 3600);
        const timeMinutes = Math.floor((adjustedTime % 3600) / 60);
        const timeDisplay =
          timeHours > 0 ? `${timeHours}h ${timeMinutes}m` : `${timeMinutes}m`;

        const response = await fetch("http://localhost:5001/api/route-summary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            distance_km: distanceKm,
            distance_mi: distanceMiles,
            time_display: timeDisplay,
            waypoints: waypoints.map(wp => ({
              label: wp.label,
              lat: wp.lat,
              lon: wp.lon
            })),
            profile: routeData.profile
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setSummary(data.summary || "");
        }
      } catch (error) {
        console.error("Error fetching route summary:", error);
      } finally {
        setLoadingSummary(false);
      }
    };

    fetchSummary();
  }, [routeData]);

  // NOW it's safe to do early returns
  if (!routeData) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <RouteIcon className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No Route Generated Yet
          </h3>
          <p className="text-muted-foreground text-sm">
            Use the Route Planner on the left to create a route. Click on the
            map to add waypoints, then click "Generate Route" to see detailed
            information here.
          </p>
        </Card>
      </div>
    );
  }

  const { statistics, waypoints } = routeData;

  // Format data
  const distanceKm = (statistics.distance / 1000).toFixed(2);
  const distanceMiles = (statistics.distance / 1609.34).toFixed(2);
  // Adjust time for car travel (divide by 12)
  // statistics.time is in seconds from BRouter API
  const adjustedTime = statistics.time / 12;
  const timeHours = Math.floor(adjustedTime / 3600);
  const timeMinutes = Math.floor((adjustedTime % 3600) / 60);
  const timeDisplay =
    timeHours > 0 ? `${timeHours}h ${timeMinutes}m` : `${timeMinutes}m`;

  // Calculate fuel estimate (rough estimate: 25 mpg average)
  const fuelGallons = (parseFloat(distanceMiles) / 25).toFixed(1);

  // Build Google Maps URL
  const waypointsParam = waypoints
    .map((wp) => `${wp.lat},${wp.lon}`)
    .join("/");
  const googleMapsUrl = `https://www.google.com/maps/dir/${waypointsParam}`;

  return (
    <div className="flex flex-col pb-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <RouteIcon className="w-6 h-6 text-primary" />
          Your Route
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {waypoints.length} waypoints • {routeData.profile} profile
        </p>
      </div>

      {/* AI-Generated Summary */}
      {loadingSummary ? (
        <Card className="p-4 mb-6 bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        </Card>
      ) : summary ? (
        <Card className="p-4 mb-6 bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary mt-1 flex-shrink-0 animate-pulse" />
            <div className="flex-1">
              <p className="text-sm leading-relaxed text-foreground">
                {summary}
              </p>
            </div>
          </div>
        </Card>
      ) : null}

      {/* Stats Bar */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-4 text-center animate-fade-in">
          <Gauge className="w-5 h-5 mx-auto text-primary mb-2" />
          <div className="text-2xl font-bold text-foreground">
            {distanceKm}
          </div>
          <div className="text-xs text-muted-foreground">km</div>
          <div className="text-xs text-muted-foreground/70 mt-1">
            ({distanceMiles} mi)
          </div>
        </Card>

        <Card
          className="p-4 text-center animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <Clock className="w-5 h-5 mx-auto text-primary mb-2" />
          <div className="text-2xl font-bold text-foreground">{timeDisplay}</div>
          <div className="text-xs text-muted-foreground">Travel Time</div>
        </Card>
      </div>

      {/* Waypoints List */}
      <Card className="p-4 mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Route Waypoints
        </h3>
        <div className="space-y-2">
          {waypoints.map((waypoint, index) => (
            <div
              key={waypoint.id}
              className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">
                  {waypoint.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {waypoint.lat.toFixed(5)}, {waypoint.lon.toFixed(5)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Points of Interest */}
      <div className="mb-6">
        <RoutePOIs coordinates={routeData.coordinates} />
      </div>

      {/* Street View Images */}
      <div className="mb-6">
        <RouteStreetView coordinates={routeData.coordinates} />
      </div>

      {/* Additional Info */}
      <Card className="p-4 mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-3">
          Estimated Fuel Cost
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Fuel consumption (est.):
            </span>
            <span className="text-sm font-semibold text-foreground">
              ~{fuelGallons} gallons
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              At $5.00/gallon:
            </span>
            <span className="text-sm font-semibold text-primary">
              ${(parseFloat(fuelGallons) * 5.0).toFixed(2)}
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3 italic">
          * Estimates based on average vehicle (25 mpg). Actual consumption may
          vary.
        </p>
      </Card>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-border flex gap-3">
        <Button
          variant="outline"
          className="flex-1 h-11 rounded-xl border-2 hover:bg-secondary"
          onClick={() => window.open(googleMapsUrl, "_blank")}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Open in Google Maps
        </Button>
        <Button
          className="flex-1 h-11 rounded-xl gradient-primary shadow-glow hover:shadow-[0_0_50px_hsl(var(--primary)/0.3)] transition-all"
          onClick={() => window.open(googleMapsUrl, "_blank")}
        >
          <Navigation className="w-4 h-4 mr-2" />
          Start Navigation
        </Button>
      </div>
    </div>
  );
};

export default RouteDetails;
