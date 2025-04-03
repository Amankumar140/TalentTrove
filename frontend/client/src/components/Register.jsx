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
      <div className="glass-card gradient-border p-8 sm:p-10 w-full max-w-md relative overflow-hidden animate-scale-in">
        {/* Background glow */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-accent-purple/20 rounded-full blur-3xl animate-glow-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-accent-blue/15 rounded-full blur-3xl animate-glow-pulse" style={{animationDelay: '1.5s'}}></div>

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="text-gray-500 text-sm mt-2">Join TalentTrove today</p>
        </div>

        {/* Form */}
        <div className="space-y-4 relative z-10">
          <div>
            <label className="section-label mb-2 block">Username</label>
            <input
              type="text"
              placeholder="johndoe"
              className="form-input"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="section-label mb-2 block">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="form-input"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="section-label mb-2 block">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="form-input"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="section-label mb-2 block">I am a...</label>
            <select
              className="form-input cursor-pointer"
              onChange={(e) => setUsertype(e.target.value)}
            >
              <option value="" className="bg-surface-200">Select User Type</option>
              <option value="freelancer" className="bg-surface-200">Freelancer</option>
              <option value="client" className="bg-surface-200">Client</option>
              <option value="admin" className="bg-surface-200">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn-primary w-full mt-2"
            onClick={handleRegister}
          >
            Create Account
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 mt-6 text-sm relative z-10">
          Already have an account?{" "}
          <span
            onClick={() => setAuthType("login")}
            className="text-accent-purple font-semibold cursor-pointer hover:text-purple-300 transition-colors"
          >
            Sign in
          </span>
        </p>
      </div>
  );
};

export default Register;
