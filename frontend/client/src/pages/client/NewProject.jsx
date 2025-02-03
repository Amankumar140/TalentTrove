import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const WS = import.meta.env.VITE_API_BASE_URL;

const NewProject = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title || !description || !budget || !skills) {
      alert('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${WS}/new-project`, { // FIX: single-line template literal
        title,
        description,
        budget: Number(budget),
        skills,
        clientId:    localStorage.getItem('userId'),
        clientName:  localStorage.getItem('username'),
        clientEmail: localStorage.getItem('email'),
      });
      alert('New project posted successfully!');
      navigate('/client');
    } catch {
      alert('Failed to post project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center p-6">
      <h3 className="text-2xl font-bold text-blue-400 mb-6">Post New Project</h3>
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-2xl space-y-4">
        <div>
          <label className="block text-gray-400 mb-1">Project Title *</label>
          <input
            type="text"
            className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Build a React E-commerce Site"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-400 mb-1">Description *</label>
          <textarea
            className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe what you need done in detail"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-gray-400 mb-1">Budget ($) *</label>
            <input
              type="number"
              className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 500"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-400 mb-1">Required Skills *</label>
            <input
              type="text"
              className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="React, Node.js, MongoDB"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>
        </div>
        <button
          className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition disabled:opacity-50"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Posting...' : 'Post Project'}
        </button>
      </div>
    </div>
  );
};

export default NewProject;
