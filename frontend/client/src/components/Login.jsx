
import React, { useContext } from "react";
import { GeneralContext } from "../context/GeneralContext";

const Login = ({ setAuthType }) => {
  const { setEmail, setPassword, login } = useContext(GeneralContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    await login();
  };

  return (
      <div className="glass-card gradient-border p-8 sm:p-10 w-full max-w-md relative overflow-hidden animate-scale-in">
        {/* Background glow */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-accent-purple/20 rounded-full blur-3xl animate-glow-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-accent-blue/15 rounded-full blur-3xl animate-glow-pulse" style={{animationDelay: '1.5s'}}></div>

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-sm mt-2">Sign in to your account</p>
        </div>

        {/* Form */}
        <div className="space-y-4 relative z-10">
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

          <button
            type="submit"
            className="btn-primary w-full mt-2"
            onClick={handleLogin}
          >
            Sign In
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 mt-6 text-sm relative z-10">
          Don't have an account?{" "}
          <span
            onClick={() => setAuthType("register")}
            className="text-accent-purple font-semibold cursor-pointer hover:text-purple-300 transition-colors"
          >
            Create an account
          </span>
        </p>
      </div>
  );
};

export default Login;
