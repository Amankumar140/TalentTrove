import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../context/GeneralContext';

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

  // FIX: was using process.env.REACT_APP_API_BASE_URL (CRA syntax) in a Vite project
  const fetchProjects = async () => {
    try {
      const response = await api.get('/fetch-projects');
      setProjectsCount(response.data.length);
      setCompletedProsCount(response.data.filter((p) => p.status === 'Completed').length);
    } catch (err) {
      console.error(err);
    }
  };

  // FIX: was using process.env.REACT_APP_API_BASE_URL
  const fetchApplications = async () => {
    try {
      const response = await api.get('/fetch-applications');
      setApplicationsCount(response.data.length);
    } catch (err) {
      console.error(err);
    }
  };

  // FIX: was broken multi-line template literal
  const fetchUsers = async () => {
    try {
      const response = await api.get('/fetch-users');
      setUsersCount(response.data.length);
    } catch (err) {
      console.error(err);
    }
  };

  const stats = [
    { title: 'All Projects',       count: projectsCount,      nav: '/admin-projects'     },
    { title: 'Completed Projects', count: completedProsCount,  nav: '/admin-projects'     },
    { title: 'Applications',       count: applicationsCount,   nav: '/admin-applications' },
    { title: 'Users',              count: usersCount,           nav: '/all-users'          },
  ];

  return (
    <div className="bg-[#101214] text-white min-h-screen p-6">
      <h3 className="text-2xl font-bold mb-6 text-blue-300">Admin Dashboard</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div key={index} className="bg-[#2e3439] p-6 rounded-2xl shadow-lg text-center">
            <h4 className="text-lg font-semibold text-[#8cbaeb]">{item.title}</h4>
            <p className="text-3xl font-bold my-3 text-white">{item.count}</p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={() => navigate(item.nav)}
            >
              View {item.title}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
