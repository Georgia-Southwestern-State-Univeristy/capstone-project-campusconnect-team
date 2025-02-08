//imports React and React DOM to render the app
import React from "react";
// Use ReactDOM.createRoot for React 18 + initialization
import ReactDOM from "react-dom/client"; 
import App from "./App";


// Create root element for React app
const root = ReactDOM.createRoot(document.getElementById("root")); 
root.render(
    <React.StrictMode>
        {/* Load app.js component in root element */}
        <App /> 
    </React.StrictMode>
);