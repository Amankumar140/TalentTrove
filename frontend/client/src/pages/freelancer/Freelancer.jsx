import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../context/GeneralContext';
import { FaProjectDiagram, FaCheckCircle, FaFileAlt, FaDollarSign } from 'react-icons/fa';

const Freelancer = () => {
  const [isDataUpdateOpen, setIsDataUpdateOpen] = useState(false);
  const navigate = useNavigate();
  const [freelancerData, setFreelancerData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [description, setDescription] = useState('');
  const [freelancerId, setFreelancerId] = useState('');
  const [updateSkills, setUpdateSkills] = useState([]);
  const [updateDescription, setUpdateDescription] = useState('');
  const [applicationsCount, setApplicationsCount] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetchUserData(userId);
      fetchApplications();
    }
  }, []);

  const fetchUserData = async (id) => {
    try {
      const response = await api.get(`/fetch-freelancer/${id}`);
      if (response.data) {
        setFreelancerData(response.data);
        setFreelancerId(response.data._id);
        setSkills(response.data.skills || []);
        setDescription(response.data.description || '');
        setUpdateSkills(response.data.skills || []);
        setUpdateDescription(response.data.description || '');
      }
    } catch (err) {
      console.error('Error fetching freelancer data:', err);
    }
  };

  const updateUserData = async () => {
    try {
      const response = await api.post('/update-freelancer', {
        freelancerId,
        updateSkills,
        description: updateDescription,
      });
      alert('Profile updated successfully!');
      setFreelancerData(response.data);
      setSkills(response.data.skills || []);
      setDescription(response.data.description || '');
      setUpdateSkills(response.data.skills || []);
      setUpdateDescription(response.data.description || '');
      setIsDataUpdateOpen(false);
    } catch (error) {
      console.error('Update Error:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await api.get('/fetch-applications');
      setApplicationsCount(
        response.data.filter(
          (app) => app.freelancerId === localStorage.getItem('userId')
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const statCards = freelancerData ? [
    { title: 'Current Projects', count: freelancerData.currentProjects.length, link: '/my-projects', icon: <FaProjectDiagram />, color: 'from-purple-500 to-indigo-600' },
    { title: 'Completed', count: freelancerData.completedProjects.length, link: '/my-projects', icon: <FaCheckCircle />, color: 'from-emerald-500 to-teal-600' },
    { title: 'Applications', count: applicationsCount.length, link: '/myApplications', icon: <FaFileAlt />, color: 'from-blue-500 to-cyan-600' },
    { title: 'Funds', count: `$${freelancerData.funds}`, link: '#', icon: <FaDollarSign />, color: 'from-amber-500 to-orange-600' },
  ] : [];

  return (
    <div className="min-h-screen bg-surface p-6 animate-fade-in">
      {freelancerData ? (
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome */}
          <div>
            <h2 className="page-title">Welcome back, {localStorage.getItem('username') || 'Freelancer'} 👋</h2>
            <p className="text-gray-500 text-sm mt-1">Here's an overview of your freelance journey</p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {statCards.map((item, index) => (
              <div
                key={index}
                className="stat-card group cursor-pointer"
                onClick={() => item.link !== '#' && navigate(item.link)}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-sm mb-3 mx-auto`}>
                  {item.icon}
                </div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{item.title}</p>
                <p className="text-3xl font-bold mt-1 text-white">{item.count}</p>
                {item.link !== '#' && (
                  <p className="text-xs text-accent-purple mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    View Details →
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Profile Details */}
          <div className="glass-card p-6 md:p-8">
            {!isDataUpdateOpen ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Profile</h3>
                  <button
                    onClick={() => setIsDataUpdateOpen(true)}
                    className="btn-primary text-xs px-4 py-2"
                  >
                    Edit Profile
                  </button>
                </div>

                <div>
                  <p className="section-label mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.length > 0 ? (
                      skills.map((skill) => (
                        <span key={skill} className="skill-pill">{skill}</span>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No skills added yet</p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="section-label mb-2">About Me</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{description || 'No description added yet'}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-white">Edit Profile</h3>
                <div>
                  <label className="section-label mb-2 block">Skills</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter skills (comma separated)"
                    value={updateSkills.join(', ')}
                    onChange={(e) =>
                      setUpdateSkills(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))
                    }
                  />
                </div>
                <div>
                  <label className="section-label mb-2 block">About Me</label>
                  <textarea
                    className="form-input resize-none"
                    placeholder="Tell clients about yourself"
                    rows={4}
                    value={updateDescription}
                    onChange={(e) => setUpdateDescription(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={updateUserData} className="btn-emerald">
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsDataUpdateOpen(false)}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-400 border border-white/[0.1] hover:border-white/[0.2] hover:bg-white/[0.04] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-accent-purple border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default Freelancer;
