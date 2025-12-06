import { useState } from "react";
import Header from "@/components/Header";
import SearchCard from "@/components/SearchCard";
import RouteDetails from "@/components/RouteDetails";
import routeScenic1 from "@/assets/route-scenic-1.jpg";
import RoutePlanner from "@/components/RoutePlanner";
import { RouteData } from "@/types/routePlanner";

const Index = () => {
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState({ from: "", to: "" });
  const [routeData, setRouteData] = useState<RouteData | null>(null);

  const handleSearch = () => {
    setShowResults(true);
  };

  const handleRouteGenerated = (data: RouteData) => {
    setRouteData(data);
  };

  const handleRouteCleared = () => {
    setRouteData(null);
  };

  if (!showResults) {
    return (
      <div className="min-h-screen relative">
        <Header variant="transparent" />

        {/* Hero Background */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${routeScenic1})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-foreground/70" />
        </div>

        {/* Search Card */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-16">
          <SearchCard onSearch={handleSearch} />
        </div>

        {/* Scroll indicator */}
        {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/50 flex justify-center pt-2">
            <div className="w-1 h-2 bg-primary-foreground/50 rounded-full" />
          </div>
        </div> */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main Content */}
      <div className="pt-16 min-h-screen">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Left Sidebar - Route Planner */}
          <div className="flex-1 w-[25%] min-w-[300px] border-r border-border bg-card overflow-y-auto">
            <div className="h-full">
              <RoutePlanner
                onRouteGenerated={handleRouteGenerated}
                onRouteCleared={handleRouteCleared}
              />
            </div>
          </div>

          {/* Main Content - Route Details */}
          <div className="flex-1 p-6 overflow-y-auto">
            <RouteDetails routeData={routeData} />
          </div>
        </div>
      </div>

      {/* Back to Search Button */}
      <button
        onClick={() => setShowResults(false)}
        className="fixed bottom-6 left-6 z-50 px-4 py-2 bg-card border border-border rounded-xl shadow-card hover:shadow-card-hover transition-all text-sm font-medium text-foreground"
      >
        ← New Search
      </button>
    </div>
  );
};

export default Index;
