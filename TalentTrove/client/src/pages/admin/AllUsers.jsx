 
import React, { useEffect, useState } from "react";
import axios from "axios";

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    await axios
      .get(`${import.meta.env.VITE_API_BASE_URL}
/fetch-users`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#101214] text-white px-4 py-6">
      <h3 className="text-2xl font-semibold text-purple-700 mb-6">All Users</h3>

      {/* Grid layout for desktop, stacked for mobile */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user._id} className="bg-[#2e3434] p-4 rounded-xl shadow-lg text-center border border-gray-700">
            <span className="block">
              <b className="text-purple-300">User ID:</b>
              <p className="text-[#5c9de3] break-words">{user._id}</p>
            </span>
            <span className="block mt-2">
              <b className="text-purple-200">Username:</b>
              <p className="text-[#5c9de3]">{user.username}</p>
            </span>
            <span className="block mt-2">
              <b className="text-purple-200">Email:</b>
              <p className="text-[#5c9de3] break-words">{user.email}</p>
            </span>
            <span className="block mt-2">
              <b className="text-purple-200">User Role:</b>
              <p className="text-[#b5c5d6]">{user.usertype}</p>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;
