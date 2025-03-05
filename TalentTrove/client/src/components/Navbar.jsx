
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GeneralContext } from "../context/GeneralContext";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
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
    setIsOpen(false); // Close the menu after clicking
  };

  return (
    <nav className="w-full bg-black shadow-lg">
      <div className="flex justify-between items-center py-4 px-6 md:px-10 text-white">
        
        {/* Logo */}
        <h3 className="text-xl md:text-2xl font-bold text-blue-300">
          TalentTrove {usertype === "admin" && "(Admin)"}
        </h3>

        {/* Mobile Menu Icon */}
        <div className="md:hidden cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 text-gray-300">
          {menuItems[usertype]?.map((item) => (
            <p key={item.path} onClick={() => handleNavigate(item.path)} className="hover:text-white cursor-pointer">
              {item.label}
            </p>
          ))}
          <p onClick={logout} className="hover:text-red-400 cursor-pointer">Logout</p>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-black text-gray-300 flex flex-col items-center py-4 space-y-3 border-t border-gray-700">
          {menuItems[usertype]?.map((item) => (
            <p key={item.path} onClick={() => handleNavigate(item.path)} className="hover:text-white cursor-pointer">
              {item.label}
            </p>
          ))}
          <p onClick={logout} className="hover:text-red-400 cursor-pointer">Logout</p>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
