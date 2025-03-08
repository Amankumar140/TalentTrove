 

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Client = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [displayProjects, setDisplayProjects] = useState([]);
  const [filterProject, setFilterProject] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:6001/fetch-projects');
      const pros = response.data.filter(pro => pro.clientId === localStorage.getItem('userId'));
      setProjects(pros);
      setDisplayProjects(pros.reverse());
    } catch (err) {
      console.log(err);
    }
  };

  const handleFilterChange = (data) => {
    if (data === '') {
      setDisplayProjects(projects);
    } else if (data === 'Un Assigned') {
      setDisplayProjects(projects.filter(project => project.status === 'Available').reverse());
    } else if (data === 'In Progress') {
      setDisplayProjects(projects.filter(project => project.status === 'Assigned').reverse());
    } else if (data === 'Completed') {
      setDisplayProjects(projects.filter(project => project.status === 'Completed').reverse());
    }
  };

  return (
    <div className="client-projects-page bg-gray-900 text-white min-h-screen p-6  ">
      <div className="max-w-4xl mx-auto bg-gray-600 p-6 rounded-xl shadow-lg">
        <h3 className="text-2xl font-bold text-blue-400 mb-4 text-left">My Projects</h3>
        <div className="flex justify-start items-center mb-4">
          <select
            className="border border-gray-700 rounded-md p-2 w-1/4 bg-gray-800 text-white focus:outline-none"
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="">Choose project status</option>
            <option value="Un Assigned">Un Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <hr className="mb-4 border-gray-700" />
        {displayProjects.map((project) => (
          <div
            key={project._id}
            className="bg-gray-800 p-4 rounded-lg shadow-md mb-3 cursor-pointer hover:bg-gray-700 transition-all duration-300"
            onClick={() => navigate(`/client-project/${project._id}`)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-blue-300">{project.title}</h3>
              <p className="text-gray-500 text-sm">{String(project.postedDate).slice(0, 25)}</p>
            </div>
            <h5 className="text-lg font-medium text-blue-400 mt-2">Budget - $ {project.budget}</h5>
            <p className="text-gray-400 mt-2">{project.description}</p>
            <div className="mt-3 flex justify-between items-center text-sm text-gray-300">
              <h6 className="font-semibold">Status - {project.status}</h6>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Client;
