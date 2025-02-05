import React, { useState } from "react";
import { Link } from "react-router-dom";
import { searchBuildings } from "../services/firestoreSearchService";

const Welcome = () => {
    const [query, setQuery] = useState(""); // State to store the search query
    const [results, setResults] = useState([]); // State to store search results

    const handleSearch = async (event) => {
        event.preventDefault();
        if (query.trim() === "") return;

        const results = await searchBuildings(query);
        setResults(results);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-navy">
            <h1 className="text-5xl font-bold text-white mb-8">Welcome to CampusConnect</h1>
            <form onSubmit={handleSearch} className="flex w-full max-w-md">
                <input
                    type="text" // Input field for search query
                    placeholder="🔍 Search for a building or service..." // Placeholder text
                    value={query} // Bind input value to query state
                    onChange={(e) => setQuery(e.target.value)} // Update query state on input change
                    className="flex-grow px-4 py-2 text-black outline-none" // Styling for input field
                />
                <button
                    type="submit" // Submit button for search form
                    className="bg-gold text-white px-6 py-2 font-semibold hover:bg-[#B48225]" // Styling for button
                >
                    Search
                </button>
            </form>

            {/* Suggested Searches */}
            {results.length === 0 && query === "" && (
                <div className="mt-6 flex flex-wrap justify-center gap-4">
                    {["Library", "Gym", "Cafe", "Public Safety"].map((name) => (
                        <button
                            key={name} // Unique key for each button
                            onClick={() => setQuery(name.toLowerCase())} // Set query state to suggested search
                            className="px-5 py-2 bg-gold text-white rounded-full shadow-lg hover:bg-[#B48225]" // Styling for button
                        >
                            {name}
                        </button>
                    ))}
                </div>
            )}

            {/* Display Search Results */}
            <div className="mt-4">
                {results.length > 1 ? (
                    <div className="text-white">
                        <p className="text-lg text-gray-300 mb-2">Select a location:</p> {/* Prompt to select a location */}
                        {results.map((building) => (
                            <Link
                                key={building.id} // Unique key for each result
                                to={`/building/${building.id}`} // Link to building page
                                className="block py-2 px-4 bg-gray-800 rounded mb-2 hover:bg-gray-700" // Styling for link
                            >
                                {building.name}
                            </Link>
                        ))}
                    </div>
                ) : (
                    results.length === 1 && (
                        <div className="text-white">
                            <p className="text-lg text-gray-300 mb-2">Redirecting to building...</p>
                            <Link to={`/building/${results[0].id}`} className="block py-2 px-4 bg-gray-800 rounded mb-2 hover:bg-gray-700">
                                {results[0].name}
                            </Link>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Welcome;