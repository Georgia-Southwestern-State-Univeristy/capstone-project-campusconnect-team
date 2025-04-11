import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-navy text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-white py-4 px-10 shadow-md">
        <Link to="/" className="text-2xl font-bold text-gold">
          Campus <span className="text-navy">Connect</span>
        </Link>
        <div className="space-x-6 text-navy font-medium">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/about" className="hover:underline">About</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
        </div>
      </nav>

      <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-gold mb-4 text-center">About CampusConnect</h1>

        {/* Card - What is CampusConnect */}
        <div className="bg-white text-navy rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">📌 What is CampusConnect?</h2>
          <p className="text-lg leading-relaxed">
            CampusConnect is a responsive, web-based campus navigation platform built to simplify the college experience. Designed with students, staff, and visitors in mind, it enables users to explore buildings, departments, and services across campus through an intuitive UI backed by real-time data and AI-powered search.
          </p>
        </div>

        {/* Card - Our Purpose */}
        <div className="bg-white text-navy rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">🎯 Our Purpose</h2>
          <p className="text-lg leading-relaxed">
            Universities can be overwhelming—especially for new students and visitors. CampusConnect was born out of the need to reduce confusion, eliminate wasted time, and empower users to confidently reach their destinations. Whether it’s finding the financial aid office or a hidden study spot, our platform is designed to guide you there, intelligently and efficiently.
          </p>
        </div>

        {/* Card - Features */}
        <div className="bg-white text-navy rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">⚙️ Key Features</h2>
          <ul className="list-disc ml-6 space-y-3 text-lg">
            <li><strong>Smart Search:</strong> Enter a building, department, or service and receive location-based results powered by Firestore and intelligent keyword matching.</li>
            <li><strong>AI Assistance:</strong> If you’re unsure how to phrase your query, the AI assistant helps interpret your intent and provides a relevant answer.</li>
            <li><strong>Interactive Building Pages:</strong> See photos, descriptions, departments, floors, services offered, and real-time navigation links on each page.</li>
            <li><strong>Google Maps Integration:</strong> Get real-time walking or driving directions from your location to any campus destination—directly from the browser.</li>
            <li><strong>Responsive Design:</strong> Seamlessly functional on phones, tablets, and desktops with layouts that adapt for ease of use.</li>
          </ul>
        </div>

        {/* Card - How It Works */}
        <div className="bg-white text-navy rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">🚀 How It Works</h2>
          <p className="text-lg leading-relaxed mb-4">
            CampusConnect was developed using modern web technologies, including React, Tailwind CSS, Firebase Firestore, and the Google Maps API. Here’s how users interact with it:
          </p>
          <ol className="list-decimal ml-6 space-y-2 text-lg">
            <li>Search for a building, department, or service from the home page or header.</li>
            <li>Receive a list of matching results or an AI-generated suggestion.</li>
            <li>Click a result to view detailed building information, including images, floor-by-floor departments, and offered services.</li>
            <li>Use the integrated map to see your location and route options.</li>
            <li>Choose to open directions in Google Maps or explore more services.</li>
          </ol>
        </div>

        {/* Card - Vision for Future */}
        <div className="bg-white text-navy rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">💡 Vision for the Future</h2>
          <p className="text-lg leading-relaxed">
            CampusConnect was developed as part of a capstone project, but we believe its utility goes beyond class credit. Our future goals include expanding to multiple campuses, adding event alerts, and making the platform accessible to all users—regardless of tech experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
