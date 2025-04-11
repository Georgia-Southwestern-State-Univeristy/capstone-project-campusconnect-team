//imports React and React DOM to render the app
import React, { useEffect, useState, useCallback} from "react"; //react hooks to fetch building data & handle dynamic states 
//param to get building id from URL, useNavigate to get to other pages, Link to navigate without page reloads
import { useParams, NavLink,Link, useNavigate } from "react-router-dom";
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
    const [aiResponse, setAiResponse] = useState(""); // Store AI response

    //dropdown for departments 
    const [expandedDepartment, setExpandedDepartment] = useState(null);

    //state to store user's location
    const [userLocation, setUserLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [locationBlocked, setLocationBlocked] = useState(false); // Tracks if location access is blocked

    // Travel mode selection state (default: Walking)
    const [travelMode, setTravelMode] = useState("WALKING");
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const [showTravelDropdown, setShowTravelDropdown] = useState(false); // Controls dropdown visibility

    // state var to track current image index
    const [currentSlide, setCurrentSlide] = useState(0);

    // When the building id changes, reset the slideshow to the first image
    useEffect(() => {
        setCurrentSlide(0);
    }, [id]);
  
    /**
     * Automatically moves to the next slide every 5 seconds.
     * - Ensures slideshow continues running on its own.
     * - Stops when the component unmounts to prevent memory leaks.
    */
    useEffect(() => {
        //check if building exists and has valid images array
        if (building && building.building_image && Array.isArray(building.building_image) && building.building_image.length > 0) {
            //set interval to change slide every 5 seconds
            const interval = setInterval(() => {
                //update 'currentSlide' to the next image index, looping back to the start
                setCurrentSlide((prev) => (prev + 1) % building.building_image.length);
            }, 5000); // Change slide every 5 seconds

            /**
             * Cleanup function:
             * - Clears the interval when the component unmounts or `building` changes.
             * - Prevents multiple intervals from stacking up (avoids memory leaks).
            */
            return () => clearInterval(interval); 
        }
    }, [building]); // Add dependency on 'building' - Re-run effect when `building` changes (e.g., user navigates to a new building).



    // Function to move to next slide (check for valid images)
    const nextSlide = () => {
        if (building?.building_image && Array.isArray(building.building_image)) {
            //increment 'currentSlide' to the next image index by 1, looping back to the start
            setCurrentSlide((prev) => (prev + 1) % building.building_image.length);
        }
    };

    // Function to move to previous slide (check for valid images)
    const prevSlide = () => {
        if (building?.building_image && Array.isArray(building.building_image)) {
            //decrement 'currentSlide' to the previous image index by 1, looping back to the end
            setCurrentSlide((prev) => (prev - 1 + building.building_image.length) % building.building_image.length);
        }
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
    }, []); //empty array to run only once when component mounts

    // Function to toggle department dropdown visibility
    const toggleDepartment = (index) => {
        setExpandedDepartment(expandedDepartment === index ? null : index);
    };

    


    // handles search form submission
    const handleSearch = async (event) => {
        //prevent default behavior of form submission
        event.preventDefault();
        //if search empty, exit 
        if (query.trim() === "") return;

        //call searchBuildings function to get search results
        const results = await searchBuildings(query);
        
        // Check if the first result is an AI-generated response
        if (results.length === 1 && results[0].id === "ai-response") {
            setAiResponse(results[0].relevant_info);
            setShowDropdown(false); // Hide dropdown if AI response is shown
        } else {
            setSearchResults(results);
            setAiResponse(""); // Reset AI response if results are from buildings
            setShowDropdown(results.length > 0);
        }
    };

    // Handles dropdown selection
    const handleTravelModeChange = (mode) => {
        console.log("Travel mode updated:", mode);
        setTravelMode(mode);
        setShowTravelDropdown(false); // Close dropdown after selection
    };

     

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
        <div className="min-h-screen w-full overflow-x-hidden">
            {/* NAVIGATION BAR - align horizontal */}
            <nav className="flex flex-col md:flex-row justify-center md:justify-between items-center bg-white py-4 px-6 shadow-md space-y-4 md:space-y-0 md:space-x-6 text-center">
                {/*CampusConnect Logo -> wraps text in link from React Router to home page */}
                <Link to="/" className="text-2xl font-bold text-gold">
                    Campus <span className="text-navy">Connect</span>
                </Link>

                {/* SEARCH BAR WITH DROPDOWN */}
                <div className="relative">
                    {/* Search Form calls handleSearch function when submitted  */} 
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 w-full items-center">
                        {/* Search Input */}
                        <input 
                            type="text" 
                            placeholder="🔍 Search for a building or service..." 
                            //controlled componenet updates w/ setQuery
                            value={query}
                            //update query state 
                            onChange={(e) => setQuery(e.target.value)}
                            className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none text-black w-[22rem] sm:w-[24rem] md:w-80 lg:w-96"
                        />
                        <button 
                            //form submission triggered 
                            type="submit"
                            className="bg-gold text-white px-4 py-2 rounded-full hover:bg-[#B48225] w-full sm:w-auto"
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

                    {/* DROPDOWN RESULTS -  working****/}
                    {showDropdown && searchResults.length > 0 && !aiResponse && ( //when true, more than 0 result, and not an AI response 
                        <div className="absolute bg-white text-black w-full rounded-md shadow-lg mt-2 z-50">
                            <ul>
                                {/*map through search results and display them + change color when hovered*/} 
                                {searchResults.map((building) => (
                                    
                                    <li key={building.id} onClick={() => {
                                        navigate(`/building/${building.id}`); // ensure full box is clickable
                                        setShowDropdown(false);
                                      }}
                                      className="hover:bg-gray-200 cursor-pointer px-4 py-2 transition-all"
                                    >
                                      <div>
                                        <p className="font-medium">{building.building_name}</p>
                                        {building.relevant_info && (
                                          <p className="mt-1 text-sm text-gray-600">{building.relevant_info}</p>
                                        )}
                                      </div>
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
                    <NavLink to="/about" className={({ isActive }) => isActive ? "underline font-bold text-gold" : "hover:underline"}> About </NavLink>
                    <Link to="/contact" className="hover:underline">Contact</Link>
                </div>
            </nav>

            <div className="flex flex-col md:flex-row min-h-screen md:h-[calc(100vh-80px)] gap-6">
                <div className="w-full lg:w-1/2 bg-navy text-white p-10 overflow-y-auto">
                {/* Building Details */}
                   {/* Image Slideshow */}
                    {building?.building_image && Array.isArray(building.building_image) && building.building_image.length > 0 ? (
                        <div className="relative w-full h-64 overflow-hidden rounded-lg">
                            {/* Image Display of current slide */}
                                <img
                                    src={building.building_image[currentSlide]} //dynamically update image source based on currentSlide index
                                    alt={`Slide ${currentSlide}`} //accessibility text
                                    className="w-full h-64 object-cover transition-opacity duration-700 ease-in-out"//smooth transition effect for image change
                                />

                                {/* Left Arrow (SVG Icons for Better UI) */}
                                <button 
                                    onClick={prevSlide} //call function decreasing currentSlide index
                                    //positioning and styling for the button on left side, vertically centered w/ semi-transparent background & hover effect
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-80 transition"
                                >
                                    {/* SVG Icon for Left Arrow */}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        {/*left arrow path with rounded ends and stroke width of 2 */}
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                {/* Right Arrow button - next slides */}
                                <button 
                                    onClick={nextSlide} //call function increasing currentSlide index
                                    //positioning and styling for the button on right side, vertically centered w/ semi-transparent background & hover effect 
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-80 transition"
                                >
                                    {/* SVG Icon for Right Arrow */}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>

                                {/* Pagination Dots - which slide is active */}
                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                    {/*map through building images and create a dot for each image, highlight the current slide */}
                                    {building.building_image.map((_, index) => (
                                        <span 
                                            key={index} //assign unique key to each dot
                                            //highlight active dot based on currentSlide index, scale it up for emphasis
                                            className={`h-3 w-3 rounded-full transition-all duration-300 
                                            ${index === currentSlide ? 'bg-gold scale-110' : 'bg-gray-400'}`} //other slides are gray, active slide is gold
                                        ></span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            //no image available, show placeholder message
                            <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
                                <span className="text-gray-600">No Image Available</span>
                            </div>
                        )}



                    {/* Building Name & description*/}
                    <h1 className="text-5xl font-bold">{building.building_name}</h1>
                    <p className="text-lg mt-4">{building.description}</p>

                    
                    {/* Additional Details */}
                    <div className="mt-6">                        
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

                        {building?.departments && (
                            <>
                                <p className="font-bold text-lg">🏢 Departments:</p>
                                <ul className="list-none ml-6">
                                    {building.departments.map((department, index) => (
                                        <li key={index} className="mb-4">
                                            <button
                                                onClick={() => toggleDepartment(index)}
                                                className="w-full text-left bg-white text-navy px-6 py-4 rounded-lg shadow-md hover:bg-gray-200 transition-all border border-gray-300"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-semibold">{department.name}</span>
                                                    <span className="text-sm text-gray-600">{department.floor}</span>
                                                </div>
                                            </button>
                                            {expandedDepartment === index && (
                                                <div className="ml-6 mt-4 p-4 bg-white text-black rounded-lg border border-gray-200 shadow-md">
                                                {department.image && (
                                                    <img src={department.image} alt={department.name} className="w-full max-h-64 object-cover transition-all duration-300 ease-in-out" />
                                                )}
                                                {/* Department Description */}
                                                {department.description && (
                                                        <p className="text-gray-800 mb-4">{department.description}</p>
                                                    )}
                                                {/* Department Contact */}
                                                <p className="font-bold text-black flex items-center">
                                                    📞 Phone: <span className="ml-2 text-gray-800">{department.contact.phone}</span>
                                                </p>
                                                <p className="font-bold text-black flex items-center">
                                                    📧 Email: <span className="ml-2 text-gray-800">{department.contact.email}</span>
                                                </p>
                                                {/* Operating Hours */}
                                                {department.operating_hours && (
                                                    <div className="mt-4">
                                                        <p className="font-bold text-black flex items-center">🕒 Operating Hours:</p>
                                                        <ul className="list-disc ml-6 text-gray-900 ">
                                                            {Object.entries(department.operating_hours.regular).map(([day, hours], idx) => (
                                                                <li key={idx}><span className="font-semibold">{day}:</span> {hours}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {/* Department Services */}
                                                <p className="font-bold text-black">🛠️ Services:</p>
                                                <ul className="list-disc ml-6 text-gray-900">
                                                    {department.services.map((service, idx) => (
                                                        <li key={idx}>{service}</li>
                                                    ))}
                                                </ul>

                                                {/* Pricing Section (Only for Dining Hall) */}
                                                {department?.name === "Dining Hall, 'The Caf'" && department?.pricing && typeof department.pricing === "object" && Object.keys(department.pricing).length > 0 && (
                                                <>
                                                    <p className="font-bold text-black mt-4">💲 Pricing:</p>
                                                    <ul className="list-disc ml-6 text-gray-900">
                                                    {Object.entries(department.pricing).map(([meal, price], idx) => (
                                                        <li key={idx}>{meal}: {price}</li>
                                                    ))}
                                                    </ul>
                                                </>
                                                )}




                                                
                                            </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}

                        {/*display error message if location access is blocked*/}
                        {locationError && <p className="text-red-400">{locationError}</p>}
                    </div>
                </div> 

                    {/* Google Maps Preview */}
                    <div className="w-full md:w-1/2 flex flex-col justify-between overflow-hidden bg-white">
                        {/* Map Navigation Component */}
                        <div className="relative w-full min-h-[400px] sm:min-h-[500px] md:h-full flex-1 overflow-hidden">
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
                        <div className="px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center bg-white order-first md:order-none">
                                {/* Button to toggle dropdown visibility */}
                                <button
                                    className="bg-gold text-white px-4 py-2 rounded-full hover:bg-[#B48225] transition-all"
                                    onClick={() => setShowTravelDropdown(!showTravelDropdown)} //toggle dropdown visibility
                                >
                                    📍 Get Directions
                                </button>

                                {/* Dropdown to select travel mode - only when "Get Directions" clicked */}
                                {showTravelDropdown && (
                                    <div className="mt-2 sm:mt-0 w-52 bg-white border rounded-lg shadow-lg text-black">
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
                                <button className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-all"
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
