//imports React and React DOM to render the app
import React, { useEffect, useState, useCallback} from "react"; //react hooks to fetch building data & handle dynamic states 
//param to get building id from URL, useNavigate to get to other pages, Link to navigate without page reloads
import { useParams, Link, useNavigate } from "react-router-dom";
//imports firebase db (instance), doc, getDoc to fetch building data
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
//imports searchBuildings function to search for buildings
import { searchBuildings } from "../services/firestoreSearchService";
//imports MapNavigation component to display map
import MapNavigation from "../pages/MapNavigation"; // Import MapNavigation


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

    //state to store user's location
    const [userLocation, setUserLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [locationBlocked, setLocationBlocked] = useState(false); // Tracks if location access is blocked

    // Travel mode selection state (default: Walking)
    const [travelMode, setTravelMode] = useState("WALKING");
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const [showTravelDropdown, setShowTravelDropdown] = useState(false); // Controls dropdown visibility

    //when id changes, fetch building data from firestore
    useEffect(() => {
        const fetchBuilding = async () => {
            try {
                {/*get building data from firestore */}
                const docRef = doc(db, "buildings", id);
                const docSnap = await getDoc(docRef);
                {/*if building exists, set building data to state */}
                if (docSnap.exists()) {
                    console.log("Destination updated:", docSnap.data());
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
    }, [id]); //run whenever id changes

      // Request user location when component mounts
      useEffect(() => {
        //geolocation api to get user's location allowed in browser
        if (navigator.geolocation) {
            //request user 's location
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
    
                    // Only update userLocation if the coordinates have changed
                    if (
                        !userLocation || newLocation.lat !== userLocation.lat || newLocation.lng !== userLocation.lng
                    ) {
                        console.log("✅ Location Access Granted:", newLocation);
                        setUserLocation(newLocation);
                    }
                },
                (error) => {
                    //log error if location access denied
                    console.error("❌ Location Access Denied:", error);
                    setLocationBlocked(true); // User blocked location access & set 
                    //display error message to user to get location 
                    setLocationError("⚠️ Please enable location access to improve navigation.");
                }, 
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // Force GPS accuracy (wait 10 secs & force fresh location reading; NOT cached)
            );
        } else {
            setLocationError("⚠️ Geolocation is not supported by this browser.");
        }
    }, [userLocation]); //empty array to run only once when component mounts


    // handles search form submission
    const handleSearch = async (event) => {
        //prevent default behavior of form submission
        event.preventDefault();
        //if search empty, exit 
        if (query.trim() === "") return;

        //call searchBuildings function to get search results
        const results = await searchBuildings(query);
        setSearchResults(results);
        //show dropdown  working **
        setShowDropdown(true);

        //if only one result, navigate to that building
        if (results.length === 1) {
            navigate(`/building/${results[0].id}`);
            setShowDropdown(false); // Close dropdown after navigation
        }
    };

    // Handles dropdown selection
    const handleTravelModeChange = (mode) => {
        console.log("Travel mode updated:", mode);
        setTravelMode(mode);
        setShowTravelDropdown(false); // Close dropdown after selection
    };

     // Callback function to handle route calculation & update distance & duration once route is calculated
     const handleRouteCalculated = useCallback((data) => { {/*callback function doesn't get recal unless travelMode change */}
        setDistance((prev) => ({
            //keep previous distance for other travel modes & update to selected one 
            ...prev,
            [travelMode.toLowerCase()]: data[travelMode.toLowerCase()]?.distance, //data from Google Maps Directions API
        }));
        setDuration((prev) => ({
            //keep previous duration for other travel modes & update to selected one
            ...prev,
            [travelMode.toLowerCase()]: data[travelMode.toLowerCase()]?.duration,//toLowerCase() to match travelMode state
        }));
    }, [travelMode]);

    // Open Google Maps with travel route selected, destination, and user location 
    const openGoogleMaps = () => {
        //check if user location or destination is missing ebfore opening maps
        if (!userLocation || !building?.lat || !building?.lng) {
            alert("Missing location data."); //display alert if missing data
            return; //exit function
        }

        //open google maps with user location, destination, and travel mode
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${building.lat},${building.lng}&travelmode=${travelMode.toLowerCase()}`;
        //open maps in new tab
        window.open(mapsUrl, "_blank");
    };


    

    //while loading, show loading message, else if no building found, show error message
    if (loading) {
        return <div className="text-white text-center mt-10">Loading building details...</div>;
    }

    //error message if building not found
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
                <div className="relative">
                    {/* Search Form calls handleSearch function when submitted  */} 
                    <form onSubmit={handleSearch} className="relative w-64 flex">
                        {/* Search Input */}
                        <input 
                            type="text" 
                            placeholder="🔍 Search for a building or service..." 
                            //controlled componenet updates w/ setQuery
                            value={query}
                            //update query state 
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full min-w-[400px] px-4 py-2 rounded-full border border-gray-300 focus:outline-none text-black"
                        />
                        <button 
                            //form submission triggered 
                            type="submit"
                            className="absolute left-80 top-1/2 transform -translate-y-1/2 bg-gold text-white px-4 py-2 rounded-full hover:bg-[#B48225]"
                        >
                            Search
                        </button>
                    </form>

                    {/* DROPDOWN RESULTS -  working****/}
                    {showDropdown && searchResults.length > 1 && ( //when true and more than 1 result 
                        <div className="absolute bg-white text-black w-full rounded-md shadow-lg mt-2 z-50">
                            <ul>
                                {/*map through search results and display them + change color when hovered*/} 
                                {searchResults.map((building) => (
                                    
                                    <li key={building.id} className="hover:bg-gray-200 cursor-pointer px-4 py-2"  onClick={() => setShowDropdown(false)}>  {/*each result is a link to the building page */}
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
                    {/*each link from react-router-dom*/}
                    <Link to="/" className="hover:underline">Home</Link>
                    <Link to="/about" className="hover:underline">About</Link>
                    <Link to="/contact" className="hover:underline">Contact</Link>
                </div>
            </nav>

            <div className="flex h-screen">
                <div className="w-1/2 bg-navy text-white p-10 overflow-y-auto">
                    {/* Building Details */}
                    {building?.building_image && (
                        <img src={building.building_image} alt={building.building_name} className="w-full h-64 object-cover rounded-lg mb-4" />
                    )}
                    {/* Building Name & description*/}
                    <h1 className="text-5xl font-bold">{building.building_name}</h1>
                    <p className="text-lg mt-4">{building.description}</p>

                    
                    {/* Additional Details */}
                    <div className="mt-6">
                        {/*renders only if building.phone_num exists in firebase*/}
                        {building?.phone_num && (
                            <>
                                <p className="font-bold text-lg">📞 Phone:</p>
                                {/*check if phone_num is an array, if so map through it and display each number in a list */}
                                <ul className="list-disc ml-6">
                                    {Array.isArray(building.phone_num) ? building.phone_num.map((phone, index) => <li key={index}>{phone}</li>) : <li>{building.phone_num}</li>}
                                </ul>
                            </>
                        )}

                        {/*renders only if building.email exists in firebase*/}
                        {building?.email && (
                            <>
                                <p className="font-bold text-lg">📧 Email:</p>
                                {/*check if email is an array, if so map through it and display each number in a list */}
                                {/*if not an array, just display email + .map() help iterate & create <li> for each email */}
                                <ul className="list-disc ml-6">
                                    {Array.isArray(building.email) ? building.email.map((email, index) => <li key={index}>{email}</li>) : <li>{building.email}</li>}
                                </ul>
                            </>
                        )}

                        {/*renders only if building.operating_hours exists in firebase*/}
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
                        {/*display error message if location access is blocked*/}
                        {locationError && <p className="text-red-400">{locationError}</p>}
                    </div>
                </div> 

                    {/* Google Maps Preview */}
                    <div className="w-1/2 relative">
                        {/* Map Navigation Component */}
                        <div className="h-full w-full">
                            {/*check if building lat & lng exists and user location exists before rendering  */}
                            {building?.lat && building?.lng && userLocation && (
                                <MapNavigation
                                    destination={{ lat: building.lat, lng: building.lng }} //pass destination
                                    userLocation={userLocation} //pass user location
                                    travelMode={travelMode} //pass travel mode
                                    onRouteCalculated={handleRouteCalculated} // Pass the callback function to update distance and duration once route is calculated
                                />
                            )}
                        </div>
                    
    
    
                        {/* Get Directions Dropdown Below Map */}
                        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-4">
                                {/* Button to toggle dropdown visibility */}
                                <button
                                    className="bg-gold text-white px-4 py-2 rounded-full hover:bg-[#B48225] transition-all"
                                    onClick={() => setShowTravelDropdown(!showTravelDropdown)} //toggle dropdown visibility
                                >
                                    📍 Get Directions
                                </button>

                                {/* Dropdown to select travel mode - only when "Get Directions" clicked */}
                                {showTravelDropdown && (
                                    <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                                        {/* Dropdown options */}
                                        <label className="block text-black text-lg font-bold p-2">Select Travel Mode:</label>
                                        <select
                                            className="w-full px-4 py-2 border border-gray-300 text-black"
                                            value={travelMode} //set the selected travel mode
                                            onChange={(e) => handleTravelModeChange(e.target.value)} //update travel mode when selected
                                        >
                                            {/*option for walking and driving with distance and duration */}
                                            <option value="WALKING">🚶 Walking ({duration?.walking} - {distance?.walking})</option>
                                            <option value="DRIVING">🚗 Driving ({duration?.driving} - {distance?.driving})</option>
                                        </select>
                                    </div>
                                )}
                                {/* Button to open Google Maps with route */}
                                <button className="ml-4 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-all"
                                onClick={openGoogleMaps}> {/*calls the function to open google maps with route*/}
                                    
                                    🚀 Go
                                </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

export default Building;
