
import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GeneralContext } from "../context/GeneralContext";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(GeneralContext);
  const usertype = localStorage.getItem("usertype");
  const [isOpen, setIsOpen] = useState(false);

  if (!["freelancer", "client", "admin"].includes(usertype)) return null;

  const menuItems = {
    freelancer: [
      { label: "Dashboard", path: "/freelancer" },
      { label: "All Projects", path: "/all-projects" },
      { label: "My Projects", path: "/my-projects" },
      { label: "Applications", path: "/myApplications" },
    ],
    client: [
      { label: "Dashboard", path: "/client" },
      { label: "New Project", path: "/new-project" },
      { label: "Applications", path: "/project-applications" },
    ],
    admin: [
      { label: "Home", path: "/admin" },
      { label: "All Users", path: "/all-users" },
      { label: "Projects", path: "/admin-projects" },
      { label: "Applications", path: "/admin-applications" },
    ],
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-surface-50/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-6">
        {/* Logo */}
        <h3
          className="text-xl font-bold bg-gradient-to-r from-accent-purple to-accent-blue bg-clip-text text-transparent cursor-pointer"
          onClick={() => handleNavigate(menuItems[usertype]?.[0]?.path || "/")}
        >
          TalentTrove {usertype === "admin" && <span className="text-xs text-gray-500 font-normal ml-1">(Admin)</span>}
        </h3>

        {/* Mobile Menu Icon */}
        <div
          className="md:hidden cursor-pointer text-gray-400 hover:text-white transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {menuItems[usertype]?.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-accent-purple/10 text-accent-purple"
                  : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="w-px h-6 bg-white/[0.08] mx-2"></div>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-400/[0.06] transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-surface-100/95 backdrop-blur-xl border-t border-white/[0.06] animate-slide-down">
          <div className="flex flex-col py-2 px-4">
            {menuItems[usertype]?.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`px-4 py-3 rounded-lg text-sm font-medium text-left transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-accent-purple/10 text-accent-purple"
                    : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="h-px bg-white/[0.06] my-1"></div>
            <button
              onClick={logout}
              className="px-4 py-3 rounded-lg text-sm font-medium text-left text-gray-400 hover:text-red-400 hover:bg-red-400/[0.06] transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
