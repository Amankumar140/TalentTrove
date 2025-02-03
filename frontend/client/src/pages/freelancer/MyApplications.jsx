import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WS = import.meta.env.VITE_API_BASE_URL;

const MyApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`${WS}/fetch-applications`); // FIX: single-line template literal
      const myApps = response.data
        .filter((app) => app.freelancerId === localStorage.getItem('userId'))
        .reverse();
      setApplications(myApps);
    } catch (err) {
      console.error(err);
    }
  };

  const statusColor = {
    Pending:  'text-yellow-400',
    Accepted: 'text-green-400',
    Rejected: 'text-red-400',
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h3 className="text-2xl font-bold mb-6 text-center">My Applications</h3>

      {applications.length === 0 ? (
        <p className="text-gray-400 text-center">No applications submitted yet.</p>
      ) : (
        <div className="max-w-6xl mx-auto grid gap-6">
          {applications.map((application) => (
            <div key={application._id} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="md:w-1/2">
                  <h4 className="text-xl font-semibold text-green-400">{application.title}</h4>
                  <p className="text-gray-300 mt-2">{application.description}</p>
                  <div className="mt-4">
                    <h5 className="text-lg font-semibold">Required Skills</h5>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {application.requiredSkills.map((skill) => (
                        <span key={skill} className="bg-indigo-600 text-white px-2 py-1 rounded text-sm">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <h6 className="mt-4 text-lg font-semibold">Project Budget: ${application.budget}</h6>
                </div>

                <div className="md:w-1/2 mt-6 md:mt-0 md:pl-6 border-l border-gray-600">
                  <h5 className="text-lg font-semibold">Your Proposal</h5>
                  <p className="text-gray-300 mt-2">{application.proposal}</p>
                  <div className="mt-4">
                    <h5 className="text-lg font-semibold">Your Skills</h5>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {application.freelancerSkills.map((skill) => (
                        <span key={skill} className="bg-green-700 text-white px-2 py-1 rounded text-sm">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <h6 className="mt-4 text-lg font-semibold">Your Bid: ${application.bidAmount}</h6>
                  <h6 className="mt-2 text-lg font-semibold">
                    Status:{' '}
                    <span className={statusColor[application.status] || 'text-gray-300'}>
                      {application.status}
                    </span>
                  </h6>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
