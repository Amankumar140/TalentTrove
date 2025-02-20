
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

  return (
    <nav className="w-full bg-black shadow-lg">
      <div className="flex justify-between items-center py-4 px-6 md:px-10 text-white">
        
        {/* Logo */}
        <h3 className="text-xl md:text-2xl font-bold text-purple-400">
          SB Works {usertype === "admin" && "(Admin)"}
        </h3>

        {/* Mobile Menu Icon */}
        <div className="md:hidden cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-6 text-gray-300">
          {usertype === "freelancer" && (
            <>
              <p onClick={() => navigate("/freelancer")} className="hover:text-white cursor-pointer">Dashboard</p>
              <p onClick={() => navigate("/all-projects")} className="hover:text-white cursor-pointer">All Projects</p>
              <p onClick={() => navigate("/my-projects")} className="hover:text-white cursor-pointer">My Projects</p>
              <p onClick={() => navigate("/myApplications")} className="hover:text-white cursor-pointer">Applications</p>
            </>
          )}

          {usertype === "client" && (
            <>
              <p onClick={() => navigate("/client")} className="hover:text-white cursor-pointer">Dashboard</p>
              <p onClick={() => navigate("/new-project")} className="hover:text-white cursor-pointer">New Project</p>
              <p onClick={() => navigate("/project-applications")} className="hover:text-white cursor-pointer">Applications</p>
            </>
          )}

          {usertype === "admin" && (
            <>
              <p onClick={() => navigate("/admin")} className="hover:text-white cursor-pointer">Home</p>
              <p onClick={() => navigate("/all-users")} className="hover:text-white cursor-pointer">All Users</p>
              <p onClick={() => navigate("/admin-projects")} className="hover:text-white cursor-pointer">Projects</p>
              <p onClick={() => navigate("/admin-applications")} className="hover:text-white cursor-pointer">Applications</p>
            </>
          )}

          <p onClick={logout} className="hover:text-red-400 cursor-pointer">Logout</p>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-black text-gray-300 flex flex-col items-center py-4 space-y-3 border-t border-gray-700">
          {usertype === "freelancer" && (
            <>
              <p onClick={() => navigate("/freelancer")} className="hover:text-white cursor-pointer">Dashboard</p>
              <p onClick={() => navigate("/all-projects")} className="hover:text-white cursor-pointer">All Projects</p>
              <p onClick={() => navigate("/my-projects")} className="hover:text-white cursor-pointer">My Projects</p>
              <p onClick={() => navigate("/myApplications")} className="hover:text-white cursor-pointer">Applications</p>
            </>
          )}

          {usertype === "client" && (
            <>
              <p onClick={() => navigate("/client")} className="hover:text-white cursor-pointer">Dashboard</p>
              <p onClick={() => navigate("/new-project")} className="hover:text-white cursor-pointer">New Project</p>
              <p onClick={() => navigate("/project-applications")} className="hover:text-white cursor-pointer">Applications</p>
            </>
          )}

          {usertype === "admin" && (
            <>
              <p onClick={() => navigate("/admin")} className="hover:text-white cursor-pointer">Home</p>
              <p onClick={() => navigate("/all-users")} className="hover:text-white cursor-pointer">All Users</p>
              <p onClick={() => navigate("/admin-projects")} className="hover:text-white cursor-pointer">Projects</p>
              <p onClick={() => navigate("/admin-applications")} className="hover:text-white cursor-pointer">Applications</p>
            </>
          )}

          <p onClick={logout} className="hover:text-red-400 cursor-pointer">Logout</p>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
