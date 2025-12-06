from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import requests
import os

load_dotenv()

app = Flask(__name__)
CORS(app) 


@app.route("/")
def health():
    return "Flask backend running"


@app.route("/image-data")

@app.route("/image-data")
def get_google_streetview():
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
