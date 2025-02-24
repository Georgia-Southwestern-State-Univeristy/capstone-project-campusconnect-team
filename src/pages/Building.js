//imports React and React DOM to render the app
import React, { useEffect, useState } from "react"; //react hooks to fetch building data & handle dynamic states 
//param to get building id from URL, useNavigate to get to other pages, Link to navigate without page reloads
import { useParams, Link, useNavigate } from "react-router-dom";
//imports firebase db (instance), doc, getDoc to fetch building data
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
//imports searchBuildings function to search for buildings
import { searchBuildings } from "../services/firestoreSearchService";

const Building = () => {
    //get building id from URL
    const { id } = useParams();
    const navigate = useNavigate();
    //store building data detched from fire store
    const [building, setBuilding] = useState(null);
    //boolean to check if data is still loading
    const [loading, setLoading] = useState(true);
    //store user input in search bar 
    const [query, setQuery] = useState("");
    //holds search results for dropdown****
    const [searchResults, setSearchResults] = useState([]);
    //boolean to check if dropdown should be shown****
    const [showDropdown, setShowDropdown] = useState(false);


    //when id changes, fetch building data from firestore
    useEffect(() => {
        const fetchBuilding = async () => {
            try {
                {/*get building data from firestore */}
                const docRef = doc(db, "buildings", id);
                const docSnap = await getDoc(docRef);
                {/*if building exists, set building data to state */}
                if (docSnap.exists()) {
                    setBuilding(docSnap.data());
                } 
                else {
                     {/*if building does not exist, set building to null */}
                    setBuilding(null);
                }

                {/*logs errors */}
            } catch (error) {
                console.error("🔥 Error fetching building:", error);
                setBuilding(null);
            } finally { {/*UI updates after data is fetched */}
                setLoading(false);
            }
        };

        fetchBuilding();
    }, [id]);

    const handleSearch = async (event) => {
        //prevent default behavior of form submission
        event.preventDefault();
        //if search empty, exit 
        if (query.trim() === "") return;

        //call searchBuildings function to get search results
        const results = await searchBuildings(query);
        setSearchResults(results);
        //show dropdown -not working **
        setShowDropdown(true);

        //if only one result, navigate to that building
        if (results.length === 1) {
            navigate(`/building/${results[0].id}`);
        }
    };

    //while loading, show loading message, else if no building found, show error message
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
            {/* NAVIGATION BAR - align horizontal */}
            <nav className="flex justify-between items-center bg-white py-4 px-10 shadow-md">
                {/*CampusConnect Logo -> wraps text in link from React Router to home page */}
                <Link to="/" className="text-2xl font-bold text-gold">
                    Campus <span className="text-navy">Connect</span>
                </Link>

                {/* SEARCH BAR WITH DROPDOWN */}
                <div className="relative mx-10">
                    {/* Search Form calls handleSearch function when submitted */}
                    <form onSubmit={handleSearch} className="relative w-full flex">
                        {/* Search Input */}
                        <input 
                            type="text" 
                            placeholder="🔍 Search for a building or service..." 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-96 px-4 py-1 rounded-full border border-gray-300 focus:outline-none text-black"
                        />
                        <button 
                            type="submit"
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gold text-white px-4 py-1 rounded-full hover:bg-[#B48225]"
                        >
                            Search
                        </button>
                    </form>

                    {/* DROPDOWN RESULTS */}
                    {showDropdown && searchResults.length > 1 && (
                        <div className="absolute bg-white text-black w-full rounded-md shadow-lg mt-2">
                            <ul>
                                {searchResults.map((building) => (
                                    <li key={building.id} className="hover:bg-gray-200 cursor-pointer px-4 py-2">
                                        <Link to={`/building/${building.id}`}>
                                            {building.building_name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Navigation Links */}
                <div className="space-x-6 text-navy font-medium">
                    <Link to="/" className="hover:underline">Home</Link>
                    <Link to="/about" className="hover:underline">About</Link>
                    <Link to="/contact" className="hover:underline">Contact</Link>
                </div>
            </nav>

            <div className="flex h-screen">
                <div className="w-1/2 bg-navy text-white p-10">
                    {/* Building Details */}
                    {building?.building_image && (
                        <img src={building.building_image} alt={building.building_name} className="w-full h-64 object-cover rounded-lg mb-4" />
                    )}
                    {/* Building Name & description */}
                    <h1 className="text-5xl font-bold">{building.building_name}</h1>
                    <p className="text-lg mt-4">{building.description}</p>

                    {/* Get Directions Button 
                    <div>
                        <button
                            className="bg-gold text-white px-4 py-2 rounded-full mt-4 mr-2 hover:bg-[#B48225]"
                            onClick={() => alert('Get Directions clicked')}
                        >
                            Get Directions
                        </button>
                    </div>*/}

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

                {/* Google Maps Embed */}
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
