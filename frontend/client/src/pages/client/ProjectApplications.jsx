import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WS = import.meta.env.VITE_API_BASE_URL;

const ProjectApplications = () => {
  const [applications, setApplications] = useState([]);
  const [displayApplications, setDisplayApplications] = useState([]);
  const [projectTitles, setProjectTitles] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`${WS}/fetch-applications`); // FIX: single-line template literal
      const filteredApplications = response.data.filter(
        (app) => app.clientId === localStorage.getItem('userId')
      );
      setApplications(filteredApplications);
      setDisplayApplications([...filteredApplications].reverse());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const uniqueTitles = [...new Set(applications.map((app) => app.title))];
    setProjectTitles(uniqueTitles);
  }, [applications]);

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this application? Other bids will be rejected.')) return;
    try {
      await axios.get(`${WS}/approve-application/${id}`); // FIX: single-line template literal
      alert('Application approved!');
      fetchApplications();
    } catch (err) {
      alert('Operation failed!');
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.get(`${WS}/reject-application/${id}`); // FIX: single-line template literal
      alert('Application rejected.');
      fetchApplications();
    } catch (err) {
      alert('Operation failed!');
    }
  };

  const handleFilterChange = (value) => {
    if (value === '') {
      setDisplayApplications([...applications].reverse());
    } else {
      setDisplayApplications([...applications].filter((app) => app.title === value).reverse());
    }
  };

  const statusColor = {
    Pending:  'bg-yellow-700',
    Accepted: 'bg-green-700',
    Rejected: 'bg-red-800',
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-blue-400 mb-4">Applications</h3>

        {projectTitles.length > 0 && (
          <select
            className="border border-gray-700 rounded-md p-2 w-full bg-gray-800 text-white focus:outline-none mb-4"
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="">All Projects</option>
            {projectTitles.map((title) => (
              <option key={title} value={title}>{title}</option>
            ))}
          </select>
        )}

        {displayApplications.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No applications yet.</p>
        ) : (
          displayApplications.map((application) => (
            <div key={application._id} className="bg-gray-800 p-4 rounded-lg shadow-md mb-3">
              <div className="flex justify-between items-start">
                <h4 className="text-xl font-semibold text-blue-300">{application.title}</h4>
                <span className={`text-xs px-2 py-1 rounded ${statusColor[application.status] || 'bg-gray-600'}`}>
                  {application.status}
                </span>
              </div>
              <p className="text-gray-400 mt-2">{application.description}</p>
              <h6 className="text-lg font-medium text-blue-400 mt-2">Project Budget: ${application.budget}</h6>

              <div className="mt-3">
                <span className="font-semibold text-gray-300 text-sm">Required Skills: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {application.requiredSkills.map((skill) => (
                    <span key={skill} className="bg-gray-700 px-2 py-1 rounded text-xs">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="mt-3 p-3 bg-gray-700 rounded-lg">
                <p className="text-sm font-semibold text-white">
                  Freelancer: {application.freelancerName} ({application.freelancerEmail})
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {application.freelancerSkills.map((skill) => (
                    <span key={skill} className="bg-indigo-700 px-2 py-1 rounded text-xs">{skill}</span>
                  ))}
                </div>
                <p className="text-gray-300 mt-2 text-sm">Proposal: {application.proposal}</p>
                <h6 className="text-lg font-medium text-green-400 mt-2">
                  Bid: ${application.bidAmount} · {application.estimatedTime} days
                </h6>
              </div>

              {application.status === 'Pending' && (
                <div className="mt-3 flex gap-3">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                    onClick={() => handleApprove(application._id)}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    onClick={() => handleReject(application._id)}
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectApplications;
