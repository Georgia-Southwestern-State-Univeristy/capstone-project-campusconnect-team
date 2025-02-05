import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { searchBuildings } from "../services/firestoreSearchService";

const Building = () => {
    const { id } = useParams(); // Get building ID from URL
    const navigate = useNavigate(); // Hook for navigation

    const [building, setBuilding] = useState(null); // State to store building data
    const [loading, setLoading] = useState(true); // State to manage loading status
    const [query, setQuery] = useState(""); // State to store search query
    const [searchResults, setSearchResults] = useState([]); // State to store search results
    const [showDropdown, setShowDropdown] = useState(false); // State to manage dropdown visibility

    useEffect(() => {
        const fetchBuilding = async () => {
            try {
                const docRef = doc(db, "buildings", id); // Reference to the building document
                const docSnap = await getDoc(docRef); // Fetch the document

                if (docSnap.exists()) {
                    console.log("✅ Fetched Building Data:", docSnap.data());
                    setBuilding(docSnap.data()); // Set building data if document exists
                } else {
                    console.error("❌ No such building found!");
                    setBuilding(null); // Set building to null if document does not exist
                }
            } catch (error) {
                console.error("🔥 Error fetching building:", error);
                setBuilding(null); // Set building to null if there is an error
            } finally {
                setLoading(false); // Ensure loading state is set to false
            }
        };

        fetchBuilding(); // Call the function to fetch building data
    }, [id]); // Dependency array to re-run effect when `id` changes

    // Handle search submission
    const handleSearch = async (event) => {
        event.preventDefault();
        if (query.trim() === "") return;

        const results = await searchBuildings(query);
        setSearchResults(results);
        setShowDropdown(true);

        if (results.length === 1) {
            navigate(`/building/${results[0].id}`);
        }
    };

    // If still loading, show a loading message
    if (loading) {
        return <div className="text-white text-center mt-10">Loading building details...</div>;
    }

    // If no building found, show an error message
    if (!building) {
        return (
            <div className="text-white text-center mt-10">
                <h2 className="text-3xl font-bold">Building Not Found</h2>
                <p>Sorry, the requested building does not exist.</p>
                <Link to="/" className="text-gold underline mt-4 block">Return to Home</Link>
            </div>
        );
    }

    return (
        <div className="flex h-screen">
            {/* Left Side: Building Details */}
            <div className="w-1/2 bg-navy text-white p-10">
                <h1 className="text-5xl font-bold">{building.building_name || "Unknown Building"}</h1> {/* Display building name */}
                <p className="text-lg mt-4">{building.description || "No description available."}</p> {/* Display building description */}

                {/* Additional Details */}
                <div className="mt-6">
                    {/* Phone Numbers */}
                    {building?.phone_num ? (
                        <>
                            <p><strong>📞 Phone:</strong></p>
                            <ul className="list-disc ml-6">
                                {Array.isArray(building.phone_num)
                                    ? building.phone_num.map((phone, index) => <li key={index}>{phone}</li>) // List each phone number if it's an array
                                    : <li>{building.phone_num}</li>} // Display single phone number if it's not an array
                            </ul>
                        </>
                    ) : (
                        <p><strong>📞 Phone:</strong> N/A</p> // Display N/A if no phone number is available
                    )}

                    {/* Emails */}
                    {building?.email ? (
                        <>
                            <p><strong>📧 Email:</strong></p>
                            <ul className="list-disc ml-6">
                                {Array.isArray(building.email)
                                    ? building.email.map((email, index) => <li key={index}>{email}</li>) // List each email if it's an array
                                    : <li>{building.email}</li>} // Display single email if it's not an array
                            </ul>
                        </>
                    ) : (
                        <p><strong>📧 Email:</strong> N/A</p> // Display N/A if no email is available
                    )}

                    {/* Operating Hours */}
                    <p className="mt-4"><strong>🕒 Operating Hours:</strong></p>
                    <ul className="list-disc ml-6">
                        {building?.operating_hours?.length > 0 ? (
                            building.operating_hours.map((hour, index) => (
                                <li key={index}>{hour}</li> // List each operating hour
                            ))
                        ) : (
                            <li>No hours available</li> // Display message if no hours are available
                        )}
                    </ul>

                    {/* Services Offered */}
                    <p className="mt-4"><strong>🛠️ Services Offered:</strong></p>
                    <ul className="list-disc ml-6">
                        {building?.services_offered?.length > 0 ? (
                            building.services_offered.map((service, index) => (
                                <li key={index}>{service}</li> // List each service offered
                            ))
                        ) : (
                            <li>No services available</li> // Display message if no services are available
                        )}
                    </ul>
                </div>
            </div>

            {/* Right Side: Google Maps Embed */}
            <div className="w-1/2 bg-gold flex items-center justify-center">
                {building?.lat && building?.lng ? (
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