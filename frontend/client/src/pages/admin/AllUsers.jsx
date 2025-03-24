import React, { useEffect, useState } from 'react';
import { api } from '../../context/GeneralContext';

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/fetch-users');
      setUsers(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const roleColor = {
    freelancer: 'bg-indigo-700 text-indigo-100',
    client:     'bg-green-800 text-green-100',
    admin:      'bg-red-900 text-red-100',
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#101214] text-white px-4 py-6">
      <h3 className="text-2xl font-semibold text-blue-300 mb-6">All Users ({users.length})</h3>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user._id} className="bg-[#2e3434] p-4 rounded-xl shadow-lg border border-gray-700">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-lg font-semibold text-white">{user.username}</h4>
              <span className={`text-xs px-2 py-1 rounded-full capitalize ${roleColor[user.usertype] || 'bg-gray-600'}`}>
                {user.usertype}
              </span>
            </div>
            <p className="text-blue-300 text-sm break-words">{user.email}</p>
            <p className="text-gray-500 text-xs mt-2 break-words">ID: {user._id}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllUsers;
