 
import React, { useState } from "react";
import Login from "../components/Login";
import Register from "../components/Register";
import { useNavigate } from "react-router-dom";

const Authenticate = () => {
  const [authType, setAuthType] = useState("login");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface text-white px-6 relative overflow-auto">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-80 h-80 bg-accent-purple/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-accent-blue/8 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Navbar */}
      <div className="w-full fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-white/[0.06]">
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
      </div>

      {/* Authentication Form */}
      <div className="w-full flex items-center justify-center min-h-screen pt-20 pb-10 relative z-10">
        {authType === "login" ? (
          <Login setAuthType={setAuthType} />
        ) : (
          <Register setAuthType={setAuthType} />
        )}
      </div>
    </div>
  );
};

export default Authenticate;
