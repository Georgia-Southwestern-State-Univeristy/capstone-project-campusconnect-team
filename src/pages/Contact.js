import React from "react";
import { Link } from "react-router-dom";

// Team Info
const team = [
  {
    name: "Shaylan Daniel",
    role: "Project Manager",
    bio: "Organized team workflow, tested features, and assisted both frontend and backend roles.",
    email: "sdanie27@radar.gsw.edu",
    image: "/shaylan.jpeg"
  },
  {
    name: "Sophia Aparicio-Malacara",
    role: "Lead Developer & Frontend Designer",
    bio: "Set up the frameworks, built UI, and interactive map experience with performance optimizations.",
    email: "japarici@radar.edu",
    image: "/sophia-aparicio-malacara.JPG"
  },
  {
    name: "Anjali Patel",
    role: "Backend & Firebase Developer",
    bio: "Integrated the Firestore backend and AI-driven search capabilities.",
    email: "apatel19@radar.gsw.edu",
    image: "/anjali.jpeg"
  }
];

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

      {/* Main Container */}
      <div className="p-10 max-w-6xl mx-auto space-y-16">

        {/* Team Section */}
        <section>
          <h1 className="text-4xl font-bold text-gold mb-6">Meet the Team</h1>
          <p className="text-lg mb-8">
            CampusConnect was made possible by a small team of passionate students who contributed their time, creativity, and technical expertise to build something meaningful for the GSW community.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {team.map((member, idx) => (
              <div key={idx} className="bg-white text-navy rounded-xl p-6 shadow-md hover:shadow-xl transition">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 object-cover rounded-full mx-auto mb-4 border-2 border-navy"
                />
                <h2 className="text-xl font-bold">{member.name}</h2>
                <p className="text-sm text-gray-600 mb-2">{member.role}</p>
                <p className="text-gray-800 mb-2">{member.bio}</p>
                <a href={`mailto:${member.email}`} className="text-sm text-blue-600 hover:underline block text-center">
                  {member.email}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section>
          <h2 className="text-4xl font-bold text-gold mb-6">Contact Us</h2>
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
        </section>
      </div>
    </div>
  );
};

export default Contact;
