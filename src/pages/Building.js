import React from "react";
import { useParams } from "react-router-dom";

const Building = () => {
    const { id } = useParams(); // Get building name from URL

    return (
        <div className="flex h-screen">
            {/* Left Side: Building Info */}
            <div className="w-1/2 bg-navy text-white p-10">
                <h1 className="text-5xl font-bold">{id} Building</h1>
                <p className="text-lg mt-4">Detailed description of {id}.</p>
            </div>

            {/* Right Side: Google Map */}
            <div className="w-1/2 bg-gold flex items-center justify-center">
                <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps/embed/v1/place?q=${id}&key=YOUR_GOOGLE_MAPS_API_KEY`}
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
};

export default Building;
