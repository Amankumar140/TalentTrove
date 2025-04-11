import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../context/GeneralContext';
import { FaProjectDiagram, FaCheckCircle, FaFileAlt, FaUsers } from 'react-icons/fa';

const Admin = () => {
  const navigate = useNavigate();

  const [projectsCount, setProjectsCount] = useState(0);
  const [completedProsCount, setCompletedProsCount] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    fetchProjects();
    fetchApplications();
    fetchUsers();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/fetch-projects');
      setProjectsCount(response.data.length);
      setCompletedProsCount(response.data.filter((p) => p.status === 'Completed').length);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await api.get('/fetch-applications');
      setApplicationsCount(response.data.length);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/fetch-users');
      setUsersCount(response.data.length);
    } catch (err) {
      console.error(err);
    }
  };

  const stats = [
    { title: 'All Projects', count: projectsCount, nav: '/admin-projects', icon: <FaProjectDiagram />, color: 'from-purple-500 to-indigo-600' },
    { title: 'Completed', count: completedProsCount, nav: '/admin-projects', icon: <FaCheckCircle />, color: 'from-emerald-500 to-teal-600' },
    { title: 'Applications', count: applicationsCount, nav: '/admin-applications', icon: <FaFileAlt />, color: 'from-blue-500 to-cyan-600' },
    { title: 'Users', count: usersCount, nav: '/all-users', icon: <FaUsers />, color: 'from-amber-500 to-orange-600' },
  ];

  return (
    <div className="bg-surface text-white min-h-screen p-6 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <h3 className="page-title mb-8">Admin Dashboard</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((item, index) => (
            <div
              key={index}
              className="stat-card group cursor-pointer"
              onClick={() => navigate(item.nav)}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-sm mb-3 mx-auto`}>
                {item.icon}
              </div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{item.title}</p>
              <p className="text-3xl font-bold mt-1 text-white">{item.count}</p>
              <p className="text-xs text-accent-blue mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                View Details →
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
