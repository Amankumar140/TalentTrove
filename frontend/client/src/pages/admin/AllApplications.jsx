import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WS = import.meta.env.VITE_API_BASE_URL;

const AllApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`${WS}/fetch-applications`); // FIX: single-line template literal
      setApplications([...response.data].reverse());
    } catch (err) {
      console.error(err);
    }
  };

  const statusColor = {
    Pending:  'bg-yellow-700 text-yellow-100',
    Accepted: 'bg-green-700 text-green-100',
    Rejected: 'bg-red-800 text-red-100',
  };

  return (
    <div className="bg-[#101214] text-white min-h-screen p-6">
      <h3 className="text-lg font-semibold text-blue-400 mb-2">All Applications ({applications.length})</h3>
      <hr className="mb-4 border-gray-700" />
      <div className="grid gap-4">
        {applications.map((application) => (
          <div key={application._id} className="bg-[#2e3434] p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-white">{application.title}</h3>
              <span className={`text-xs px-2 py-1 rounded ${statusColor[application.status] || 'bg-gray-600'}`}>
                {application.status}
              </span>
            </div>
            <p className="text-gray-300 mt-2">{application.description}</p>
            <div className="mt-2">
              <h5 className="text-sm font-medium text-blue-200">Skills Required:</h5>
              <div className="flex flex-wrap gap-2 mt-1">
                {application.requiredSkills.map((skill) => (
                  <span key={skill} className="bg-blue-900 text-blue-200 px-3 py-1 rounded-lg text-sm">{skill}</span>
                ))}
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-300">
              <p>Budget: ${application.budget}</p>
              <p>Bid: ${application.bidAmount} · {application.estimatedTime} days</p>
              <p>Client: {application.clientName} ({application.clientEmail})</p>
              <p>Freelancer: {application.freelancerName} ({application.freelancerEmail})</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllApplications;
