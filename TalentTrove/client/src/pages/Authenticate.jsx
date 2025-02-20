 
import React, { useState } from "react";
import Login from "../components/Login";
import Register from "../components/Register";
import { useNavigate } from "react-router-dom";

const Authenticate = () => {
  const [authType, setAuthType] = useState("login");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d0d12] text-white px-6">
      
      {/* Navbar */}
      <div className="w-full flex justify-between items-center py-4 px-6 md:px-10 bg-opacity-80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 text-white bg-[#11111a] shadow-md">
        <h3 className="text-lg font-semibold cursor-pointer" onClick={() => navigate("/")}>
          SB Works
        </h3>
        <p className="cursor-pointer hover:underline" onClick={() => navigate("/")}>
          Home
        </p>
      </div>

      {/* Authentication Form */}
      <div className="w-full flex items-center justify-center mt-20">
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
