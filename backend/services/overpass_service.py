"""
Overpass API service for finding points of interest
Documentation: https://wiki.openstreetmap.org/wiki/Overpass_API
"""
import requests
from typing import Dict, List, Optional


class OverpassService:
    """
    Service for querying OpenStreetMap data via Overpass API
    """
    
    def __init__(self, base_url: str = "https://overpass-api.de/api/interpreter"):
        """
        Initialize Overpass API service
        
        Args:
            base_url: Base URL for Overpass API
        """
        self.base_url = base_url
        
    def build_poi_query(
        self,
        bbox: tuple,
        amenity_types: Optional[List[str]] = None,
        tourism_types: Optional[List[str]] = None,
        natural_types: Optional[List[str]] = None
    ) -> str:
        """
        Build Overpass QL query for POIs
        
        Args:
            bbox: Bounding box (min_lat, min_lon, max_lat, max_lon)
            amenity_types: List of amenity types to search for
            tourism_types: List of tourism types to search for
            natural_types: List of natural feature types to search for
        
        Returns:
            Overpass QL query string
        """
        min_lat, min_lon, max_lat, max_lon = bbox
        bbox_str = f"{min_lat},{min_lon},{max_lat},{max_lon}"
        
        # Default interesting POI types
        if not amenity_types:
            amenity_types = [
                "restaurant", "cafe", "pub", "bar",
                "viewpoint", "toilets", "parking",
                "bicycle_parking", "drinking_water"
            ]
        
        if not tourism_types:
            tourism_types = [
                "viewpoint", "attraction", "museum",
                "artwork", "information", "park"
            ]
        
        if not natural_types:
            natural_types = [
                "peak", "water", "beach", "wood"
            ]
        
        # Build query parts
        query_parts = []
        
        # Amenities
        for amenity in amenity_types:
            query_parts.append(f'node["amenity"="{amenity}"]({bbox_str});')
        
        # Tourism
        for tourism in tourism_types:
            query_parts.append(f'node["tourism"="{tourism}"]({bbox_str});')
        
        # Natural features
        for natural in natural_types:
            query_parts.append(f'node["natural"="{natural}"]({bbox_str});')
        
        # Combine into full query
        query = f"""
        [out:json][timeout:25];
        (
            {chr(10).join(query_parts)}
        );
        out body;
        >;
        out skel qt;
        """
        
        return query
    
    def get_pois_in_bbox(
        self,
        bbox: tuple,
        amenity_types: Optional[List[str]] = None,
        tourism_types: Optional[List[str]] = None,
        natural_types: Optional[List[str]] = None
    ) -> Optional[Dict]:
        """
        Get POIs within a bounding box
        
        Args:
            bbox: Bounding box (min_lat, min_lon, max_lat, max_lon)
            amenity_types: List of amenity types
            tourism_types: List of tourism types
            natural_types: List of natural feature types
        
        Returns:
            POI data or None on error
        """
        try:
            query = self.build_poi_query(
                bbox,
                amenity_types,
                tourism_types,
                natural_types
            )
            
            response = requests.post(
                self.base_url,
                data={"data": query},
                timeout=30
            )
            response.raise_for_status()
            
            data = response.json()
            
            # Filter and format the response
            elements = data.get("elements", [])
            pois = []
            
            for element in elements:
                if element.get("type") == "node" and "tags" in element:
                    poi = {
                        "id": element.get("id"),
                        "lat": element.get("lat"),
                        "lon": element.get("lon"),
                        "tags": element.get("tags", {}),
                        "name": element.get("tags", {}).get("name", "Unknown"),
                        "type": self._get_poi_type(element.get("tags", {}))
                    }
                    pois.append(poi)
            
            return {
                "count": len(pois),
                "pois": pois
            }
            
        except requests.exceptions.RequestException as e:
            print(f"Overpass API error: {e}")
            return None
        except Exception as e:
            print(f"Unexpected error in Overpass service: {e}")
            return None
    
    def get_pois_along_route(
        self,
        route_coords: List[tuple],
        buffer_km: float = 0.5,
        amenity_types: Optional[List[str]] = None,
        tourism_types: Optional[List[str]] = None,
        natural_types: Optional[List[str]] = None
    ) -> Optional[Dict]:
        """
        Get POIs along a route with buffer
        
        Args:
            route_coords: List of (lat, lon) coordinate tuples
            buffer_km: Buffer distance in kilometers
            amenity_types: List of amenity types
            tourism_types: List of tourism types
            natural_types: List of natural feature types
        
        Returns:
            POI data or None on error
        """
        if not route_coords:
            return {"count": 0, "pois": []}
        
        # Calculate bounding box from route coordinates
        lats = [coord[0] for coord in route_coords]
        lons = [coord[1] for coord in route_coords]
        
        # Add buffer (rough approximation: 1 degree ≈ 111 km)
        buffer_degrees = buffer_km / 111.0
        
        min_lat = min(lats) - buffer_degrees
        max_lat = max(lats) + buffer_degrees
        min_lon = min(lons) - buffer_degrees
        max_lon = max(lons) + buffer_degrees
        
        bbox = (min_lat, min_lon, max_lat, max_lon)
        
        return self.get_pois_in_bbox(
            bbox,
            amenity_types,
            tourism_types,
            natural_types
        )
    
    def _get_poi_type(self, tags: Dict) -> str:
        """
        Determine POI type from tags
        
        Args:
            tags: OSM tags dictionary
        
        Returns:
            POI type string
        """
        if "amenity" in tags:
            return tags["amenity"]
        elif "tourism" in tags:
            return tags["tourism"]
        elif "natural" in tags:
            return tags["natural"]
        else:
            return "unknown"
