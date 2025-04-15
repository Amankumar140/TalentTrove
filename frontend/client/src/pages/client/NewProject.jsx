import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../context/GeneralContext';
import { useToast } from '../../components/Toast';

const NewProject = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async () => {
    if (!title || !description || !budget || !skills) {
      showToast('Please fill in all fields before posting.', 'warning');
      return;
    }
    setLoading(true);
    try {
      await api.post('/new-project', {
        title,
        description,
        budget: Number(budget),
        skills,
        clientId:    localStorage.getItem('userId'),
        clientName:  localStorage.getItem('username'),
        clientEmail: localStorage.getItem('email'),
      });
      showToast('Project posted successfully!', 'success');
      navigate('/client');
    } catch {
      showToast('Failed to post project. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface text-white min-h-screen flex flex-col items-center p-6 animate-fade-in">
      <div className="w-full max-w-2xl">
        <h3 className="page-title mb-8">Post New Project</h3>

        <div className="glass-card p-6 md:p-8 space-y-5">
          <div>
            <label className="section-label mb-2 block">Project Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Build a React E-commerce Site"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="section-label mb-2 block">Description *</label>
            <textarea
              className="form-input resize-none"
              placeholder="Describe what you need done in detail"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="section-label mb-2 block">Budget ($) *</label>
              <input
                type="number"
                className="form-input"
                placeholder="e.g. 500"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
            <div>
              <label className="section-label mb-2 block">Required Skills *</label>
              <input
                type="text"
                className="form-input"
                placeholder="React, Node.js, MongoDB"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>
          </div>

          <button
            className="btn-blue w-full mt-2 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Posting...' : 'Post Project'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewProject;
