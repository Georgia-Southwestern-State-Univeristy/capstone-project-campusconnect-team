import React from "react";
import ReactDOM from "react-dom/client"; // Use ReactDOM.createRoot for React 18
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")); // Create root element for React app
root.render(
    <React.StrictMode>
        <App /> {/* Render the App component */}
    </React.StrictMode>
);