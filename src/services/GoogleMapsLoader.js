import { useEffect } from "react";

const GoogleMapsLoader = () => {
  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src^="https://maps.googleapis.com/maps/api/js"]'
    );
    if (existingScript) return;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null; // This component doesn't render UI
};

export default GoogleMapsLoader;
