import { useState, useEffect } from "react";
import { Waypoint } from "@/types/routePlanner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";

interface WaypointControlsProps {
  waypoints: Waypoint[];
  onWaypointChange: (id: number, lon: number, lat: number) => void;
}

const WaypointControls = ({
  waypoints,
  onWaypointChange,
}: WaypointControlsProps) => {
  // Track input values locally to allow free typing
  const [inputValues, setInputValues] = useState<Record<number, string>>({});

  // Sync input values from waypoints
  useEffect(() => {
    const newInputValues: Record<number, string> = {};
    waypoints.forEach((wp) => {
      // Always update if waypoint is empty (cleared)
      if (wp.lon === 0 && wp.lat === 0) {
        newInputValues[wp.id] = "";
      } else if (!(wp.id in inputValues) || inputValues[wp.id] === "") {
        // Initialize new waypoints or update empty ones
        newInputValues[wp.id] = `${wp.lon.toFixed(6)}, ${wp.lat.toFixed(6)}`;
      } else {
        // Keep existing input value for waypoints being edited
        newInputValues[wp.id] = inputValues[wp.id];
      }
    });
    setInputValues(newInputValues);
  }, [waypoints]);

  const handleInputChange = (id: number, value: string) => {
    // Update local state immediately for responsive typing
    setInputValues((prev) => ({ ...prev, [id]: value }));

    // Parse and update parent state only if valid
    const parts = value.split(",").map((s) => s.trim());
    if (parts.length === 2) {
      const lon = parseFloat(parts[0]);
      const lat = parseFloat(parts[1]);
      if (!isNaN(lon) && !isNaN(lat)) {
        onWaypointChange(id, lon, lat);
      }
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold text-foreground">
        Waypoints
      </Label>
      {waypoints.length === 0 ? (
        <div className="text-sm text-muted-foreground italic p-3 bg-secondary/30 rounded-lg text-center">
          Click on the map to add waypoints
        </div>
      ) : (
        <div className="space-y-2">
          {waypoints.map((waypoint, index) => (
            <div key={waypoint.id}>
              <Input
                type="text"
                placeholder={`Lon, Lat (e.g., -122.408, 37.781)`}
                value={inputValues[waypoint.id] || ""}
                onChange={(e) => handleInputChange(waypoint.id, e.target.value)}
                className="text-sm"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WaypointControls;
