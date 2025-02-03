import React, { useState } from "react";
import { Link } from "react-router-dom";
import { searchBuildings } from "../services/firestoreSearchService";

const Welcome = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    // Handles search logic
    const handleSearch = async () => {
        if (query.trim() === "") return;
        const buildings = await searchBuildings(query);
        setResults(buildings);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-between bg-navy text-white px-4">
            
            {/* Main Content */}
            <div className="flex-grow flex flex-col items-center justify-center">
                {/* Title */}
                <h1 className="text-5xl font-extrabold">Welcome to</h1>
                <h2 className="text-6xl font-extrabold text-gold mt-2">CampusConnect!</h2>
                <p className="mt-4 text-lg text-gray-300 text-center px-6">
                    Find campus buildings quickly!
                </p>

                {/* Search Bar */}
                <div className="mt-6 w-full max-w-lg flex items-center bg-white rounded-full shadow-md overflow-hidden">
                    <input 
                        type="text" 
                        placeholder="🔍 Search for a building..." 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-grow px-4 py-2 text-black outline-none"
                    />
                    <button 
                        onClick={handleSearch} 
                        className="bg-gold text-white px-6 py-2 font-semibold hover:bg-[#B48225]"
                    >
                        Search
                    </button>
                </div>

                {/* Display Recommendations if No Search */}
                {results.length === 0 && query === "" && (
                    <div className="mt-6 flex flex-wrap justify-center gap-4">
                        {["Library", "Gym", "Cafe", "Public Safety"].map((name) => (
                            <button 
                                key={name}
                                onClick={() => setQuery(name.toLowerCase())}
                                className="px-5 py-2 bg-gold text-white rounded-full shadow-lg hover:bg-[#B48225]"
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                )}

                {/* Display Search Results */}
                <div className="mt-4">
                    {results.length > 0 ? (
                        results.map((building) => (
                            <Link
                                key={building.id}
                                to={`/building/${building.id}`}
                                className="block mt-2 text-lg text-gold hover:underline"
                            >
                                {building.building_name}
                            </Link>
                        ))
                    ) : (
                        query && <p className="text-gray-400 mt-2">No results found.</p>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer className="w-full bg-gold py-4">
                <div className="flex justify-center space-x-6 text-white text-sm">
                    <Link to="/contact" className="hover:underline">Contact Us</Link>
                    <Link to="/privacy" className="hover:underline">Privacy</Link>
                    <Link to="/about" className="hover:underline">About</Link>
                    <Link to="/help" className="hover:underline">Help</Link>
                </div>
            </footer>
        </div>
    );
};

export default Welcome;
