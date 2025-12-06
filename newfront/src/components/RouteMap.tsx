import { useState } from "react";
import { Route } from "@/types/route";
import { Clock, DollarSign, Gauge } from "lucide-react";

interface RouteMapProps {
  routes: Route[];
  selectedRoute: string;
  onSelectRoute: (id: string) => void;
}

const RouteMap = ({ routes, selectedRoute, onSelectRoute }: RouteMapProps) => {
  return (
    <div className="h-full flex flex-col">
      {/* Map Placeholder */}
      <div className="relative flex-1 bg-secondary/50 rounded-xl overflow-hidden">
        {/* SVG Map Visualization */}
        <svg
          viewBox="0 0 400 300"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Background grid */}
          <defs>
            <pattern
              id="grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="0.5"
              />
            </pattern>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Route C (Alternative) */}
          <path
            d="M 50 250 Q 100 200 120 180 Q 180 120 220 100 Q 280 80 350 50"
            fill="none"
            stroke="hsl(var(--route-alternative))"
            strokeWidth={selectedRoute === "c" ? "4" : "3"}
            strokeLinecap="round"
            strokeDasharray={selectedRoute === "c" ? "none" : "8 4"}
            opacity={selectedRoute === "c" ? 1 : 0.5}
            className="transition-all duration-300 cursor-pointer"
            onClick={() => onSelectRoute("c")}
            filter={selectedRoute === "c" ? "url(#glow)" : "none"}
          />

          {/* Route B (Fastest) */}
          <path
            d="M 50 250 Q 150 220 200 180 Q 250 140 300 100 Q 330 80 350 50"
            fill="none"
            stroke="hsl(var(--route-fastest))"
            strokeWidth={selectedRoute === "b" ? "4" : "3"}
            strokeLinecap="round"
            strokeDasharray={selectedRoute === "b" ? "none" : "8 4"}
            opacity={selectedRoute === "b" ? 1 : 0.5}
            className="transition-all duration-300 cursor-pointer"
            onClick={() => onSelectRoute("b")}
            filter={selectedRoute === "b" ? "url(#glow)" : "none"}
          />

          {/* Route A (Scenic) */}
          <path
            d="M 50 250 Q 80 200 100 170 Q 140 120 180 100 Q 240 60 300 50 Q 330 48 350 50"
            fill="none"
            stroke="hsl(var(--route-scenic))"
            strokeWidth={selectedRoute === "a" ? "4" : "3"}
            strokeLinecap="round"
            opacity={selectedRoute === "a" ? 1 : 0.5}
            className="transition-all duration-300 cursor-pointer"
            onClick={() => onSelectRoute("a")}
            filter={selectedRoute === "a" ? "url(#glow)" : "none"}
          />

          {/* Start marker */}
          <circle
            cx="50"
            cy="250"
            r="8"
            fill="hsl(var(--primary))"
            stroke="white"
            strokeWidth="3"
          />
          <text
            x="50"
            y="275"
            textAnchor="middle"
            className="text-xs fill-foreground font-medium"
          >
            Start
          </text>

          {/* End marker */}
          <circle
            cx="350"
            cy="50"
            r="8"
            fill="hsl(var(--destructive))"
            stroke="white"
            strokeWidth="3"
          />
          <text
            x="350"
            y="30"
            textAnchor="middle"
            className="text-xs fill-foreground font-medium"
          >
            End
          </text>
        </svg>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 shadow-card">
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 rounded bg-route-scenic" />
              <span>Scenic</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 rounded bg-route-fastest" />
              <span>Fastest</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 rounded bg-route-alternative" />
              <span>Alternative</span>
            </div>
          </div>
        </div>
      </div>

      {/* Route Summary Cards */}
      <div className="mt-4 space-y-3">
        {routes.map((route) => (
          <button
            key={route.id}
            onClick={() => onSelectRoute(route.id)}
            className={`w-full text-left p-3 rounded-xl border-2 transition-all duration-200 ${
              selectedRoute === route.id
                ? "border-primary bg-primary/5 shadow-card"
                : "border-border bg-card hover:border-primary/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: `hsl(var(--route-${route.color}))` }}
              />
              <span className="font-medium text-sm">{route.name}</span>
            </div>
            <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Gauge className="w-3 h-3" />
                {route.distance}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {route.time}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                {route.tollCost}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RouteMap;