export interface Waypoint {
  id: number;
  lon: number;
  lat: number;
  label: string;
}

export interface RouteStatistics {
  distance: number; // in meters
  time: number; // in seconds
  elevationGain: number; // in meters
  elevationLoss: number; // in meters
}

export interface RouteData {
  coordinates: [number, number][]; // [lat, lon] pairs for the route line
  waypoints: Waypoint[];
  profile: string;
  statistics: RouteStatistics;
  rawGeoJSON: any; // Full API response for additional data
}

export interface RoutePlannerProps {
  onRouteGenerated?: (routeData: RouteData) => void;
  onRouteCleared?: () => void;
  className?: string;
}
