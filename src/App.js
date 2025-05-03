//imports
import React, { useEffect } from "react";
//wraps app to use react router (enables navigation without page reloads)
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { testFirestoreConnection } from "./utils/firestoreTest";

// Importing Pages
import Welcome from "./pages/Welcome";
import Building from "./pages/Building";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";

import GoogleMapsLoader from "./services/GoogleMapsLoader";

const App = () => {
    console.log("✅ App Component Loaded");

    useEffect(() => {
        testFirestoreConnection(); // Runs Firestore test when app starts
    }, []);

    return (
        <Router>
            {/* Load Google Maps API */}
            <GoogleMapsLoader />
            {/*light backround color for the app w/ tailwind */}
            <div className="min-h-screen bg-gray-100">
                {/*define routes */}
                <Routes>
                    {/* Route for Welcome page */}
                    <Route path="/" element={<Welcome />} /> 
                    {/* Dynamic route for Building page */}
                    <Route path="/building/:id" element={<Building />} />
                    {/* Route for NotFound page */} 
                    <Route path="*" element={<NotFound />} /> 
                    {/* Route for About page */}
                    <Route path="/about" element={<About />} />
                    {/* Route for Contact page */}
                    <Route path="/contact" element={<Contact />} />

                </Routes>
            </div>
        </Router>
    );
};

export default App;