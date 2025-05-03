import { useEffect } from "react"; // Importing useEffect from React to handle side effects

const GoogleMapsLoader = () => {
  useEffect(() => {
    const existingScript = document.querySelector( // Check if the Google Maps script is already loaded
      'script[src^="https://maps.googleapis.com/maps/api/js"]'//  URL pattern to match the Google Maps script
    );
    if (existingScript) return;// If the script is already loaded, do nothing

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;// Use the API key from environment variables
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);// Append the script to the body of the document

    return () => {
      document.body.removeChild(script);//  Cleanup function to remove the script when the component unmounts 
    };
  }, []);

  return null; // This component doesn't render UI
};

export default GoogleMapsLoader;// Exporting the component for use in other parts of the application
// This component is used to load the Google Maps JavaScript API script dynamically when the component mounts.
