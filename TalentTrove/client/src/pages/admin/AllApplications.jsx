 


import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    await axios.get('http://localhost:6001/fetch-applications')
      .then(response => {
        setApplications(response.data.reverse());
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <h3 className="text-lg font-semibold text-blue-400">All Applications</h3>
      <hr className="my-2 border-gray-700" />
      <div className="grid gap-4">
        {applications.map(application => (
          <div key={application._id} className="bg-gray-900 p-6 rounded-2xl shadow-lg">
            <div className='flex justify-between'>
              <h3 className="text-xl font-bold text-white">{application.title}</h3>
            </div>
            <p className="text-gray-300 mt-2">{application.description}</p>
            <div className="mt-2">
              <h5 className="text-md font-medium text-blue-400">Skills Required:</h5>
              <div className="flex flex-wrap gap-2">
                {application.requiredSkills.map(skill => (
                  <span key={skill} className="bg-blue-500 text-black px-3 py-1 rounded-lg">{skill}</span>
                ))}
              </div>
            </div>
            <h6 className="text-md font-medium text-blue-400 mt-2">Budget: ₹ {application.budget}</h6>
            <h5 className="text-md font-medium text-white">Client: {application.clientName} ({application.clientEmail})</h5>
            <h5 className="text-md font-medium text-yellow-400">Status: {application.status}</h5>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllApplications;
