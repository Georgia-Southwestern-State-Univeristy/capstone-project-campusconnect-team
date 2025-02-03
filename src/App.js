// Import necessary modules from react-router-dom
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Import the Welcome and Building components
import Welcome from "./pages/Welcome";
import Building from "./pages/Building";

// Define the main App component
function App() {
    return (
        // Set up the Router to handle navigation
        <Router>
            <Routes>
                {/* Define the route for the Welcome page */}
                <Route path="/" element={<Welcome />} />
                {/* Define the route for the Building page with a dynamic id parameter */}
                <Route path="/building/:id" element={<Building />} />
            </Routes>
        </Router>
    );
}

// Export the App component as the default export
export default App;