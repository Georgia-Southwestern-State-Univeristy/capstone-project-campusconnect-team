import React from "react";
import { Link } from "react-router-dom";

const Contact = () => {
  return (
    <div className="min-h-screen bg-navy text-white">
      {/* Nav */}
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

      <div className="p-10 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gold mb-6">Contact Us</h1>
        <p className="text-lg mb-4">
          Have questions, feedback, or ideas? We'd love to hear from you!
        </p>

        <div className="bg-white text-navy rounded-lg p-6 shadow-lg space-y-4">
          <div>
            <p className="font-bold">📧 Email:</p>
            <p>campusconnect@gsw.edu</p>
          </div>
          <div>
            <p className="font-bold">📞 Phone:</p>
            <p>(229) 555-1234</p>
          </div>
          <div>
            <p className="font-bold">📍 Office Location:</p>
            <p>Marshall Student Center, Room 204</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
