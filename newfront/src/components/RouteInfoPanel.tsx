import { RouteStatistics } from "@/types/routePlanner";
import { Card } from "@/components/ui/card";
import { Gauge, Clock, TrendingUp, TrendingDown } from "lucide-react";

interface RouteInfoPanelProps {
  statistics: RouteStatistics | null;
  isLoading?: boolean;
  error?: string | null;
}

const RouteInfoPanel = ({
  statistics,
  isLoading,
  error,
}: RouteInfoPanelProps) => {
  if (error) {
    return (
      <Card className="p-4 bg-destructive/10 border-destructive/20">
        <p className="text-destructive text-sm font-medium">Error: {error}</p>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-4">
        <p className="text-muted-foreground text-sm text-center">
          Generating route...
        </p>
      </Card>
    );
  }

  if (!statistics) {
    return null;
  }

  const distanceKm = (statistics.distance / 1000).toFixed(2);
  // Adjust time for car travel (divide by 12)
  const adjustedTime = statistics.time / 5;
  const timeMin = (adjustedTime / 60).toFixed(1);

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">
        Route Information
      </h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between py-2 border-b border-border">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Gauge className="w-4 h-4" />
            <span className="text-sm">Distance:</span>
          </div>
          <span className="text-sm font-semibold text-primary">
            {distanceKm} km
          </span>
        </div>
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Est. Time:</span>
          </div>
          <span className="text-sm font-semibold text-primary">
            {timeMin} min
          </span>
        </div>
      </div>
    </Card>
  );
};

export default RouteInfoPanel;
