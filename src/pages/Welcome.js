import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { searchBuildings } from "../services/firestoreSearchService";

const Welcome = () => {
    // State to store the search query input
    const [query, setQuery] = useState("");
    // State to store search results from Firestore
    const [results, setResults] = useState([]);

    const [aiResponse, setAiResponse] = useState(""); // Store AI response
    const [loading, setLoading] = useState(false);
    const [isLocationQuery, setIsLocationQuery] = useState(false); // New state for location query

    // Hook for programmatic navigation
    const navigate = useNavigate();

    // Function to handle search submission
    const handleSearch = async (event) => {
        event.preventDefault();// Prevents default form submission behavior
        // If the search query is empty, do nothing
        if (query.trim() === "") return;

        setLoading(true);
        setAiResponse(""); // Clear previous AI response

        //Calls Firestore service to fetch matching buildings
        const buildings = await searchBuildings(query);
        setLoading(false);
        setResults(buildings);// Updates state with search results

        const aiGeneratedResponse = buildings.find((b) => b.id === "ai-response");

        if (aiGeneratedResponse) {
            setAiResponse(aiGeneratedResponse.relevant_info);
            setIsLocationQuery(false); // AI response means it's not a location query
            return; // Don't navigate if it's an AI-generated answer
        }

        if (buildings.length > 0) {
            setIsLocationQuery(buildings[0].isLocationQuery); // Set location query flag
        }

        // If only one result, navigate immediately
        if (buildings.length === 1 && buildings[0].id !== "ai-response") {
            if (buildings[0].isLocationQuery) {
                setIsLocationQuery(true); // Ensure dropdown is shown for locations
            } else {
                navigate(`/building/${buildings[0].id}`);
            }
        }
    };

    return (
        <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col items-center justify-between bg-navy text-white px-4 py-8 sm:px-8">
            {/* Top-right links for About and Contact */}
            <div className="absolute top-5 right-8 z-50 space-x-8">
            <Link
                to="/about"
                className="text-gold font-extrabold text-xl tracking-wide hover:underline hover:text-white transition duration-200"
            >
                About
            </Link>
            <Link
                to="/contact"
                className="text-gold font-extrabold text-xl tracking-wide hover:underline hover:text-white transition duration-200"
            >
                Contact
            </Link>
            </div>


            {/* Centered welcome message */}
            <div className="flex-grow flex flex-col items-center justify-center w-full text-center">
                <h1 className="text-4xl sm:text-5xl font-extrabold">Welcome to</h1>
                <h2 className="text-5xl sm:text-6xl font-extrabold text-gold mt-2 break-words">CampusConnect!</h2>
                <p className="mt-4 text-base sm:text-lg text-gray-300 px-4 sm:px-6 max-w-md">
                    Find campus buildings quickly!
                </p>

                {/* SEARCH BAR */}
                <form 
                    onSubmit={handleSearch} 
                    className="mt-6 w-full max-w-lg flex flex-col sm:flex-row items-stretch bg-white rounded-xl overflow-hidden shadow-md"
                >
                    {/* Input field for search */}
                    <input 
                        type="text" 
                        placeholder="🔍 Search for a building or service..." 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)} // Updates query state
                        className="flex-grow px-4 py-2 text-black outline-none bg-white"
                    />
                    {/* Search button */}
                    <button 
                        type="submit"
                        className="bg-gold text-white px-6 py-2 font-semibold hover:bg-[#B48225]"
                    >
                        Search
                    </button>
                </form>

                {/* Display AI-generated response if available */}
                {aiResponse && (
                <div className="mt-4 w-full max-w-lg bg-white text-black rounded-lg shadow-lg p-3">
                    <p className="text-center font-semibold text-gray-700">AI Response:</p>
                    <p className="text-center text-gray-900">{aiResponse}</p>
                </div>
                )}

                {/* Loading message */}
                {loading && <div className="mt-4 text-white">Loading results...</div>}

                {/* DISPLAY SEARCH RESULTS BELOW -  working****/}
                {results.length > 0 && !loading && !aiResponse && (
                    <div className="mt-4 w-full max-w-xl bg-white text-black rounded-lg shadow-lg p-3">
                        <p className="text-center font-semibold text-gray-700">Select a location:</p>
                        <ul>
                            {results.map((b) => (
                                <li key={b.id} className="cursor-pointer px-4 py-2 hover:bg-gray-200 rounded">
                                    {/* Clickable search results redirecting to building pages */}
                                <Link to={`/building/${b.id}`}> {/*allows client-side routing w/o page reload + adds building id to url */}
                                    {b.building_name}
                                    {/*EX: <a href="/building/library123">University Library</a>*/}
                                    {/* Displaying the derived answer */}
                                    {b.relevant_info && (
                                        <p className="mt-2 text-sm text-gray-600">{b.relevant_info}</p>
                                    )}
                                </Link>
                            </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* RECOMMENDATION BUBBLES (Only show when no search query is entered)*/}
                {results.length === 0 && query === "" && (
                    <div className="mt-6 flex flex-wrap justify-center gap-3 sm:gap-4 w-full px-2 sm:px-0">
                        {/* Predefined building/service names for quick selection */}
                        {["Library", "Gym", "Cafe", "Public Safety"].map((name) => (
                            <button
                                key={name}
                                onClick={async () => {
                                    setQuery(name.toLowerCase());
                                    const results = await searchBuildings(name.toLowerCase());
                                
                                    const aiGeneratedResponse = results.find((b) => b.id === "ai-response");
                                    if (aiGeneratedResponse) {
                                        setAiResponse(aiGeneratedResponse.relevant_info);
                                        setResults([]);
                                        return;
                                    }
                                
                                    if (results.length === 1) {
                                        navigate(`/building/${results[0].id}`);
                                    } else if (results.length > 1) {
                                        setResults(results);
                                    }
                                }}
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
