import React from "react";
import { Link } from "react-router-dom";

const Welcome = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-navy text-white">
            <h1 className="text-5xl font-extrabold">Welcome to</h1>
            <h2 className="text-6xl font-extrabold text-gold mt-2">CampusConnect!</h2>
            <p className="mt-4 text-lg text-gray-300 text-center px-6">
                CampusConnect is here to help you navigate our campus according to your necessities and desired destination.
            </p>

            {/* Search Bar - Increased Size */}
            <div className="mt-6 w-96">
                <input 
                    type="text" 
                    placeholder="🔍 What are you looking for?..." 
                    className="input input-bordered w-full py-3 px-6 rounded-full text-black text-lg shadow-md"
                />
            </div>

            {/* Quick Navigation Buttons */}
            <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Link to="/building/library" className="btn btn-primary bg-navy text-white px-6 py-3 rounded-full shadow-lg text-lg hover:bg-[#001A4A]">
                    Library
                </Link>
                <Link to="/building/cafe" className="btn bg-gold text-white px-6 py-3 rounded-full shadow-lg text-lg hover:bg-[#B48225]">
                    Cafe Campesino
                </Link>
                <Link to="/building/storm-dome" className="btn bg-gold text-white px-6 py-3 rounded-full shadow-lg text-lg hover:bg-[#B48225]">
                    Storm Dome
                </Link>
            </div>

            {/* Footer */}
            <div className="mt-12 w-full bg-gold py-4">
                <div className="flex justify-center space-x-6 text-white text-sm">
                    <Link to="/contact" className="hover:underline">Contact Us</Link>
                    <Link to="/privacy" className="hover:underline">Privacy</Link>
                    <Link to="/about" className="hover:underline">About</Link>
                    <Link to="/help" className="hover:underline">Help</Link>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
