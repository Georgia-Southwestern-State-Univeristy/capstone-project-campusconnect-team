import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { searchBuildings } from "../services/firestoreSearchService";
import Chatbot from "./chatbox";

const Welcome = () => {
    // State to store the search query input
    const [query, setQuery] = useState("");
    // State to store search results from Firestore
    const [results, setResults] = useState([]);
    // Hook for programmatic navigation
    const navigate = useNavigate();

    // Function to handle search submission
    const handleSearch = async (event) => {
        event.preventDefault();// Prevents default form submission behavior
        // If the search query is empty, do nothing
        if (query.trim() === "") return;
        //Calls Firestore service to fetch matching buildings
        const buildings = await searchBuildings(query);
        setResults(buildings);// Updates state with search results

        // If only one result, navigate immediately
        if (buildings.length === 1) {
            navigate(`/building/${buildings[0].id}`);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-between bg-navy text-white px-4">
            {/* Centered welcome message */}
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
                    {/* Input field for search */}
                    <input 
                        type="text" 
                        placeholder="🔍 Search for a building or service..." 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)} // Updates query state
                        className="flex-grow px-4 py-2 text-black outline-none rounded-full"
                    />
                    {/* Search button */}
                    <button 
                        type="submit"
                        className="bg-gold text-white px-6 py-2 font-semibold hover:bg-[#B48225] rounded-full"
                    >
                        Search
                    </button>
                </form>

                {/* DISPLAY SEARCH RESULTS BELOW - Not working****/}
                {results.length > 1 && (
                    <div className="mt-4 w-full max-w-lg bg-white text-black rounded-lg shadow-lg p-3">
                        <p className="text-center font-semibold text-gray-700">Select a location:</p>
                        <ul>
                            {results.map((building) => (
                                <li key={building.id} className="cursor-pointer px-4 py-2 hover:bg-gray-200 rounded">
                                    {/* Clickable search results redirecting to building pages */}
                                <Link to={`/building/${building.id}`}> {/*allows client-side routing w/o page reload + adds building id to url */}
                                    {building.building_name}
                                    {/*EX: <a href="/building/library123">University Library</a>*/}
                                </Link>
                            </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* RECOMMENDATION BUBBLES (Only show when no search query is entered)*/}
                {results.length === 0 && query === "" && (
                    <div className="mt-6 flex flex-wrap justify-center gap-4">
                        {/* Predefined building/service names for quick selection */}
                        {["Library", "Gym", "Cafe", "Public Safety"].map((name) => (
                            <button
                                key={name}
                                onClick={() => setQuery(name.toLowerCase())}// Autofill query on click
                                className="px-5 py-2 bg-gold text-white rounded-full shadow-lg hover:bg-[#B48225]"
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            {/* Include the Chatbot component */}
            <Chatbot />
        </div>
    );
};

export default Welcome;
