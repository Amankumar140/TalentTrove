import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../context/GeneralContext';
import { FaPlus } from 'react-icons/fa';

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

  const statusClass = {
    Available: 'status-available',
    Assigned:  'status-assigned',
    Completed: 'status-completed',
  };

  return (
    <div className="bg-surface text-white min-h-screen p-6 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h3 className="page-title">My Projects</h3>
          <div className="flex gap-3">
            <select
              className="form-input w-auto min-w-[160px] cursor-pointer"
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="" className="bg-surface-200">All Statuses</option>
              <option value="Un Assigned" className="bg-surface-200">Unassigned</option>
              <option value="In Progress" className="bg-surface-200">In Progress</option>
              <option value="Completed" className="bg-surface-200">Completed</option>
            </select>
            <button
              className="btn-blue flex items-center gap-2"
              onClick={() => navigate('/new-project')}
            >
              <FaPlus className="text-xs" /> New Project
            </button>
          </div>
        </div>

        {displayProjects.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <p className="text-4xl mb-4">📋</p>
            <p className="text-gray-400 text-lg">No projects yet.</p>
            <button
              className="btn-blue mt-6 inline-flex items-center gap-2"
              onClick={() => navigate('/new-project')}
            >
              <FaPlus className="text-xs" /> Post Your First Project
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {displayProjects.map((project, i) => (
              <div
                key={project._id}
                className="project-card animate-slide-up"
                style={{animationDelay: `${i * 0.05}s`}}
                onClick={() => navigate(`/client-project/${project._id}`)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                  <span className="text-xs text-gray-500">{new Date(project.postedDate).toLocaleDateString()}</span>
                </div>
                <p className="text-accent-blue font-semibold mt-2">Budget: ${project.budget}</p>
                <p className="text-gray-400 text-sm mt-2 line-clamp-2">{project.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className={statusClass[project.status] || 'status-available'}>
                    {project.status}
                  </span>
                  <span className="text-xs text-gray-500">{project.bids.length} bid{project.bids.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Client;
