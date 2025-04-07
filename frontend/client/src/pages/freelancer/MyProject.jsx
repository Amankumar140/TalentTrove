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

  const statusClass = {
    Available: 'status-available',
    Assigned:  'status-assigned',
    Completed: 'status-completed',
  };

  return (
    <div className="min-h-screen bg-surface p-6 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h3 className="page-title">My Projects</h3>
          <select
            className="form-input w-auto min-w-[160px] cursor-pointer"
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="" className="bg-surface-200">All Statuses</option>
            <option value="In Progress" className="bg-surface-200">In Progress</option>
            <option value="Completed" className="bg-surface-200">Completed</option>
          </select>
        </div>

        {displayProjects.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-gray-500">No projects assigned to you yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayProjects.map((project, i) => (
              <div
                key={project._id}
                className="project-card animate-slide-up"
                style={{animationDelay: `${i * 0.05}s`}}
                onClick={() => navigate(`/project/${project._id}`)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                  <span className="text-xs text-gray-500">{new Date(project.postedDate).toLocaleDateString()}</span>
                </div>
                <p className="text-emerald-400 font-semibold mt-2">${project.budget}</p>
                <p className="text-gray-400 text-sm mt-2 line-clamp-2">{project.description}</p>
                <div className="mt-4 flex items-center gap-3">
                  <span className={statusClass[project.status] || 'status-available'}>
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects;
