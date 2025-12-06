"""
Test script for Overpass service
Testing POI retrieval near San Francisco: 37.781554, -122.408590
"""
import sys
import os

# Add the parent directory to path to import services
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from services.overpass_service import OverpassService
import json


def test_pois_in_bbox():
    """
    Test Overpass service with San Francisco bounding box
    """
    print("=" * 60)
    print("Testing Overpass Service - POIs in Bounding Box")
    print("=" * 60)
    
    # Initialize service
    overpass = OverpassService()
    print(f"✓ Overpass service initialized")
    print(f"  Base URL: {overpass.base_url}\n")
    
    # Define bounding box around San Francisco downtown
    # Format: (minLat, minLon, maxLat, maxLon)
    # Small area to keep results manageable
    min_lat = 37.778
    min_lon = -122.420
    max_lat = 37.785
    max_lon = -122.405
    
    bbox = (min_lat, min_lon, max_lat, max_lon)
    
    print(f"Bounding Box:")
    print(f"  Southwest: ({min_lat}, {min_lon})")
    print(f"  Northeast: ({max_lat}, {max_lon})")
    print(f"\nRequesting POIs...")
    print("-" * 60)
    
    # Get POIs
    result = overpass.get_pois_in_bbox(bbox)
    
    if result:
        print("✓ POIs retrieved successfully!\n")
        
        print("POI Summary:")
        print("-" * 60)
        print(f"  Total POIs found: {result.get('count', 0)}")
        
        pois = result.get('pois', [])
        
        if pois:
            # Count by type
            type_counts = {}
            for poi in pois:
                poi_type = poi.get('type', 'unknown')
                type_counts[poi_type] = type_counts.get(poi_type, 0) + 1
            
            print(f"\n  POIs by Type:")
            for poi_type, count in sorted(type_counts.items(), key=lambda x: x[1], reverse=True):
                print(f"    {poi_type}: {count}")
            
            print(f"\n  Sample POIs (first 10):")
            print("-" * 60)
            for i, poi in enumerate(pois[:10], 1):
                name = poi.get('name', 'Unnamed')
                poi_type = poi.get('type', 'unknown')
                lat = poi.get('lat', 0)
                lon = poi.get('lon', 0)
                print(f"  {i}. {name}")
                print(f"     Type: {poi_type} | Location: ({lat:.6f}, {lon:.6f})")
                
                # Show tags if available
                tags = poi.get('tags', {})
                if 'amenity' in tags:
                    print(f"     Amenity: {tags['amenity']}")
                if 'tourism' in tags:
                    print(f"     Tourism: {tags['tourism']}")
                print()
            
            print("=" * 60)
            print("✓ Test completed successfully!")
            print("=" * 60)
            
            # Save to file
            output_file = "pois_output.json"
            with open(output_file, 'w') as f:
                json.dump(result, f, indent=2)
            print(f"\n💾 Full POI data saved to: {output_file}")
            
            return True
        else:
            print("\n⚠ No POIs found in the bounding box")
            print("  This could mean:")
            print("    - The area has no mapped POIs")
            print("    - The bounding box is too small")
            print("    - Overpass API is temporarily unavailable")
            return False
    else:
        print("✗ Failed to retrieve POIs")
        print("  This could be due to:")
        print("    - Overpass API being unavailable")
        print("    - Invalid bounding box")
        print("    - Network connectivity issues")
        return False


def test_pois_along_route():
    """
    Test POI retrieval along a route with buffer
    """
    print("\n" + "=" * 60)
    print("Testing Overpass Service - POIs Along Route")
    print("=" * 60)
    
    overpass = OverpassService()
    
    # Sample route coordinates (simplified path through SF)
    route_coords = [
        (37.781554, -122.408590),
        (37.783000, -122.410000),
        (37.785000, -122.412000),
        (37.787000, -122.415000),
        (37.789000, -122.418000),
    ]
    
    print(f"Route with {len(route_coords)} points")
    print(f"Buffer: 100 meters")
    print(f"\nSearching for POIs...")
    print("-" * 60)
    
    result = overpass.get_pois_along_route(route_coords, buffer_meters=100)
    
    if result and result.get('count', 0) > 0:
        count = result.get('count', 0)
        print(f"✓ Found {count} POIs along route!")
        
        pois = result.get('pois', [])
        if pois:
            print(f"\n  Sample POIs (first 5):")
            for i, poi in enumerate(pois[:5], 1):
                name = poi.get('name', 'Unnamed')
                poi_type = poi.get('type', 'unknown')
                print(f"  {i}. {name} ({poi_type})")
        
        return True
    else:
        print("⚠ No POIs found along route or query failed")
        return False


def test_specific_amenity():
    """
    Test searching for specific amenity types
    """
    print("\n" + "=" * 60)
    print("Testing Overpass Service - Specific Amenities")
    print("=" * 60)
    
    overpass = OverpassService()
    
    # Search for cafes in SF downtown
    bbox = (37.778, -122.420, 37.785, -122.405)
    
    print(f"Searching for cafes in downtown SF...")
    print("-" * 60)
    
    # Using custom query for cafes only
    query = f"""
    [out:json][timeout:25];
    (
      node["amenity"="cafe"]({bbox[0]},{bbox[1]},{bbox[2]},{bbox[3]});
      way["amenity"="cafe"]({bbox[0]},{bbox[1]},{bbox[2]},{bbox[3]});
    );
    out center;
    """
    
    result = overpass.query_overpass(query)
    
    if result and result.get('elements'):
        cafes = []
        for element in result['elements']:
            if 'tags' in element and element['tags'].get('amenity') == 'cafe':
                cafe_name = element['tags'].get('name', 'Unnamed cafe')
                lat = element.get('lat') or element.get('center', {}).get('lat', 0)
                lon = element.get('lon') or element.get('center', {}).get('lon', 0)
                cafes.append({'name': cafe_name, 'lat': lat, 'lon': lon})
        
        print(f"✓ Found {len(cafes)} cafes!")
        
        if cafes:
            print(f"\n  Cafes:")
            for i, cafe in enumerate(cafes[:5], 1):
                print(f"  {i}. {cafe['name']}")
                print(f"     Location: ({cafe['lat']:.6f}, {cafe['lon']:.6f})")
        
        return len(cafes) > 0
    else:
        print("⚠ No cafes found or query failed")
        return False


if __name__ == "__main__":
    print("\n🗺️  Overpass Service Test Suite\n")
    
    # Test 1: POIs in bounding box
    test1_success = test_pois_in_bbox()
    
    # Test 2: POIs along route
    test2_success = test_pois_along_route()
    
    # Test 3: Specific amenity search
    test3_success = test_specific_amenity()
    
    # Summary
    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)
    print(f"Bbox POI test: {'✓ PASS' if test1_success else '✗ FAIL'}")
    print(f"Route POI test: {'✓ PASS' if test2_success else '✗ FAIL'}")
    print(f"Specific amenity test: {'✓ PASS' if test3_success else '✗ FAIL'}")
    print("=" * 60)
    
    # Exit with appropriate code
    all_passed = test1_success and test2_success and test3_success
    sys.exit(0 if all_passed else 1)
