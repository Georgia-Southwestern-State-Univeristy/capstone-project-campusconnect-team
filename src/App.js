//imports
import React, { useEffect } from "react";
//wraps app to use react router (enables navigation without page reloads)
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { testFirestoreConnection } from "./utils/firestoreTest";

// Importing Pages
import Welcome from "./pages/Welcome";
import Building from "./pages/Building";
import NotFound from "./pages/NotFound";

const App = () => {
    console.log("✅ App Component Loaded");

    useEffect(() => {
        testFirestoreConnection(); // Runs Firestore test when app starts
    }, []);

    return (
        <Router>
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
                </Routes>
            </div>
        </Router>
    );
};

export default App;