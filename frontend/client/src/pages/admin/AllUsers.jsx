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

  const roleConfig = {
    freelancer: { class: 'status-available', label: 'Freelancer', gradient: 'from-purple-500 to-indigo-600' },
    client:     { class: 'status-completed', label: 'Client', gradient: 'from-blue-500 to-cyan-600' },
    admin:      { class: 'status-rejected', label: 'Admin', gradient: 'from-rose-500 to-pink-600' },
  };

  return (
    <div className="min-h-screen bg-surface text-white px-4 py-6 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h3 className="page-title">All Users</h3>
          <span className="text-sm text-gray-500">{users.length} total</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {users.map((user, i) => {
            const config = roleConfig[user.usertype] || roleConfig.freelancer;
            return (
              <div key={user._id} className="glass-card p-5 animate-slide-up" style={{animationDelay: `${i * 0.03}s`}}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}>
                    {user.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-white truncate">{user.username}</h4>
                      <span className={`${config.class} flex-shrink-0`}>
                        {config.label}
                      </span>
                    </div>
                    <p className="text-accent-blue text-xs mt-1 truncate">{user.email}</p>
                    {/* <p className="text-gray-600 text-[10px] mt-1 font-mono truncate">ID: {user._id}</p> */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
