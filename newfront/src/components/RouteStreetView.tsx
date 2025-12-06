import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Camera } from "lucide-react";

interface ImageData {
  heading: number;
  image_url: string;
}

interface PointWithImages {
  lat: number;
  lon: number;
  label: string;
  images: ImageData[];
  loading: boolean;
}

interface RouteStreetViewProps {
  coordinates: [number, number][]; // [lat, lon] pairs
}

const RouteStreetView = ({ coordinates }: RouteStreetViewProps) => {
  const [points, setPoints] = useState<PointWithImages[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Sample 5 evenly distributed points along the route and fetch images
  useEffect(() => {
    if (!coordinates || coordinates.length < 2) {
      setPoints([]);
      return;
    }

    const sampleAndFetchImages = async () => {
      setError(null);

      // Sample 5 points along the route
      const totalPoints = coordinates.length;
      const indices = [
        0, // Start
        Math.floor(totalPoints * 0.25), // 25%
        Math.floor(totalPoints * 0.5), // 50%
        Math.floor(totalPoints * 0.75), // 75%
        totalPoints - 1, // End
      ];

      const labels = ["Start", "25% along route", "Midpoint", "75% along route", "End"];

      // Initialize points with loading state
      const initialPoints: PointWithImages[] = indices.map((idx, position) => ({
        lat: coordinates[idx][0],
        lon: coordinates[idx][1],
        label: labels[position],
        images: [],
        loading: true,
      }));

      setPoints(initialPoints);

      // Fetch images for each point
      try {
        const fetchPromises = initialPoints.map(async (point, index) => {
          try {
            const response = await fetch(
              `http://localhost:5001/image-data?lat=${point.lat}&lon=${point.lon}`
            );
            if (!response.ok) throw new Error("Failed to fetch images");
            const data = await response.json();
            return { index, images: data.images as ImageData[] };
          } catch (err) {
            console.error(`Error fetching images for point ${index}:`, err);
            return { index, images: [] };
          }
        });

        const results = await Promise.all(fetchPromises);

        // Update points with fetched images
        setPoints((prevPoints) =>
          prevPoints.map((point, idx) => {
            const result = results.find((r) => r.index === idx);
            return {
              ...point,
              images: result?.images || [],
              loading: false,
            };
          })
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load street view images"
        );
        console.error("Street view fetch error:", err);
        // Mark all as not loading even on error
        setPoints((prevPoints) =>
          prevPoints.map((point) => ({ ...point, loading: false }))
        );
      }
    };

    sampleAndFetchImages();
  }, [coordinates]);

  if (!coordinates || coordinates.length < 2) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Camera className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">
          Street View Preview
        </h3>
        <span className="text-xs text-muted-foreground">
          ({points.length} locations sampled)
        </span>
      </div>

      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive/20">
          <p className="text-destructive text-sm">{error}</p>
        </Card>
      )}

      <div className="space-y-6">
        {points.map((point, idx) => (
          <Card key={`${point.lat}-${point.lon}-${idx}`} className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-foreground">{point.label}</h4>
              <span className="text-xs text-muted-foreground">
                ({point.lat.toFixed(5)}, {point.lon.toFixed(5)})
              </span>
            </div>

            {point.loading ? (
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="w-full h-32 rounded-lg" />
                ))}
              </div>
            ) : point.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {point.images.map((img) => (
                  <div
                    key={img.heading}
                    className="relative group overflow-hidden rounded-lg"
                  >
                    <img
                      src={img.image_url}
                      alt={`Street view at ${point.label} - ${img.heading}°`}
                      className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {img.heading}°
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No street view available for this location
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RouteStreetView;
