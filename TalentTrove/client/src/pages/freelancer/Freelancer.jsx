 


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Freelancer = () => {
  const [isDataUpdateOpen, setIsDataUpdateOpen] = useState(false);
  const navigate = useNavigate();
  const [freelancerData, setFreelancerData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [description, setDescription] = useState('');
  const [freelancerId, setFreelancerId] = useState('');
  const [updateSkills, setUpdateSkills] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');
  const [applicationsCount, setApplicationsCount] = useState([]);

  useEffect(() => {
    fetchUserData(localStorage.getItem('userId'));
    fetchApplications();
  }, []);

  const fetchUserData = async (id) => {
    try {
      const response = await axios.get(`http://localhost:6001/fetch-freelancer/${id}`);
      setFreelancerData(response.data);
      if (response.data) {
        setFreelancerId(response.data._id);
        setSkills(response.data.skills);
        setDescription(response.data.description);
        setUpdateSkills(response.data.skills);
        setUpdateDescription(response.data.description);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateUserData = async () => {
    try {
      await axios.post(`http://localhost:6001/update-freelancer`, {
        freelancerId,
        updateSkills,
        description: updateDescription,
      });
      fetchUserData(freelancerId);
      alert('User data updated');
    } catch (error) {
      console.error(error);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await axios.get("http://localhost:6001/fetch-applications");
      setApplicationsCount(response.data.filter(app => app.freelancerId === localStorage.getItem('userId')));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {freelancerData && (
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: 'Current Projects', count: freelancerData.currentProjects.length, link: '/my-projects' },
              { title: 'Completed Projects', count: freelancerData.completedProjects.length, link: '/my-projects' },
              { title: 'Applications', count: applicationsCount.length, link: '/myApplications' },
              { title: 'Funds Available', count: `$${freelancerData.funds}`, link: '#' },
            ].map((item, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md text-center">
                <h4 className="text-lg font-semibold">{item.title}</h4>
                <p className="text-2xl font-bold mt-2">{item.count}</p>
                {item.link !== '#' && (
                  <button onClick={() => navigate(item.link)} className="mt-3 bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700">
                    View Details
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Freelancer Details Section */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            {!isDataUpdateOpen ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold">My Skills</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.length > 0 ? skills.map(skill => (
                      <span key={skill} className="bg-indigo-600 px-3 py-1 rounded text-sm">{skill}</span>
                    )) : <p className="text-gray-400">No skills available</p>}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Description</h4>
                  <p className="text-gray-300 mt-2">{description || 'Please add your description'}</p>
                </div>
                <button onClick={() => setIsDataUpdateOpen(true)} className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700">
                  Update
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-lg font-semibold">My Skills</label>
                  <input type="text" className="w-full mt-2 p-2 rounded bg-gray-700 border border-gray-600" placeholder="Enter skills" value={updateSkills} onChange={(e) => setUpdateSkills(e.target.value)} />
                </div>
                <div>
                  <label className="text-lg font-semibold">Description</label>
                  <textarea className="w-full mt-2 p-2 rounded bg-gray-700 border border-gray-600" placeholder="Enter your description" value={updateDescription} onChange={(e) => setUpdateDescription(e.target.value)}></textarea>
                </div>
                <button onClick={updateUserData} className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700">
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Freelancer;
