{/*display google map with directions from user's location to destination*/}
// Import the functions needed from the SDKs 
import React, { useEffect, useRef } from "react";

const MapNavigation = ({  destination, userLocation  }) => {
    // Create a reference to the map div element
    const mapRef = useRef(null);

    useEffect(() => {
        if (!userLocation || !destination) return; // Exit if user location isn't available

        //initialize google maps & center on destination
        const map = new window.google.maps.Map(mapRef.current, {
            zoom: 16,//default zoom level
            center: destination, //center map on destination
        });

        //create services for directions and rendering
        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map); //atatch render to map 

        // //request user's location as lat & long coordinates
        // navigator.geolocation.getCurrentPosition((position) => {
        //     const userLocation = {
        //         lat: position.coords.latitude,
        //         lng: position.coords.longitude,
        //     };

            //request directions from user's location to destination
            directionsService.route(
                {
                    origin: userLocation, //user's location
                    destination, //building location
                    travelMode: window.google.maps.TravelMode.WALKING, // Walking for campus paths
                },
                (result, status) => {
                    if (status === "OK") {
                        //directions are found, render on map
                        directionsRenderer.setDirections(result);
                    } else {
                        //error fetching directions if google maps API fails to find route 
                        console.error("Error fetching directions:", status);
                    }
                }
            );
        // );
    }, [destination, userLocation]);// Re-run effect if `userLocation` or `destination` changes

    //map div to display map
    return <div ref={mapRef} style={{ width: "100%", height: "500px" }} />;
};

export default MapNavigation;
