

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Landing = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const userType = localStorage.getItem("usertype");
    if (userType === "freelancer") {
      navigate("/freelancer");
    } else if (userType === "client") {
      navigate("/client");
    } else if (userType === "admin") {
      navigate("/admin");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center py-3 px-6 md:px-10 bg-gradient-to-br from-gray-900 to-black bg-opacity-90 fixed top-0 left-0 right-0 z-50 transition-all duration-300">


        <h3 className="text-xl md:text-2xl font-bold text-purple-400">SB Works</h3>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <button className="text-gray-300 hover:text-white transition">Home</button>
          <button className="text-gray-300 hover:text-white transition">About</button>
          <button className="text-gray-300 hover:text-white transition">Services</button>
          <button className="text-gray-300 hover:text-white transition">Contact</button>
        </div>

        {/* Mobile Menu Icon */}
        <button className="md:hidden text-gray-300" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-16 left-0 w-full bg-black bg-opacity-90 flex flex-col items-center space-y-4 py-6 md:hidden">
            <button className="text-gray-300 hover:text-white transition">Home</button>
            <button className="text-gray-300 hover:text-white transition">About</button>
            <button className="text-gray-300 hover:text-white transition">Services</button>
            <button className="text-gray-300 hover:text-white transition">Contact</button>
          </div>
        )}

        <button
          onClick={() => navigate("/authenticate")}
          className="hidden md:block bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-full transition duration-300"
        >
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-24 md:py-32 lg:py-40 mt-16">
        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight max-w-3xl">
          Start and Build Your Freelance Career Here
        </h1>
        <p className="text-sm md:text-lg text-gray-400 mt-4 max-w-xl">
          Only at SB Works, you can connect with clients, build a great portfolio, and explore amazing job opportunities.
        </p>
        <button
          onClick={() => navigate("/authenticate")}
          className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full text-sm md:text-lg font-semibold transition duration-300"
        >
          Get Started
        </button>
      </div>

      {/* Market Trend Section */}
      <div className="px-6 md:px-10 pb-16">
        <h2 className="text-xl md:text-2xl font-semibold text-white">Trending Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg">
            <h3 className="text-lg md:text-xl font-semibold">Web Development</h3>
            <p className="text-gray-400 mt-2">$500 - $2000</p>
          </div>
          <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg">
            <h3 className="text-lg md:text-xl font-semibold">Graphic Design</h3>
            <p className="text-gray-400 mt-2">$100 - $1000</p>
          </div>
          <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg">
            <h3 className="text-lg md:text-xl font-semibold">Content Writing</h3>
            <p className="text-gray-400 mt-2">$50 - $500</p>
          </div>
          <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg">
            <h3 className="text-lg md:text-xl font-semibold">Mobile App Dev</h3>
            <p className="text-gray-400 mt-2">$1000 - $5000</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
