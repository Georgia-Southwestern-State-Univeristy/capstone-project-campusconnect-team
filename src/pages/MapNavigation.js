//import react hooks for state management
import React, { useEffect, useRef, useCallback } from "react";
import '../pages/App.css'; // path to import css file for map styling

//log message to track commponent re-renders
console.log("MapNavigation re-rendered"); //debugging log to see if component re-renders
//MapNavigation component that takes in destination, userLocation, travelMode, and onRouteCalculated as props to display with google maps
const MapNavigation = ({ destination, userLocation, travelMode, onRouteCalculated }) => {
    //referencefs for Google Maps API elements 
    const mapRef = useRef(null); //reference to map container
    const directionsServiceRef = useRef(null); //reference to directions service
    const directionsRendererRef = useRef(null); //reference to directions renderer
    const mapInstanceRef = useRef(null); //reference to store map instance
    const originMarkerRef = useRef(null); //reference to origin marker
    const destinationMarkerRef = useRef(null); //reference to destination marker


    //initalize map & directions services only once 
    useEffect(() => {
        console.log("Initializing map...");
        //check if google maps API is loaded
        if (!window.google || !window.google.maps) {
            console.error("Google Maps API not loaded.");
            return;
        }

        //make & store map instance if not yet initialized 
        if (!mapInstanceRef.current) {
            mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
                zoom: 16, //default zoom level
                center: userLocation || destination, //center map on userLocation or destination
                disableDefaultUI: false, // Prevents UI flickering -> disable default controls
            });

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

        }, [userLocation, destination]); // Only update markers if location changes

    
    // Optimize route calculation -> calculate & display route b/w user location and destination
        const calculateRoute = useCallback(() => {
            // Exit if any of the required data is missing
            if (!userLocation || !destination || !directionsServiceRef.current || !directionsRendererRef.current) {
                return;
            }

            console.log("📍 Calculating route...");
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

                    // Extract distance and duration
                    const route = result.routes[0].legs[0];
                    const distance = route.distance.text;
                    const duration = route.duration.text;

                    // Pass distance and duration back to the parent component
                    if (onRouteCalculated) {
                        onRouteCalculated({[travelMode.toLowerCase()]: { distance, duration }});
                    }
                } else {
                    console.error("Directions request failed:", status);
                }
            });
        
        }, [travelMode, userLocation, destination, onRouteCalculated]);

    //Call route calculation when travelMode, userLocation, or destination changes
    //
    useEffect(() => {
        calculateRoute();
    }, [calculateRoute]);//run when calculateRoute changes

    //return map container w/ styling from css file
    return <div ref={mapRef} className="map-container" />;
};

export default MapNavigation;