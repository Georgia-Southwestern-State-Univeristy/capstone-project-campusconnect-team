
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  searchBuildings,
  searchAcademicData,
  generateAIExplanation
} from "../services/firestoreSearchService";


const Welcome = () => { // This is the main welcome page for the app
  // State variables to manage search query, results, AI response, and loading state
  const [query, setQuery] = useState("");//
  const [results, setResults] = useState([]);
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAcademicQuery, setIsAcademicQuery] = useState(false);

  const navigate = useNavigate(); // useNavigate hook from react-router-dom for navigation
  // Function to handle search submission

  const handleSearch = async (event) => {
    event.preventDefault();
    if (query.trim() === "") return;

    setLoading(true);
    setAiResponse("");
    setResults([]);

    const academicResults = await searchAcademicData(query);// Search for academic events using the query
    // If academic results are found, set them and generate an AI explanation
    if (academicResults.length > 0) {
      setResults(academicResults);
      setIsAcademicQuery(true);

      const fact = `${academicResults[0].title} on ${academicResults[0].date}`;
      const explanation = await generateAIExplanation(fact, "academic");
      setAiResponse(explanation);
      setLoading(false);
      return;
    }

    const buildingsResults = await searchBuildings(query);    // Search for buildings using the query
    setResults(buildingsResults);
    setIsAcademicQuery(false);

    const aiGenerated = buildingsResults.find((b) => b.id === "ai-response");

    if (aiGenerated) {  // If AI-generated response is found, set it as the AI response
      setAiResponse(aiGenerated.relevant_info);
    } else if (buildingsResults.length > 0) {
      const fact = buildingsResults[0].relevant_info || "";
      const explanation = await generateAIExplanation(fact, "building");
      setAiResponse(explanation);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col items-center justify-between bg-navy text-white px-4 py-8 sm:px-8"> ?


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

      {/* Main content area */}
      <div className="flex-grow flex flex-col items-center justify-center"> 
        <h1 className="text-5xl font-extrabold">Welcome to</h1>
        <h2 className="text-6xl font-extrabold text-gold mt-2">CampusConnect!</h2>
        <p className="mt-4 text-lg text-gray-300 text-center px-6">
          Find campus buildings or academic events quickly!
        </p>
        
        <form onSubmit={handleSearch} className="mt-6 w-full max-w-lg flex items-center bg-white rounded-full shadow-md overflow-hidden"> 
          <input
            type="text"
            placeholder="🔍 Search for a building or event..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow px-4 py-2 text-black outline-none rounded-full"
          />
          <button type="submit" className="bg-gold text-white px-6 py-2 font-semibold hover:bg-[#B48225] rounded-full">
            Search
          </button>
        </form>

        {aiResponse && ( // If AI response is available, display it
          <div className="mt-4 w-full max-w-lg bg-white text-black rounded-lg shadow-lg p-3">
            <p className="text-center font-semibold text-gray-700">Gemini Explanation:</p>
            <p className="text-center text-gray-900">{aiResponse}</p>
          </div>
        )}

        {loading && <div className="mt-4 text-white">Loading results...</div>}


        {isAcademicQuery && results.length > 0 && !loading && ( // If academic query is true and results are available, display them
          <div className="mt-4 w-full max-w-xl bg-white text-black rounded-lg shadow-lg p-3">
            <p className="text-center font-semibold text-gray-700">Academic Events:</p>
            <ul>
              {results.map((event, index) => (
                <li key={index} className="cursor-pointer px-4 py-2 hover:bg-gray-200 rounded">
                  <p className="font-bold">{event.title}</p>
                  <p className="text-sm">{event.date}</p>
                  
                </li>
              ))}
            </ul>
          </div>
        )}


        {!isAcademicQuery && results.length > 0 && !loading && results[0].id !== "ai-response" && ( // If not an academic query and results are available, display building locations
          <div className="mt-4 w-full max-w-xl bg-white text-black rounded-lg shadow-lg p-3"> 
            <p className="text-center font-semibold text-gray-700">Select a location:</p>
            <ul>
              {results.map((b) => (
                <li key={b.id} className="cursor-pointer px-4 py-2 hover:bg-gray-200 rounded">
                  <Link to={`/building/${b.id}`}>
                    {b.building_name}
                    {b.relevant_info && <p className="mt-2 text-sm text-gray-600 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: b.relevant_info}}></p>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}


        {results.length === 0 && query === "" && ( // If no results and no query, display default buttons
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {["Library", "Gym", "Cafe", "Public Safety"].map((name) => (
              <button
                key={name}
                onClick={async () => {
                  setQuery(name.toLowerCase());
                  const searchResults = await searchBuildings(name.toLowerCase());
                  setResults(searchResults);
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

export default Welcome; // This is the main welcome page for the app. It includes a search bar, AI response, and displays results based on user input.
// The page is styled using Tailwind CSS and includes a navigation bar with links to the About and Contact pages.

