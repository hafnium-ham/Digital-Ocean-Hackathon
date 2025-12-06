export interface RouteImage {
  url: string;
  location: string;
}

export interface Route {
  id: string;
  name: string;
  color: "scenic" | "fastest" | "alternative";
  distance: string;
  time: string;
  tollCost: string;
  fuelEstimate: string;
  sceneryRating: number;
  images: RouteImage[];
  description: string[];
}