"""
BRouter service for route generation
Documentation: https://github.com/nrenner/brouter-web
"""
import requests
from typing import Dict, List, Optional


class BRouterService:
    """
    Service for interacting with BRouter API for route generation
    """
    
    def __init__(self, base_url: str = "https://brouter.de/brouter"):
        """
        Initialize BRouter service
        
        Args:
            base_url: Base URL for BRouter API
        """
        self.base_url = base_url
        self.profiles = [
            "trekking",
            "fastbike",
            "safety",
            "shortest",
            "moped"
        ]
    
    def get_route(
        self,
        start_lon: float,
        start_lat: float,
        end_lon: float,
        end_lat: float,
        profile: str = "trekking",
        alternativeidx: int = 0,
        format: str = "geojson"
    ) -> Optional[Dict]:
        """
        Get route from BRouter
        
        Args:
            start_lon: Starting longitude
            start_lat: Starting latitude
            end_lon: Ending longitude
            end_lat: Ending latitude
            profile: Routing profile (trekking, fastbike, etc.)
            alternativeidx: Alternative route index (0-2)
            format: Output format (geojson, gpx, kml)
        
        Returns:
            Route data in specified format or None on error
        """
        try:
            # Construct waypoints (lon,lat format for BRouter)
            lonlats = f"{start_lon},{start_lat}|{end_lon},{end_lat}"
            
            params = {
                "lonlats": lonlats,
                "profile": profile,
                "alternativeidx": alternativeidx,
                "format": format
            }
            
            response = requests.get(
                f"{self.base_url}",
                params=params,
                timeout=30
            )
            response.raise_for_status()
            
            if format == "geojson":
                return response.json()
            else:
                return {"data": response.text}
                
        except requests.exceptions.RequestException as e:
            print(f"BRouter API error: {e}")
            return None
        except Exception as e:
            print(f"Unexpected error in BRouter service: {e}")
            return None
    
    def get_route_with_waypoints(
        self,
        waypoints: List[tuple],
        profile: str = "trekking",
        format: str = "geojson"
    ) -> Optional[Dict]:
        """
        Get route with multiple waypoints
        Splits into segments if server doesn't support many waypoints
        
        Args:
            waypoints: List of (lon, lat) tuples
            profile: Routing profile
            format: Output format
        
        Returns:
            Merged route data or None on error
        """
        try:
            if len(waypoints) < 2:
                raise ValueError("At least 2 waypoints required")
            
            # If only 2 waypoints, use simple route
            if len(waypoints) == 2:
                return self.get_route(
                    start_lon=waypoints[0][0],
                    start_lat=waypoints[0][1],
                    end_lon=waypoints[1][0],
                    end_lat=waypoints[1][1],
                    profile=profile,
                    format=format
                )
            
            # For multiple waypoints, split into segments and merge
            print(f"Processing {len(waypoints)} waypoints as {len(waypoints)-1} segments...")
            
            all_coordinates = []
            total_distance = 0
            total_time = 0
            total_ascend = 0
            total_descend = 0
            
            # Request each segment separately
            for i in range(len(waypoints) - 1):
                start = waypoints[i]
                end = waypoints[i + 1]
                
                segment_route = self.get_route(
                    start_lon=start[0],
                    start_lat=start[1],
                    end_lon=end[0],
                    end_lat=end[1],
                    profile=profile,
                    format=format
                )
                
                if not segment_route or "features" not in segment_route:
                    print(f"Failed to get segment {i+1}/{len(waypoints)-1}")
                    return None
                
                feature = segment_route["features"][0]
                coords = feature["geometry"]["coordinates"]
                props = feature["properties"]
                
                # Add coordinates (skip first point if not first segment to avoid duplicates)
                if i == 0:
                    all_coordinates.extend(coords)
                else:
                    all_coordinates.extend(coords[1:])
                
                # Accumulate metrics
                total_distance += float(props.get("track-length", 0))
                total_time += float(props.get("total-time", 0))
                total_ascend += float(props.get("filtered ascend", 0))
                total_descend += float(props.get("filtered descend", 0))
            
            # Create merged GeoJSON
            merged_route = {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "LineString",
                        "coordinates": all_coordinates
                    },
                    "properties": {
                        "track-length": str(total_distance),
                        "total-time": str(total_time),
                        "filtered ascend": str(total_ascend),
                        "filtered descend": str(total_descend),
                        "segments": len(waypoints) - 1,
                        "waypoints": len(waypoints)
                    }
                }]
            }
            
            return merged_route
                
        except requests.exceptions.RequestException as e:
            print(f"BRouter API error: {e}")
            return None
        except Exception as e:
            print(f"Unexpected error in BRouter service: {e}")
            return None
