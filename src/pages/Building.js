import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";

const Building = () => {
    const { id } = useParams(); // Get building ID from URL
    const [building, setBuilding] = useState(null); // State to store building data

    useEffect(() => {
        const fetchBuilding = async () => {
            const docRef = doc(db, "buildings", id); // Reference to the building document
            const docSnap = await getDoc(docRef); // Fetch the document

            if (docSnap.exists()) {
                setBuilding(docSnap.data()); // Set building data if document exists
            } else {
                console.error("No such building found!"); // Log error if document does not exist
            }
        };

        fetchBuilding(); // Call the function to fetch building data
    }, [id]); // Dependency array to re-run effect when `id` changes

    if (!building) {
        return <div className="text-white text-center mt-10">Loading building details...</div>; // Show loading message if building data is not yet available
    }

    return (
        <div className="flex h-screen">
            {/* Left Side: Building Details */}
            <div className="w-1/2 bg-navy text-white p-10">
                <h1 className="text-5xl font-bold">{building.building_name || "Unknown Building"}</h1> {/* Display building name */}
                <p className="text-lg mt-4">{building.description || "No description available."}</p> {/* Display building description */}

                {/* Additional Details */}
                <div className="mt-6">
                    <p><strong>📞 Phone:</strong> {building.phone_number || "N/A"}</p> {/* Display phone number */}
                    <p><strong>📧 Email:</strong> {building.email || "N/A"}</p> {/* Display email */}
                    <p><strong>🕒 Operating Hours:</strong></p> {/* Display operating hours */}
                    <ul className="list-disc ml-6">
                        {building.operating_hours?.length > 0 ? (
                            building.operating_hours.map((hour, index) => (
                                <li key={index}>{hour}</li> // List each operating hour
                            ))
                        ) : (
                            <li>No hours available</li> // Show message if no hours are available
                        )}
                    </ul>
                </div>
            </div>

            {/* Right Side: Google Maps Embed */}
            <div className="w-1/2 bg-gold flex items-center justify-center">
                {building.lat && building.lng ? (
                    <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src={`https://www.google.com/maps/embed/v1/place?q=${building.lat},${building.lng}&key=AIzaSyDzTdK2hUfa9zinFeyS1PJ2bfN8ekxfrbs`}
                        allowFullScreen
                    ></iframe> // Embed Google Map if latitude and longitude are available
                ) : (
                    <p className="text-center text-black">Map location not available</p> // Show message if map location is not available
                )}
            </div>
        </div>
    );
};

export default Building;