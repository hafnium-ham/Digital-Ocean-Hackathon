import { Route } from "@/types/route";

import routeScenic1 from "@/assets/route-scenic-1.jpg";
import routeCoastal from "@/assets/route-coastal.jpg";
import routeDesert from "@/assets/route-desert.jpg";
import routeForest from "@/assets/route-forest.jpg";
import routeAlpine from "@/assets/route-alpine.jpg";
import routeCity from "@/assets/route-city.jpg";
import routeVineyard from "@/assets/route-vineyard.jpg";
import routeBridge from "@/assets/route-bridge.jpg";

export const mockRoutes: Route[] = [
  {
    id: "a",
    name: "Route A - Scenic",
    color: "scenic",
    distance: "342 mi",
    time: "5h 45m",
    tollCost: "$8.50",
    fuelEstimate: "$45",
    sceneryRating: 4.8,
    images: [
      { url: routeScenic1, location: "Mountain Pass" },
      { url: routeCoastal, location: "Pacific Coast" },
      { url: routeForest, location: "Redwood Forest" },
      { url: routeAlpine, location: "Alpine Valley" },
      { url: routeVineyard, location: "Wine Country" },
      { url: routeBridge, location: "Golden Gate" },
    ],
    description: [
      "This scenic route takes you through some of the most breathtaking landscapes California has to offer. Starting from San Francisco, you'll wind your way along the Pacific Coast Highway, where dramatic cliffs meet the endless blue ocean.",
      "As you continue inland, the route passes through the majestic Redwood forests. These ancient giants, some over 2,000 years old, create a cathedral-like atmosphere that makes this stretch truly magical, especially in the early morning mist.",
      "The middle section traverses rolling wine country, where endless vineyards carpet the hillsides in shades of green and gold. This is the perfect opportunity to stop at a local winery for a quick tasting or to pick up some artisanal cheeses.",
      "The final approach features panoramic mountain views with snow-capped peaks in the distance. The road quality is excellent throughout, with well-maintained surfaces and gentle curves that make for an enjoyable drive.",
      "Best driven during golden hour for optimal photography opportunities. Consider starting early to catch the morning fog lifting off the coast, or time your arrival at the mountain section for sunset."
    ],
  },
  {
    id: "b",
    name: "Route B - Fastest",
    color: "fastest",
    distance: "285 mi",
    time: "4h 15m",
    tollCost: "$22.00",
    fuelEstimate: "$38",
    sceneryRating: 3.2,
    images: [
      { url: routeCity, location: "Urban Skyline" },
      { url: routeDesert, location: "Valley Highway" },
      { url: routeBridge, location: "Interstate Bridge" },
      { url: routeCoastal, location: "Coastal Express" },
    ],
    description: [
      "The fastest route prioritizes efficiency, taking you primarily along major interstate highways with minimal stops required. This is the go-to option for business travelers or anyone on a tight schedule.",
      "Highway conditions are excellent with multiple lanes throughout most of the journey. Traffic is generally predictable, though rush hours near major metropolitan areas can add 20-30 minutes to your travel time.",
      "Rest stops are frequent along this route, with full-service stations appearing every 30-40 miles. Most feature modern amenities including electric vehicle charging stations, restaurants, and convenience stores.",
      "While the scenery is less dramatic than alternative routes, you'll still catch glimpses of urban skylines and distant mountains. The final 50 miles offer some pleasant coastal views as you approach your destination."
    ],
  },
  {
    id: "c",
    name: "Route C - Alternative",
    color: "alternative",
    distance: "398 mi",
    time: "6h 30m",
    tollCost: "$0.00",
    fuelEstimate: "$52",
    sceneryRating: 4.4,
    images: [
      { url: routeDesert, location: "Desert Canyon" },
      { url: routeForest, location: "Pine Ridge" },
      { url: routeAlpine, location: "Summit View" },
      { url: routeVineyard, location: "Farmland" },
      { url: routeBridge, location: "River Crossing" },
    ],
    description: [
      "This alternative route is perfect for adventurous drivers who want to avoid tolls completely while still enjoying spectacular scenery. The journey takes you through less-traveled roads with authentic small-town charm.",
      "The desert section in the early morning is particularly stunning, with colors ranging from deep oranges to soft pinks as the sun rises. Wildlife sightings are common – keep an eye out for coyotes, jackrabbits, and various bird species.",
      "The mountain pass section climbs to over 6,000 feet elevation, offering cool temperatures even in summer. The road includes several scenic overlooks perfect for stretching your legs and capturing photos.",
      "Small towns along the route offer unique dining experiences, from family-owned diners serving homestyle cooking to artisan cafes with locally roasted coffee. These stops add character to your journey that highway travel simply cannot match.",
      "Road conditions vary more on this route – some sections may have rough patches or construction during summer months. Check conditions before departure and ensure your vehicle is in good shape for mountain driving."
    ],
  },
];

export const getRoute = (id: string): Route | undefined => {
  return mockRoutes.find((r) => r.id === id);
};