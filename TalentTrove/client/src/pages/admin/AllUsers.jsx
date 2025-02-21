 
import React, { useEffect, useState } from "react";
import axios from "axios";

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    await axios
      .get("http://localhost:6001/fetch-users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white px-4 py-6">
      <h3 className="text-2xl font-semibold text-purple-400 mb-6">All Users</h3>

      {/* Grid layout for desktop, stacked for mobile */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user._id} className="bg-gray-900 p-4 rounded-xl shadow-lg text-center border border-gray-700">
            <span className="block">
              <b className="text-purple-400">User ID:</b>
              <p className="text-gray-300 break-words">{user._id}</p>
            </span>
            <span className="block mt-2">
              <b className="text-purple-400">Username:</b>
              <p className="text-gray-300">{user.username}</p>
            </span>
            <span className="block mt-2">
              <b className="text-purple-400">Email:</b>
              <p className="text-gray-300 break-words">{user.email}</p>
            </span>
            <span className="block mt-2">
              <b className="text-purple-400">User Role:</b>
              <p className="text-yellow-400">{user.usertype}</p>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;
