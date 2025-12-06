import { useState } from "react";
import StreetViewImages from "./StreetViewImages";

interface ImageData {
    id: string;
    thumb_url: string;
    captured_at: string;
}

export default function Images() {
    const [lat, setLat] = useState("");
    const [lon, setLon] = useState("");
    const [images, setImages] = useState<ImageData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchImages = async () => {
        if (!lat || !lon) return;

        setLoading(true);
        setError("");
        try {
            console.log("Fetching images for:", { lat, lon });

            const res = await fetch(`http://localhost:5001/image-data?lat=${lat}&lon=${lon}`);
            if (!res.ok) throw new Error("Failed to fetch image data");
            const data = await res.json();
            setImages(data.images);
            console.log(data.images);
        } catch (err: any) {
            setError(err.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 border rounded-md w-full max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-2">Mapillary Street Images</h2>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Latitude"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="border p-1 flex-1"
                />
                <input
                    type="text"
                    placeholder="Longitude"
                    value={lon}
                    onChange={(e) => setLon(e.target.value)}
                    className="border p-1 flex-1"
                />
                <button
                    onClick={fetchImages}
                    className="bg-blue-500 text-white px-3 rounded"
                >
                    Fetch
                </button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {images.map((img) => (
                <StreetViewImages />

            ))}
        </div>
    );
}
