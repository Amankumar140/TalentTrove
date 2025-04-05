
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaCode, FaPaintBrush, FaPen, FaMobileAlt, FaArrowRight, FaUsers, FaProjectDiagram, FaStar } from "react-icons/fa";

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

  const trendingProjects = [
    { title: "Web Development", range: "$500 - $2000", icon: <FaCode />, gradient: "from-purple-500/20 to-blue-500/20", border: "border-purple-500/20" },
    { title: "Graphic Design", range: "$100 - $1000", icon: <FaPaintBrush />, gradient: "from-rose-500/20 to-pink-500/20", border: "border-rose-500/20" },
    { title: "Content Writing", range: "$50 - $500", icon: <FaPen />, gradient: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/20" },
    { title: "Mobile App Dev", range: "$1000 - $5000", icon: <FaMobileAlt />, gradient: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/20" },
  ];

  const stats = [
    { icon: <FaUsers />, number: "5K+", label: "Freelancers" },
    { icon: <FaProjectDiagram />, number: "10k+", label: "Projects" },
    { icon: <FaStar />, number: "4.5", label: "Rating" },
  ];

  return (
    <div className="min-h-screen bg-surface text-white overflow-hidden">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 -right-32 w-96 h-96 bg-accent-blue/8 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent-cyan/5 rounded-full blur-3xl animate-glow-pulse"></div>
      </div>

      {/* Navbar */}
      <nav className="w-full fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6 md:px-10">
          <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-accent-purple to-accent-blue bg-clip-text text-transparent">
            TalentTrove
          </h3>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate("/about")} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">About</button>
            <button onClick={() => navigate("/contact")} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Contact</button>
            <button
              onClick={() => navigate("/authenticate")}
              className="btn-primary"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <button className="md:hidden text-gray-400 hover:text-white transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-surface-100/95 backdrop-blur-xl border-t border-white/[0.06] animate-slide-down">
            <div className="flex flex-col py-3 px-6 gap-1">
              <button onClick={() => { navigate("/about"); setMenuOpen(false); }} className="text-gray-400 hover:text-white transition-colors py-3 text-left text-sm">About</button>
              <button onClick={() => { navigate("/contact"); setMenuOpen(false); }} className="text-gray-400 hover:text-white transition-colors py-3 text-left text-sm">Contact</button>
              <button
                onClick={() => navigate("/authenticate")}
                className="btn-primary text-center mt-2"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center text-center px-6 pt-40 pb-20 md:pt-48 md:pb-28">
        <div className="animate-fade-in">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-xs font-semibold mb-6 tracking-wide">
            🚀 THE FUTURE OF FREELANCING
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight max-w-4xl animate-slide-up">
          <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Build Your Freelance
          </span>
          <br />
          <span className="bg-gradient-to-r from-accent-purple via-accent-blue to-accent-cyan bg-clip-text text-transparent">
            Career Today
          </span>
        </h1>
        <p className="text-base md:text-lg text-gray-400 mt-6 max-w-2xl leading-relaxed animate-slide-up" style={{animationDelay: '0.1s'}}>
          Where top freelancers and ambitious clients connect seamlessly.
          Showcase your skills, land premium projects, and build a thriving career.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-10 animate-slide-up" style={{animationDelay: '0.2s'}}>
          <button
            onClick={() => navigate("/authenticate")}
            className="btn-emerald flex items-center justify-center gap-2 px-8 py-3 text-base"
          >
            Get Started <FaArrowRight className="text-sm" />
          </button>
          <button
            onClick={() => navigate("/authenticate")}
            className="px-8 py-3 rounded-xl text-base font-semibold text-gray-300 border border-white/[0.1] hover:border-white/[0.2] hover:bg-white/[0.04] transition-all duration-300"
          >
            Learn More
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-8 md:gap-16 mt-16 animate-slide-up" style={{animationDelay: '0.3s'}}>
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-accent-purple text-lg mb-1">{stat.icon}</div>
              <p className="text-2xl md:text-3xl font-bold text-white">{stat.number}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Projects Section */}
      <div className="relative px-6 md:px-10 pb-24 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="section-label">Popular Categories</span>
          <h2 className="text-2xl md:text-3xl font-bold mt-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Trending Projects
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProjects.map((item, i) => (
            <div
              key={i}
              className={`glass-card p-6 text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 border ${item.border}`}
              style={{animationDelay: `${i * 0.1}s`}}
            >
              <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-xl text-white mb-4`}>
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="text-gray-500 text-sm mt-2">{item.range}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;
