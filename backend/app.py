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


@app.route("/api/route-summary", methods=['POST'])
def get_route_summary():
    """
    Generate AI summary of route using Digital Ocean agent
    Request body should contain route metadata
    """
    try:
        data = request.get_json()
        
        # Extract route metadata
        distance_km = data.get('distance_km', 0)
        distance_mi = data.get('distance_mi', 0)
        time_display = data.get('time_display', 'N/A')
        waypoints = data.get('waypoints', [])
        profile = data.get('profile', 'unknown')
        
        # Build prompt for AI agent
        prompt = f"""Generate a brief, engaging 2-3 sentence summary of this road trip route:

Route Details:
- Distance: {distance_km} km ({distance_mi} miles)
- Estimated travel time: {time_display}
- Number of stops: {len(waypoints)}
- Route type: {profile}
- Waypoints: {', '.join([wp.get('label', 'Unknown') for wp in waypoints])}

Write a friendly, informative summary that highlights the journey. Make it sound exciting and helpful for travelers. Please embe"""

        # Call Digital Ocean AI agent
        agent_endpoint = os.getenv("AGENT_ENDPOINT")
        agent_key = os.getenv("AGENT_KEY")
        
        if not agent_endpoint or not agent_key:
            return jsonify({"summary": f"Your {distance_km} km journey takes you through {len(waypoints)} carefully selected points, estimated to take {time_display} of travel time."}), 200
        
        response = requests.post(
            f"{agent_endpoint}/api/v1/chat/completions",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {agent_key}"
            },
            json={
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "stream": False,
                "include_functions_info": False,
                "include_retrieval_info": False,
                "include_guardrails_info": False
            },
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            summary = result.get('choices', [{}])[0].get('message', {}).get('content', '')
            return jsonify({"summary": summary})
        else:
            # Fallback summary if agent fails
            return jsonify({"summary": f"Your {distance_km} km journey takes you through {len(waypoints)} carefully selected points, estimated to take {time_display} of travel time."}), 200
            
    except Exception as e:
        print(f"Error generating route summary: {e}")
        # Return fallback summary on error
        return jsonify({"summary": "Your scenic route is ready for exploration!"}), 200


@app.route("/image-data")
def get_google_streetview():
    """
    Get GoogleStreetView Images for a given coordinate 
    Query params:
        - waypoints: lat, lon 
    """
    lat = request.args.get("lat")
    lon = request.args.get("lon")

    if not lat or not lon:
        return jsonify({"error": "lat and lon required"}), 400

    headings = [0, 90, 180, 270]  # multiple directions
    size = "640x640"
    pitch = 0

    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

    images = [
        {
            "heading": h,
            "image_url": (
                f"https://maps.googleapis.com/maps/api/streetview"
                f"?size={size}&location={lat},{lon}&heading={h}&pitch={pitch}&key={GOOGLE_API_KEY}"
            )
        }
        for h in headings
    ]

    return jsonify({"count": len(images), "images": images})



if __name__ == "__main__":
    app.run(port=5001, debug=True)
