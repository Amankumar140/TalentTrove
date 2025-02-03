


import React, { useContext } from "react";
import { GeneralContext } from "../context/GeneralContext";
import { FaGoogle } from "react-icons/fa";

const Login = ({ setAuthType }) => {
  const { setEmail, setPassword, login } = useContext(GeneralContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    await login();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0d0d12] text-white px-6 sm:px-4">
      <div className="bg-[#11111a] p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg relative overflow-hidden">
        
        {/* Floating Gradient Circles */}
        <div className="absolute top-[-40px] left-[-20px] w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-2xl opacity-30"></div>
        <div className="absolute top-5 right-[-15px] w-14 h-14 sm:w-16 sm:h-16 bg-gray-600 rounded-full blur-lg opacity-40"></div>

        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-5">Sign In</h2>
 

        {/* Email Input */}
        <input
          type="email"
          placeholder="E-mail"
          className="w-full px-4 py-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3 text-sm sm:text-base"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4 text-sm sm:text-base"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Sign In Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-80 transition duration-300 text-white py-2 rounded-md font-semibold text-sm sm:text-base"
          onClick={handleLogin}
        >
          Sign In
        </button>

        {/* Register & Forgot Password Links */}
        <p className="text-center text-gray-400 mt-4 text-sm sm:text-base">
          Don't have an account?{" "}
          <span
            onClick={() => setAuthType("register")}
            className="text-white font-semibold cursor-pointer hover:underline"
          >
            Create an account
          </span>
        </p>
         
      </div>
    </div>
  );
};

export default Login;

