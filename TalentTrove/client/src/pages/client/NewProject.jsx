 


import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewProject = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState(0);
  const [skills, setSkills] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async () => {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}
/new-project`, {
      title,
      description,
      budget,
      skills,
      clientId: localStorage.getItem('userId'),
      clientName: localStorage.getItem('username'),
      clientEmail: localStorage.getItem('email')
    }).then(() => {
      alert("New project added!");
      setTitle('');
      setDescription('');
      setBudget(0);
      setSkills('');
      navigate('/client');
    }).catch(() => {
      alert("Operation failed!");
    });
  };

  return (
    <div className="new-project-page bg-gray-900 text-white min-h-screen flex flex-col items-center p-6">
      <h3 className="text-2xl font-bold text-blue-400 mb-6">Post New Project</h3>
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-2xl">
        <div className="mb-4">
          <label className="block text-gray-400 mb-1">Project Title</label>
          <input 
            type="text" 
            className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none"
            placeholder="Enter project title"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-400 mb-1">Description</label>
          <textarea 
            className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none"
            placeholder="Enter project description"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-gray-400 mb-1">Budget ($)</label>
            <input 
              type="number" 
              className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none"
              placeholder="Enter budget"
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-400 mb-1">Required Skills</label>
            <input 
              type="text" 
              className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none"
              placeholder="Skills (comma separated)"
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>
        </div>
        <button className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default NewProject;
