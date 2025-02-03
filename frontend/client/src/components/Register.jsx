import React, { useContext } from "react";
import { GeneralContext } from "../context/GeneralContext";

const Register = ({ setAuthType }) => {
  const { setUsername, setEmail, setPassword, setUsertype, register } =
    useContext(GeneralContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    await register();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0d0d12] text-white px-6 sm:px-4">
      <div className="bg-[#11111a] p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg relative overflow-hidden">
        {/* Floating Gradient Circles */}
        <div className="absolute top-[-40px] left-[-20px] w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-2xl opacity-30"></div>
        <div className="absolute top-5 right-[-15px] w-14 h-14 sm:w-16 sm:h-16 bg-gray-600 rounded-full blur-lg opacity-40"></div>

        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-5">
          Register
        </h2>

        {/* Username Input */}
        <input
          type="text"
          placeholder="Username"
          className="w-full px-4 py-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-3 text-sm sm:text-base"
          onChange={(e) => setUsername(e.target.value)}
        />

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

        {/* User Type Dropdown */}
        <select
          className="w-full px-4 py-2 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4 text-sm sm:text-base"
          onChange={(e) => setUsertype(e.target.value)}
        >
          <option value="" className="bg-black text-white">
            Select User Type
          </option>
          <option value="freelancer" className="bg-black text-white">
            Freelancer
          </option>
          <option value="client" className="bg-black text-white">
            Client
          </option>
          <option value="admin" className="bg-black text-white">
            Admin
          </option>
        </select>

        {/* Register Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-80 transition duration-300 text-white py-2 rounded-md font-semibold text-sm sm:text-base"
          onClick={handleRegister}
        >
          Sign Up
        </button>

        {/* Switch to Login */}
        <p className="text-center text-gray-400 mt-4 text-sm sm:text-base">
          Already registered?{" "}
          <span
            onClick={() => setAuthType("login")}
            className="text-white font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
