/* 404 error page */ 

import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {        // This is the 404 Not Found page component
    // This page is displayed when the user navigates to a non-existent route
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
            <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
            <p className="text-lg mt-2">Oops! This page doesn't exist.</p>
            <Link to="/" className="mt-4 px-4 py-2 bg-blue-500 rounded">Go Back Home</Link>
        </div>
    );
};

export default NotFound;
