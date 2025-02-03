import React from "react";
// Import necessary modules from react-router-dom
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Import the Welcome and Building components
import Welcome from "./pages/Welcome";
import Building from "./pages/Building";
import NotFound from "./pages/NotFound"; // Optional: Handles 404 pages

// Define the main App component
function App() {
    console.log("✅ App Component Loaded");
    return (
        // Set up the Router to handle navigation
        <Router>
            <div className="min-h-screen bg-gray-100">
                <Routes>
                    {/* Home/Welcome Page */}
                    <Route path="/" element={<Welcome />} />

                    {/* Dynamic Building Page */}
                    <Route path="/building/:id" element={<Building />} />

                    {/* Catch-All Route (404 Page) */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </Router>
    );
}

// Export the App component as the default export
export default App;