import { useState } from "react";

type ImageData = {
    heading: number;
    image_url: string;
};

export default function StreetViewImages() {
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
            fetch(`http://localhost:5001/image-data?lat=${lat}&lon=${lon}`)
                .then((res) => res.json())
                .then((data) => setImages(data.images))
                .catch(console.error);
        } catch (err: any) {
            setError(err.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-4 border rounded-md w-full max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-2">Street Images</h2>
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
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {images.map((img) => (
                    <img key={img.heading} src={img.image_url} alt={`Heading ${img.heading}`} width={200} />
                ))}
            </div>
        </div>
    );
}
