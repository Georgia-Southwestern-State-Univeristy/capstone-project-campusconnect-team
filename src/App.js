import React, { useEffect } from "react";
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
            <div className="min-h-screen bg-gray-100">
                <Routes>
                    <Route path="/" element={<Welcome />} /> {/* Route for Welcome page */}
                    <Route path="/building/:id" element={<Building />} /> {/* Route for Building page */}
                    <Route path="*" element={<NotFound />} /> {/* Route for NotFound page */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;