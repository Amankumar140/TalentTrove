import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../context/GeneralContext';

const MyProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [displayProjects, setDisplayProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/fetch-projects');
      const filteredProjects = response.data.filter(
        (pro) => pro.freelancerId === localStorage.getItem('userId')
      );
      setProjects(filteredProjects);
      setDisplayProjects([...filteredProjects].reverse());
    } catch (err) {
      console.error(err);
    }
  };

  const handleFilterChange = (data) => {
    if (data === '') {
      setDisplayProjects([...projects].reverse());
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
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">My Projects</h3>
          <select
            className="bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-600 mt-3 md:mt-0"
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {displayProjects.length === 0 ? (
          <p className="text-gray-400">No projects assigned to you yet.</p>
        ) : (
          <div className="space-y-6">
            {displayProjects.map((project) => (
              <div
                key={project._id}
                className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 cursor-pointer transition"
                onClick={() => navigate(`/project/${project._id}`)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <p className="text-gray-400 text-sm">{new Date(project.postedDate).toLocaleDateString()}</p>
                </div>
                <h5 className="text-green-400 text-lg font-semibold mt-2">Budget: ${project.budget}</h5>
                <p className="text-gray-300 mt-2">{project.description}</p>
                <p className="mt-3 text-sm">
                  Status:{' '}
                  <span className={`font-bold ${statusColor[project.status] || 'text-white'}`}>
                    {project.status}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects;
