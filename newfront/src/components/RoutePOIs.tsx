import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Coffee, Utensils, Landmark } from "lucide-react";

interface POI {
  name: string;
  type: string;
  lat: number;
  lon: number;
}

interface RoutePOIsProps {
  coordinates: [number, number][]; // [lat, lon] pairs
}

const RoutePOIs = ({ coordinates }: RoutePOIsProps) => {
  const [pois, setPois] = useState<POI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get POI icon based on type
  const getPOIIcon = (type: string) => {
    switch (type) {
      case "restaurant":
        return <Utensils className="w-5 h-5 text-orange-500" />;
      case "cafe":
        return <Coffee className="w-5 h-5 text-amber-600" />;
      case "tourism":
      case "museum":
      case "artwork":
        return <Landmark className="w-5 h-5 text-blue-500" />;
      default:
        return <MapPin className="w-5 h-5 text-primary" />;
    }
  };

  // Get POI emoji based on type
  const getPOIEmoji = (type: string) => {
    const emojiMap: Record<string, string> = {
      restaurant: "🍽️",
      cafe: "☕",
      bar: "🍺",
      pub: "🍺",
      parking: "🅿️",
      toilets: "🚻",
      tourism: "🏛️",
      museum: "🏛️",
      artwork: "🎨",
    };
    return emojiMap[type] || "📍";
  };

  useEffect(() => {
    if (!coordinates || coordinates.length < 2) {
      setPois([]);
      return;
    }

    const fetchPOIs = async () => {
      setLoading(true);
      setError(null);

      try {
        // Calculate bounding box from coordinates
        const lats = coordinates.map((coord) => coord[0]);
        const lons = coordinates.map((coord) => coord[1]);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLon = Math.min(...lons);
        const maxLon = Math.max(...lons);

        const bbox = `${minLat},${minLon},${maxLat},${maxLon}`;

        const response = await fetch(
          `http://localhost:5001/api/pois?bbox=${bbox}`
        );

        if (!response.ok) throw new Error("Failed to fetch POIs");

        const data = await response.json();
        const allPOIs = data.pois || [];

        // Filter for interesting POI types (restaurants, cafes, tourism)
        const interestingTypes = [
          "restaurant",
          "cafe",
          "tourism",
          "museum",
          "artwork",
        ];
        const filteredPOIs = allPOIs.filter((poi: POI) =>
          interestingTypes.includes(poi.type)
        );

        // Prioritize by type (restaurants, cafes, tourism)
        const priorityOrder = ["restaurant", "cafe", "tourism", "museum", "artwork"];
        const sortedPOIs = filteredPOIs.sort((a: POI, b: POI) => {
          const aIndex = priorityOrder.indexOf(a.type);
          const bIndex = priorityOrder.indexOf(b.type);
          return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
        });

        // Take top 3
        setPois(sortedPOIs.slice(0, 3));
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load points of interest"
        );
        console.error("POI fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPOIs();
  }, [coordinates]);

  if (!coordinates || coordinates.length < 2) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">
          Notable Points of Interest
        </h3>
      </div>

      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive/20">
          <p className="text-destructive text-sm">{error}</p>
        </Card>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : pois.length > 0 ? (
        <div className="space-y-3">
          {pois.map((poi, idx) => (
            <Card
              key={`${poi.lat}-${poi.lon}-${idx}`}
              className="p-4 hover:bg-secondary/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                  {getPOIEmoji(poi.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getPOIIcon(poi.type)}
                    <h4 className="font-semibold text-foreground">{poi.name}</h4>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="bg-secondary px-2 py-0.5 rounded capitalize">
                      {poi.type}
                    </span>
                    <span>
                      {poi.lat.toFixed(4)}, {poi.lon.toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-4">
          <p className="text-sm text-muted-foreground text-center italic">
            No notable points of interest found along this route
          </p>
        </Card>
      )}
    </div>
  );
};

export default RoutePOIs;
