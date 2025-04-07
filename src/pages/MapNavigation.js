//import react hooks for state management
import React, { useEffect, useRef, useCallback, useState } from "react";
import '../pages/App.css'; // path to import css file for map styling

//log message to track commponent re-renders
console.log("MapNavigation re-rendered"); //debugging log to see if component re-renders

/**
 * (Solution)!!! Debounce function to delay execution of a function by a specified time.
 * helps in reducing excessive API calls.
 * {Function} func - The function to be debounced.
 * @{number} wait - The delay time in milliseconds.
 */
const debounce = (func, wait) => {
    let timeout; //store timeout reference
    //return debounced function that wraps original function 'func' 
    return function(...args) {
        //clear existing timeout if it exists
        clearTimeout(timeout);

        //set new timeout to delay execution of function by 'wait' milliseconds
        timeout = setTimeout(() => func.apply(this, args), wait); //call original function with latest argument 
    };
};

//MapNavigation component that takes in destination, userLocation, travelMode, and onRouteCalculated as props to display with google maps
const MapNavigation = ({ destination, userLocation, travelMode, onRouteCalculated }) => {
    //referencefs for Google Maps API elements 
    const mapRef = useRef(null); //reference to map container
    const directionsServiceRef = useRef(null); //reference to directions service
    const directionsRendererRef = useRef(null); //reference to directions renderer
    const mapInstanceRef = useRef(null); //reference to store map instance
    const originMarkerRef = useRef(null); //reference to origin marker
    const destinationMarkerRef = useRef(null); //reference to destination marker

    // use a reference to track if the function has already been called for the same values
    const lastRouteParams = useRef({ destination: null, travelMode: null });

    // Timeout reference for debouncing API calls (cache routes to avoid making redundant API calls)
    const routeCache = useRef({});

    //Control when to hide loading overlay
    const [mapLoaded, setMapLoaded] = useState(false); // NEW: Track loading state

    // new refs to track map loading state
    //mapTilesLoadedRef tracks if map tiles are loaded
    //routeDrawnRef tracks if route is drawn
    const mapTilesLoadedRef = useRef(false);
    const routeDrawnRef = useRef(false);

    //function to check if map is fully loaded then show map 
    const checkIfMapIsFullyReady = () => {
        if (mapTilesLoadedRef.current && routeDrawnRef.current) {
          setMapLoaded(true); //map ready? remove loader 
        }
      };


    //initalize map & directions services only once 
    useEffect(() => {
        console.log("Initializing map...");
        //check if google maps API is loaded
        if (!window.google || !window.google.maps) {
            console.error("Google Maps API not loaded.");
            return;
        }

        //Reset all flags so overlay shows from the start
        setMapLoaded(false);
        mapTilesLoadedRef.current = false;
        routeDrawnRef.current = false;

        //make & store map instance if not yet initialized 
        if (!mapInstanceRef.current) {
            mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
                zoom: 16, //default zoom level
                center: userLocation || destination, //center map on userLocation or destination
                disableDefaultUI: false, // Prevents UI flickering -> disable default controls
            });

        // detects when the map has fully loaded (tiles rendered)
        mapInstanceRef.current.addListener("tilesloaded", () => {
            console.log("✅ Map tiles loaded");
            mapTilesLoadedRef.current = true;
            checkIfMapIsFullyReady(); //combine w/ route status 
          });    

         //debugging log to see if map is initialized   
        console.log("Map initialized:", mapInstanceRef.current);

        // Initialize DirectionsService (to compute)and DirectionsRenderer (display rendered computed maps) only once
        directionsServiceRef.current = new window.google.maps.DirectionsService();
        directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
            suppressMarkers: true, // Prevents automatic markers (fixes flickering)
        });
            //set directions render to use our created map instance
            directionsRendererRef.current.setMap(mapInstanceRef.current);
    }
    }, []); //only run once

        // Ensure markers are created only once and update their positions
        useEffect(() => {
            if (!mapInstanceRef.current) return; // Exit if map is not initialized

            let AdvancedMarkerElement;
            try {
                //try to use advanced marker element if avail 
                AdvancedMarkerElement = google.maps.marker.AdvancedMarkerElement; //use advanced marker element
            } catch (e) {
                console.warn("⚠️ AdvancedMarkerElement not available. Falling back to google.maps.Marker.");
            }
    
            // **Use location marker (A) **
            if (!originMarkerRef.current && userLocation) {
                //check if AdvancedMarkerElement is available, if not use google.maps.Marker
                originMarkerRef.current = AdvancedMarkerElement
                    ? new AdvancedMarkerElement({
                          position: userLocation, //set marker position to user's locarion 
                          map: mapInstanceRef.current, //attatched marker to current Map instance
                          title: "Your Location",
                          text: "A", // Label for the marker
                      })
                    : new google.maps.Marker({
                          position: userLocation, //fallback to use google.maps.Marker if above fail
                          map: mapInstanceRef.current,
                          title: "Your Location",
                          label: "A", //fall back to label if advanced marker not available
                      });
            } else if (originMarkerRef.current) {
                //update position if marker already created
                originMarkerRef.current.setPosition(userLocation); //update marker position if already created 
            }
    
            /* **Use destination marker (B) ** */
            if (!destinationMarkerRef.current && destination) {
                destinationMarkerRef.current = AdvancedMarkerElement
                    ? new AdvancedMarkerElement({
                          position: destination, //set marker position to destination
                          map: mapInstanceRef.current, //attatched marker to current Map instance
                          title: "Destination",
                          text: "B", // Label for the marker
                      })
                    : new google.maps.Marker({
                          position: destination,
                          map: mapInstanceRef.current,
                          title: "Destination",
                          label: "B", //fall back to label if advanced marker not available
                      });
            } else if (destinationMarkerRef.current) {
                destinationMarkerRef.current.setPosition(destination); //update marker position if already created
            }

        }, [userLocation, destination]); // Only update markers if location or destination changes

    
    // Optimize route calculation -> calculate & display route b/w user location and destination + route caching to prevent redundant API calls
        const calculateRoute = useCallback(() => {
            //generate unique cache key for each route (location, destination, & travel mode)
            const cacheKey = `${JSON.stringify(userLocation)}-${JSON.stringify(destination)}-${travelMode}`;
            //route already cached?  return cached route instead of making API call
            if (routeCache.current[cacheKey]) {
                directionsRendererRef.current.setDirections(routeCache.current[cacheKey]);
                return;
            }

            // Exit if any of the required data is missing
            if (!userLocation || !destination || !directionsServiceRef.current || !directionsRendererRef.current) {
                return;
            }

            console.log("📍 Calculating route...");

            // //Reset loading indicators before route starts
            // setMapLoaded(false);          
            // mapTilesLoadedRef.current = false;
            // routeDrawnRef.current = false;

            // ✅ Reset loader on route start
            setMapLoaded(false);
            routeDrawnRef.current = false;

            //direct route rquest parameters 
            const request = {
                origin: userLocation, //start location
                destination: destination, //end location
                travelMode: window.google.maps.TravelMode[travelMode], //travel mode
            };

    

            //request route calculation from Google Maps API
            directionsServiceRef.current.route(request, (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    directionsRendererRef.current.setDirections(result); //display calculated route
                    console.log("✅ Route drawn");

                    //update loading indicators
                    routeDrawnRef.current = true;
                    checkIfMapIsFullyReady(); //show map if both are done 

                    routeCache.current[cacheKey] = result; //store route in cache

                    // Extract distance and duration
                    const route = result.routes[0].legs[0];
                    const distance = route.distance.text;
                    const duration = route.duration.text;

                    //pass distance and duration to parent component
                    if (onRouteCalculated) {
                        onRouteCalculated({ [travelMode.toLowerCase()]: { distance, duration } });
                    }

                    // Update lastRouteParams only after a successful calculation
                    lastRouteParams.current = { destination, travelMode };
                    } else {
                        console.error("Directions request failed:", status);
                    }
            });
        
        }, [userLocation, destination, travelMode, onRouteCalculated]);

        //Debounce route calculation to prevent excessive API calls
        const debouncedCalculateRoute = useCallback(
            debounce(calculateRoute, 300),
            [calculateRoute]
          );
          
        //watch for changes in destination and travel mode to trigger debounced route calculation
        useEffect(() => {
    
            const currentParams = JSON.stringify({ destination, travelMode });

            const lastParams = JSON.stringify(lastRouteParams.current);
          
            if (currentParams !== lastParams) {
              console.log("📍 Route params changed. Recalculating route...");
              debouncedCalculateRoute();
        }
    }, [destination, travelMode, debouncedCalculateRoute]); //run only when destination or travel mode changes

    //render map container 
    return( 
        <div className="relative w-full h-full">
            {/* Show loading overlay if map isn't ready */}
            {!mapLoaded && (
                <div className="absolute inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
                <span className="mr-2">Loading route</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gold rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gold rounded-full animate-bounce delay-150"></div>
                  <div className="w-2 h-2 bg-gold rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            )}

            {/* Actual map container */}
            <div ref={mapRef} className="map-container h-full" />
        </div>);
    
    };

export default MapNavigation;