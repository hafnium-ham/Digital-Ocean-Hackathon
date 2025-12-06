from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import requests
import os

load_dotenv()

app = Flask(__name__)
CORS(app)  # allow your React frontend to hit this backend

MAPILLARY_TOKEN = os.getenv("MAPILLARY_TOKEN")


@app.route("/")
def health():
    return "OSM/Mapillary Flask backend running"


@app.route("/image-data")
def get_image_data():
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
