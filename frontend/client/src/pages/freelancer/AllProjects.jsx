import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../context/GeneralContext';

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
      // FIX: removed recursive fetchProjects() call that caused infinite retry loop
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
    <div className="bg-gray-900 min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Filters */}
        <div className="md:col-span-3 bg-gray-800 p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold">Filters</h3>
          <hr className="my-2 border-gray-600" />
          <h5 className="text-lg font-semibold">Skills</h5>
          <div className="mt-2 space-y-2">
            {allSkills.map((skill) => (
              <div key={skill} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={skill}
                  onChange={handleCategoryCheckBox}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label className="text-sm">{skill}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Projects List */}
        <div className="md:col-span-9">
          <h3 className="text-2xl font-bold mb-4">All Projects</h3>
          {displayProjects.length === 0 ? (
            <p className="text-gray-400">No projects found.</p>
          ) : (
            <div className="space-y-4">
              {displayProjects.map((project) => (
                <div
                  key={project._id}
                  className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 cursor-pointer transition"
                  onClick={() => navigate(`/project/${project._id}`)}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                    <p className="text-gray-400 text-sm">{new Date(project.postedDate).toLocaleDateString()}</p>
                  </div>
                  <h5 className="text-green-400 text-lg font-semibold mt-2">Budget: ${project.budget}</h5>
                  <p className="text-gray-300 mt-2">{project.description}</p>
                  <div className="flex flex-wrap mt-3 gap-2">
                    {project.skills.map((skill) => (
                      <span key={skill} className="bg-indigo-600 text-white px-2 py-1 rounded text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 text-gray-400 text-sm">
                    <p>{project.bids.length} bids</p>
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
