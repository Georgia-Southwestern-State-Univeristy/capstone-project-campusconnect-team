//imports React and React DOM to render the app
import React, { useEffect, useState } from "react"; //react hooks to fetch building data & handle dynamic states 
//param to get building id from URL, useNavigate to get to other pages, Link to navigate without page reloads
import { useParams, Link, useNavigate } from "react-router-dom";
//imports firebase db (instance), doc, getDoc to fetch building data
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
//imports searchBuildings function to search for buildings
import { searchBuildings } from "../services/firestoreSearchService";
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

      // Request user location when component mounts
      useEffect(() => {
        //geolocation api to get user's location allowed in browser?
        if (navigator.geolocation) {
            //request user 's location
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    //set user's location to state & log it 
                    console.log("✅ Location Access Granted:", position.coords);
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
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
                <div className="relative">
                    {/* Search Form calls handleSearch function when submitted  */} 
                    <form onSubmit={handleSearch} className="relative w-full flex">
                        {/* Search Input */}
                        <input 
                            type="text" 
                            placeholder="🔍 Search for a building or service..." 
                            //controlled componenet updates w/ setQuery
                            value={query}
                            //update query state 
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none text-black"
                        />
                        <button 
                            //form submission triggered 
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gold text-white px-4 py-1 rounded-full hover:bg-[#B48225]"
                        >
                            Search
                        </button>
                    </form>

                    {/* DROPDOWN RESULTS -  working****/}
                    {showDropdown && searchResults.length > 1 && ( //when true and more than 1 result 
                        <div className="absolute bg-white text-black w-full rounded-md shadow-lg mt-2">
                            <ul>
                                {/*map through search results and display them + change color when hovered*/} 
                                {searchResults.map((building) => (
                                    <li 
                                    key={building.id} 
                                    className="hover:bg-gray-200 cursor-pointer px-4 py-2"
                                    onClick={() => setShowDropdown(false)} // Hide dropdown on click
                                >  
                                    {/* Each result is a link to the building page */}
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
                    <Link to="/services" className="hover:underline">Services</Link>
                    <Link to="/contact" className="hover:underline">Contact</Link>
                </div>
            </nav>

            <div className="flex h-screen">
                <div className="w-1/2 bg-navy text-white p-10">
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

                        {/* Show location error if denied */}
                        {locationError && <p className="text-red-400">{locationError}</p>}

                        {/* "Get Directions" Button - Disabled if Location is Blocked */}
                        {building?.lat && building?.lng && ( //latitute & longitude exists
                            <div className="mt-6">
                                <a
                                    //open google maps with directions to building or block if location is blocked
                                    onClick={(e) => {
                                        if (locationBlocked) {
                                            e.preventDefault(); // Prevent navigation if location is blocked
                                        } 
                                        // else {
                                        //     //open google maps with directions to building in new tab w/ user lcation
                                        //     window.open(
                                        //         `https://www.google.com/maps/dir/?api=1&destination=${building.lat},${building.lng}${
                                        //             userLocation ? `&origin=${userLocation.lat},${userLocation.lng}` : "&origin=My+Location"
                                        //         }`,
                                        //         "_blank"
                                        //     );
                                        // }
                                    }}
                                    //apply different styles based on locationBlocked state
                                    className={`px-4 py-2 rounded-full mt-4 mr-2 transition ${
                                        locationBlocked
                                            ? "bg-gray-500 text-gray-300 cursor-not-allowed" //grey if blocked
                                            : "bg-gold text-white hover:bg-[#B48225]"   //regular gold if allowed 
                                    }`}
                                    //prevent navigation if location is blocked 
                                    href={locationBlocked ? "#" : `https://www.google.com/maps/dir/?api=1&destination=${building.lat},${building.lng}${
                                        userLocation ? `&origin=${userLocation.lat},${userLocation.lng}` : "&origin=My+Location"
                                    }`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    📍 Get Directions
                                </a>
                            </div>
                        )}
                        {/* Show Map Only if Location is Available */}
                    {building?.lat && building?.lng && userLocation && (
                        <MapNavigation destination={{ lat: building.lat, lng: building.lng }} userLocation={userLocation} />
                    )}
                    </div>
                    {/* Pass userLocation to MapNavigation */}
                    <div className="w-1/2 bg-gold flex items-center justify-center">
                        {building?.lat && building?.lng && userLocation && (
                            <MapNavigation destination={{ lat: building.lat, lng: building.lng }} userLocation={userLocation} />
                        )}
                    </div>

                </div>

                
                {/* Google Maps Embe, only reneder if lat & long avail*/}
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
