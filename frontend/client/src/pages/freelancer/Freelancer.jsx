import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const WS = import.meta.env.VITE_API_BASE_URL;

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
      const response = await axios.get(`${WS}/fetch-freelancer/${id}`); // FIX: single-line template literal
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
      const response = await axios.post(`${WS}/update-freelancer`, { // FIX: single-line template literal
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
      const response = await axios.get(`${WS}/fetch-applications`); // FIX: single-line template literal
      setApplicationsCount(
        response.data.filter(
          (app) => app.freelancerId === localStorage.getItem('userId')
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {freelancerData ? (
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: 'Current Projects',   count: freelancerData.currentProjects.length,   link: '/my-projects'    },
              { title: 'Completed Projects',  count: freelancerData.completedProjects.length,  link: '/my-projects'    },
              { title: 'Applications',        count: applicationsCount.length,                  link: '/myApplications' },
              { title: 'Funds Available',     count: `$${freelancerData.funds}`,               link: '#'               },
            ].map((item, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md text-center">
                <h4 className="text-lg font-semibold">{item.title}</h4>
                <p className="text-2xl font-bold mt-2">{item.count}</p>
                {item.link !== '#' && (
                  <button
                    onClick={() => navigate(item.link)}
                    className="mt-3 bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm"
                  >
                    View Details
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Profile Details */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            {!isDataUpdateOpen ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold">My Skills</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.length > 0 ? (
                      skills.map((skill) => (
                        <span key={skill} className="bg-indigo-600 px-3 py-1 rounded text-sm">{skill}</span>
                      ))
                    ) : (
                      <p className="text-gray-400">No skills added yet</p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold">About Me</h4>
                  <p className="text-gray-300 mt-2">{description || 'No description added yet'}</p>
                </div>
                <button
                  onClick={() => setIsDataUpdateOpen(true)}
                  className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-lg font-semibold block mb-1">My Skills</label>
                  <input
                    type="text"
                    className="w-full mt-1 p-2 rounded bg-gray-700 border border-gray-600 text-white"
                    placeholder="Enter skills (comma separated)"
                    value={updateSkills.join(', ')}
                    onChange={(e) =>
                      setUpdateSkills(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))
                    }
                  />
                </div>
                <div>
                  <label className="text-lg font-semibold block mb-1">About Me</label>
                  <textarea
                    className="w-full mt-1 p-2 rounded bg-gray-700 border border-gray-600 text-white"
                    placeholder="Tell clients about yourself"
                    rows={4}
                    value={updateDescription}
                    onChange={(e) => setUpdateDescription(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={updateUserData} className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700">
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsDataUpdateOpen(false)}
                    className="bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-500"
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}
    </div>
  );
};

export default Freelancer;
