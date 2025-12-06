from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import requests
import os

from services.brouter_service import BRouterService
from services.overpass_service import OverpassService

load_dotenv()

app = Flask(__name__)
CORS(app)  # allow your React frontend to hit this backend

# Initialize services
brouter = BRouterService()
overpass = OverpassService()

MAPILLARY_TOKEN = os.getenv("MAPILLARY_TOKEN")


@app.route("/")
def health():
    return jsonify({"status": "ok", "message": "Route Planning API running"})


@app.route("/api/route", methods=['GET'])
def get_route():
    """
    Get route between points
    Query params:
        - waypoints: comma-separated lon,lat pairs (e.g. "lon1,lat1;lon2,lat2;lon3,lat3")
        - profile: routing profile (default: trekking)
    """
    waypoints_str = request.args.get("waypoints")
    profile = request.args.get("profile", "trekking")
    
    if not waypoints_str:
        return jsonify({"error": "waypoints parameter required"}), 400
    
    try:
        # Parse waypoints from "lon1,lat1;lon2,lat2" format
        waypoint_pairs = waypoints_str.split(";")
        waypoints = []
        
        for pair in waypoint_pairs:
            lon, lat = pair.split(",")
            waypoints.append((float(lon), float(lat)))
        
        if len(waypoints) < 2:
            return jsonify({"error": "At least 2 waypoints required"}), 400
        
        # Get route
        route = brouter.get_route_with_waypoints(waypoints, profile=profile)
        
        if route:
            return jsonify(route)
        else:
            return jsonify({"error": "Failed to generate route"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/api/pois", methods=['GET'])
def get_pois():
    """
    Get points of interest along a route
    Query params:
        - bbox: bounding box as "minLat,minLon,maxLat,maxLon"
        - or coordinates: route coordinates as JSON array
    """
    bbox_str = request.args.get("bbox")
    
    if not bbox_str:
        return jsonify({"error": "bbox parameter required"}), 400
    
    try:
        # Parse bbox
        coords = bbox_str.split(",")
        if len(coords) != 4:
            return jsonify({"error": "bbox must be minLat,minLon,maxLat,maxLon"}), 400
        
        bbox = tuple(float(c) for c in coords)
        
        # Get POIs
        pois = overpass.get_pois_in_bbox(bbox)
        
        if pois:
            return jsonify(pois)
        else:
            return jsonify({"error": "Failed to fetch POIs"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/image-data")
def get_image_data():
    """Legacy Mapillary endpoint"""
    lat = request.args.get("lat")
    lon = request.args.get("lon")

    if not lat or not lon:
        return jsonify({"error": "lat and lon required"}), 400

    try:
        url = (
            "https://graph.mapillary.com/images"
            "?fields=id,thumb_256_url,captured_at,geometry"
            f"&access_token={MAPILLARY_TOKEN}"
            f"&closeto={lon},{lat}"
        )

        response = requests.get(url)
        response.raise_for_status()

        data = response.json()

        return jsonify({
            "count": len(data.get("data", [])),
            "images": data.get("data", [])
        })

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": "Mapillary API error"}), 500


if __name__ == "__main__":
    app.run(port=5001, debug=True)
