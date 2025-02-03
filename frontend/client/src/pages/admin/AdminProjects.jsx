import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const WS = import.meta.env.VITE_API_BASE_URL;

const AdminProjects = () => {
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
      const response = await axios.get(`${WS}/fetch-projects`); // FIX: single-line template literal
      const data = response.data;
      setProjects(data);
      setDisplayProjects([...data].reverse());

      const skillsSet = new Set();
      data.forEach((project) => project.skills.forEach((skill) => skillsSet.add(skill)));
      setAllSkills([...skillsSet]);
    } catch (err) {
      console.error(err);
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

  const statusColor = {
    Available: 'text-green-400',
    Assigned:  'text-yellow-400',
    Completed: 'text-blue-400',
  };

  return (
    <div className="bg-[#101214] text-white min-h-screen p-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Filters */}
        <div className="md:col-span-3 bg-[#2e3434] p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-blue-400">Filters</h3>
          <hr className="my-2 border-gray-700" />
          <h5 className="text-md font-medium text-white">Skills</h5>
          {allSkills.length > 0 && (
            <div className="mt-2 space-y-2">
              {allSkills.map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={skill}
                    onChange={handleCategoryCheckBox}
                    className="form-checkbox text-blue-500"
                  />
                  <label className="text-white text-sm">{skill}</label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Projects List */}
        <div className="md:col-span-9">
          <h3 className="text-lg font-semibold text-blue-300 mb-2">All Projects ({displayProjects.length})</h3>
          <hr className="mb-4 border-gray-700" />
          <div className="grid gap-4">
            {displayProjects.map((project) => (
              <div key={project._id} className="bg-[#2e3434] p-6 rounded-2xl shadow-lg">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-white">{project.title}</h3>
                  <span className={`text-sm font-semibold ${statusColor[project.status] || 'text-gray-400'}`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{new Date(project.postedDate).toLocaleDateString()}</p>
                <h5 className="text-md font-medium text-blue-300 mt-2">Budget: ${project.budget}</h5>
                <h5 className="text-md font-medium text-white">
                  Client: {project.clientName} ({project.clientEmail})
                </h5>
                <p className="text-gray-300 mt-2">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.skills.map((skill) => (
                    <span key={skill} className="bg-blue-900 text-blue-200 px-3 py-1 rounded-lg text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-sm text-gray-400">
                  <p>{project.bids.length} bids</p>
                  <p>
                    Avg Bid: $
                    {project.bids.length > 0
                      ? Math.round(
                          project.bidAmounts.reduce((acc, curr) => acc + curr, 0) / project.bids.length
                        )
                      : 0}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProjects;
