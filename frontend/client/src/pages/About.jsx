import React from "react";
import { useNavigate } from "react-router-dom";
import { FaRocket, FaHandshake, FaShieldAlt, FaGlobe } from "react-icons/fa";

const About = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: <FaRocket />,
      title: "Innovation",
      description: "We leverage cutting-edge technology to create seamless connections between freelancers and clients worldwide.",
      gradient: "from-purple-500/20 to-indigo-500/20",
      border: "border-purple-500/20",
    },
    {
      icon: <FaHandshake />,
      title: "Trust",
      description: "Our platform is built on trust and transparency. Every transaction and interaction is secure and fair.",
      gradient: "from-blue-500/20 to-cyan-500/20",
      border: "border-blue-500/20",
    },
    {
      icon: <FaShieldAlt />,
      title: "Quality",
      description: "We ensure that only the highest quality work gets delivered through our rigorous vetting and review system.",
      gradient: "from-emerald-500/20 to-teal-500/20",
      border: "border-emerald-500/20",
    },
    {
      icon: <FaGlobe />,
      title: "Global Reach",
      description: "Connect with talented professionals from around the world, breaking down geographical barriers.",
      gradient: "from-amber-500/20 to-orange-500/20",
      border: "border-amber-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-surface text-white overflow-hidden">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-blue/8 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }}></div>
      </div>

      {/* Navbar */}
      <nav className="w-full fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6 md:px-10">
          <h3
            className="text-xl md:text-2xl font-bold bg-gradient-to-r from-accent-purple to-accent-blue bg-clip-text text-transparent cursor-pointer"
            onClick={() => navigate("/")}
          >
            TalentTrove
          </h3>
          <button
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative pt-32 pb-16 px-6 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-xs font-semibold mb-6 tracking-wide animate-fade-in">
          ABOUT US
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight max-w-3xl mx-auto animate-slide-up">
          <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Empowering Freelancers
          </span>
          <br />
          <span className="bg-gradient-to-r from-accent-purple via-accent-blue to-accent-cyan bg-clip-text text-transparent">
            & Clients Globally
          </span>
        </h1>
        <p className="text-gray-400 text-base md:text-lg mt-6 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
          TalentTrove is a next-generation freelance marketplace designed to connect talented professionals with visionary clients. We believe in creating opportunities that transcend borders.
        </p>
      </div>

      {/* Our Story */}
      <div className="relative max-w-4xl mx-auto px-6 pb-16 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <div className="glass-card p-8 md:p-10">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Our Story</h2>
          <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
            <p>
              Founded with a simple mission — to make freelancing accessible, rewarding, and seamless for everyone. TalentTrove started as an idea to bridge the gap between skilled freelancers and businesses looking for top-tier talent.
            </p>
            <p>
              Today, we serve thousands of freelancers and clients across the globe, facilitating projects in web development, graphic design, content writing, mobile app development, and many more fields. Our platform ensures secure payments, transparent communication, and a fair bidding process.
            </p>
            <p>
              Whether you're a freelancer looking to grow your career or a client seeking the best talent for your project, TalentTrove is the platform built for you.
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="relative max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <span className="section-label">What Drives Us</span>
          <h2 className="text-2xl md:text-3xl font-bold mt-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Our Core Values
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((item, i) => (
            <div
              key={i}
              className={`glass-card p-6 text-center transition-all duration-300 hover:-translate-y-1 border ${item.border} animate-slide-up`}
              style={{ animationDelay: `${0.3 + i * 0.1}s` }}
            >
              <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-xl text-white mb-4`}>
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
