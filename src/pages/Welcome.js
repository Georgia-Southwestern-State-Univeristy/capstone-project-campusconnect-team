import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { searchBuildings } from "../services/firestoreSearchService";

const Welcome = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    const handleSearch = async (event) => {
        event.preventDefault();
        if (query.trim() === "") return;

        const buildings = await searchBuildings(query);
        setResults(buildings);

        if (buildings.length === 1) {
            navigate(`/building/${buildings[0].id}`);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-between bg-navy text-white px-4">
            <div className="flex-grow flex flex-col items-center justify-center">
                <h1 className="text-5xl font-extrabold">Welcome to</h1>
                <h2 className="text-6xl font-extrabold text-gold mt-2">CampusConnect!</h2>
                <p className="mt-4 text-lg text-gray-300 text-center px-6">
                    Find campus buildings quickly!
                </p>

                {/* SEARCH BAR */}
                <form 
                    onSubmit={handleSearch} 
                    className="mt-6 w-full max-w-lg flex items-center bg-white rounded-full shadow-md overflow-hidden"
                >
                    <input 
                        type="text" 
                        placeholder="🔍 Search for a building or service..." 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-grow px-4 py-2 text-black outline-none rounded-full"
                    />
                    <button 
                        type="submit"
                        className="bg-gold text-white px-6 py-2 font-semibold hover:bg-[#B48225] rounded-full"
                    >
                        Search
                    </button>
                </form>

                {/* RECOMMENDATION BUBBLES */}
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
            </div>
        </div>
    );
};

export default Welcome;
