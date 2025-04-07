import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../context/GeneralContext';
import { FaSearch } from 'react-icons/fa';

const AllProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [displayProjects, setDisplayProjects] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/fetch-projects');
      const data = response.data;
      setProjects(data);
      setDisplayProjects([...data].reverse());

      const skillsSet = new Set();
      data.forEach((project) => {
        project.skills.forEach((skill) => skillsSet.add(skill));
      });
      setAllSkills([...skillsSet]);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const handleCategoryCheckBox = (e) => {
    const value = e.target.value;
    setCategoryFilter((prev) =>
      e.target.checked ? [...prev, value] : prev.filter((skill) => skill !== value)
    );
  };

  useEffect(() => {
    if (categoryFilter.length > 0) {
      setDisplayProjects(
        [...projects]
          .filter((project) => categoryFilter.every((skill) => project.skills.includes(skill)))
          .reverse()
      );
    } else {
      setDisplayProjects([...projects].reverse());
    }
  }, [categoryFilter, projects]);

  return (
    <div className="bg-surface min-h-screen p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Filters */}
        <div className="md:col-span-3">
          <div className="glass-card p-5 sticky top-20">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <FaSearch className="text-accent-purple text-xs" /> Filters
            </h3>
            <div className="h-px bg-white/[0.06] my-3"></div>
            <p className="section-label mb-3">Skills</p>
            <div className="space-y-2">
              {allSkills.map((skill) => (
                <label key={skill} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    value={skill}
                    onChange={handleCategoryCheckBox}
                    className="w-4 h-4 rounded border-gray-600 bg-surface-300 text-accent-purple focus:ring-accent-purple focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{skill}</span>
                </label>
              ))}
            </div>
            {categoryFilter.length > 0 && (
              <p className="text-xs text-gray-500 mt-3">{displayProjects.length} project{displayProjects.length !== 1 ? 's' : ''} found</p>
            )}
          </div>
        </div>

        {/* Projects List */}
        <div className="md:col-span-9">
          <div className="flex items-center justify-between mb-6">
            <h3 className="page-title">All Projects</h3>
            <span className="text-sm text-gray-500">{displayProjects.length} projects</span>
          </div>
          {displayProjects.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-gray-500">No projects found.</p>
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
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                    <span className="text-xs text-gray-500">{new Date(project.postedDate).toLocaleDateString()}</span>
                  </div>
                  <p className="text-emerald-400 font-semibold mt-2">${project.budget}</p>
                  <p className="text-gray-400 text-sm mt-2 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap mt-3 gap-2">
                    {project.skills.map((skill) => (
                      <span key={skill} className="skill-pill">{skill}</span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
                    <span>{project.bids.length} bid{project.bids.length !== 1 ? 's' : ''}</span>
                    <span>
                      Avg Bid: $
                      {project.bids.length > 0
                        ? Math.round(project.bidAmounts.reduce((a, c) => a + c, 0) / project.bids.length)
                        : 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProjects;
