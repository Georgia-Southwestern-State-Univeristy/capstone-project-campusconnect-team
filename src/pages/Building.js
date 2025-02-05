import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { searchBuildings } from "../services/firestoreSearchService";

const Building = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [building, setBuilding] = useState(null);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const fetchBuilding = async () => {
            try {
                const docRef = doc(db, "buildings", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setBuilding(docSnap.data());
                } else {
                    setBuilding(null);
                }
            } catch (error) {
                console.error("🔥 Error fetching building:", error);
                setBuilding(null);
            } finally {
                setLoading(false);
            }
        };

        fetchBuilding();
    }, [id]);

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

    if (loading) {
        return <div className="text-white text-center mt-10">Loading building details...</div>;
    }

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
        <div className="min-h-screen">
            <nav className="flex justify-between items-center bg-white py-4 px-10 shadow-md">
                <Link to="/" className="text-2xl font-bold text-gold">
                    Campus <span className="text-navy">Connect</span>
                </Link>

                <form onSubmit={handleSearch} className="relative w-1/3 flex">
                    <input 
                        type="text" 
                        placeholder="🔍 Search for a building or service..." 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none text-black"
                    />
                    <button 
                        type="submit"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gold text-white px-4 py-1 rounded-full hover:bg-[#B48225]"
                    >
                        Search
                    </button>
                </form>

                <div className="space-x-6 text-navy font-medium">
                    <Link to="/" className="hover:underline">Home</Link>
                    <Link to="/about" className="hover:underline">About</Link>
                    <Link to="/services" className="hover:underline">Services</Link>
                    <Link to="/contact" className="hover:underline">Contact</Link>
                </div>
            </nav>

            <div className="flex h-screen">
                <div className="w-1/2 bg-navy text-white p-10">
                    {building?.building_image && (
                        <img src={building.building_image} alt={building.building_name} className="w-full h-64 object-cover rounded-lg mb-4" />
                    )}
                    <h1 className="text-5xl font-bold">{building.building_name}</h1>
                    <p className="text-lg mt-4">{building.description}</p>

                    {/* Additional Details */}
                    <div className="mt-6">
                        {building?.phone_num && (
                            <>
                                <p className="font-bold text-lg">📞 Phone:</p>
                                <ul className="list-disc ml-6">
                                    {Array.isArray(building.phone_num) ? building.phone_num.map((phone, index) => <li key={index}>{phone}</li>) : <li>{building.phone_num}</li>}
                                </ul>
                            </>
                        )}

                        {building?.email && (
                            <>
                                <p className="font-bold text-lg">📧 Email:</p>
                                <ul className="list-disc ml-6">
                                    {Array.isArray(building.email) ? building.email.map((email, index) => <li key={index}>{email}</li>) : <li>{building.email}</li>}
                                </ul>
                            </>
                        )}

                        {building?.operating_hours && (
                            <>
                                <p className="font-bold text-lg">🕒 Operating Hours:</p>
                                <ul className="list-disc ml-6">
                                    {building.operating_hours.map((hour, index) => <li key={index}>{hour}</li>)}
                                </ul>
                            </>
                        )}

                        {building?.services_offered && (
                            <>
                                <p className="font-bold text-lg">🛠️ Services Offered:</p>
                                <ul className="list-disc ml-6">
                                    {building.services_offered.map((service, index) => <li key={index}>{service}</li>)}
                                </ul>
                            </>
                        )}
                    </div>
                </div>

                <div className="w-1/2 bg-gold flex items-center justify-center">
                    {building?.lat && building?.lng ? (
                        <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            style={{ border: 0 }}
                            src={`https://www.google.com/maps/embed/v1/place?q=${building.lat},${building.lng}&key=AIzaSyDzTdK2hUfa9zinFeyS1PJ2bfN8ekxfrbs`}
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <p className="text-center text-black">Map location not available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Building;
