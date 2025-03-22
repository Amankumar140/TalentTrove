import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../context/GeneralContext';

const Client = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [displayProjects, setDisplayProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/fetch-projects');
      const pros = response.data.filter(
        (pro) => pro.clientId === localStorage.getItem('userId')
      );
      setProjects(pros);
      setDisplayProjects([...pros].reverse());
    } catch (err) {
      console.error(err);
    }
  };

  const handleFilterChange = (data) => {
    if (data === '') {
      setDisplayProjects([...projects].reverse());
    } else if (data === 'Un Assigned') {
      setDisplayProjects([...projects].filter((p) => p.status === 'Available').reverse());
    } else if (data === 'In Progress') {
      setDisplayProjects([...projects].filter((p) => p.status === 'Assigned').reverse());
    } else if (data === 'Completed') {
      setDisplayProjects([...projects].filter((p) => p.status === 'Completed').reverse());
    }
  };

  const statusColor = {
    Available: 'text-green-400',
    Assigned:  'text-yellow-400',
    Completed: 'text-blue-400',
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-blue-400">My Projects</h3>
          <div className="flex gap-3 mt-3 md:mt-0">
            <select
              className="border border-gray-700 rounded-md p-2 bg-gray-800 text-white focus:outline-none"
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Un Assigned">Unassigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
              onClick={() => navigate('/new-project')}
            >
              + New Project
            </button>
          </div>
        </div>
        <hr className="mb-4 border-gray-700" />
        {displayProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No projects yet.</p>
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition"
              onClick={() => navigate('/new-project')}
            >
              Post Your First Project
            </button>
          </div>
        ) : (
          displayProjects.map((project) => (
            <div
              key={project._id}
              className="bg-gray-800 p-4 rounded-lg shadow-md mb-3 cursor-pointer hover:bg-gray-700 transition"
              onClick={() => navigate(`/client-project/${project._id}`)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-blue-300">{project.title}</h3>
                <p className="text-gray-500 text-sm">{new Date(project.postedDate).toLocaleDateString()}</p>
              </div>
              <h5 className="text-lg font-medium text-blue-400 mt-2">Budget — ${project.budget}</h5>
              <p className="text-gray-400 mt-2">{project.description}</p>
              <div className="mt-3 flex justify-between items-center text-sm">
                <span>
                  Status:{' '}
                  <span className={`font-semibold ${statusColor[project.status] || 'text-white'}`}>
                    {project.status}
                  </span>
                </span>
                <span className="text-gray-500">{project.bids.length} bids</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Client;
