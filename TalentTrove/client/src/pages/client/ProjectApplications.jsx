 



import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProjectApplications = () => {
  const [applications, setApplications] = useState([]);
  const [displayApplications, setDisplayApplications] = useState([]);
  const [projectTitles, setProjectTitles] = useState([]);
  const [projectFilter, setProjectFilter] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}
/fetch-applications`);
      const filteredApplications = response.data.filter(
        (application) => application.clientId === localStorage.getItem('userId')
      );
      setApplications(filteredApplications);
      setDisplayApplications(filteredApplications.reverse());
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const uniqueTitles = [...new Set(applications.map(app => app.title))];
    setProjectTitles(uniqueTitles);
  }, [applications]);

  const handleApprove = async (id) => {
    try {
      await axios.get(`${import.meta.env.VITE_API_BASE_URL}
/approve-application/${id}`);
      alert("Application approved");
      fetchApplications();
    } catch (err) {
      alert("Operation failed!!");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.get(`${import.meta.env.VITE_API_BASE_URL}
/reject-application/${id}`);
      alert("Application rejected!!");
      fetchApplications();
    } catch (err) {
      alert("Operation failed!!");
    }
  };

  const handleFilterChange = (value) => {
    setProjectFilter(value);
    if (value === '') {
      setDisplayApplications(applications.reverse());
    } else {
      setDisplayApplications(applications.filter(app => app.title === value).reverse());
    }
  };

  return (
    <div className="client-applications-page bg-black text-white min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-gray-900 p-6 rounded-xl shadow-lg">
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

        {displayApplications.map((application) => (
          <div key={application._id} className="bg-gray-800 p-4 rounded-lg shadow-md mb-3">
            <h4 className="text-xl font-semibold text-blue-300">{application.title}</h4>
            <p className="text-gray-400 mt-2">{application.description}</p>
            <h6 className="text-lg font-medium text-blue-400 mt-2">Budget - $ {application.budget}</h6>

            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <span className="font-semibold text-gray-300">Skills:</span>
              {application.requiredSkills.map((skill) => (
                <span key={skill} className="bg-gray-700 px-2 py-1 rounded">{skill}</span>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <span className="font-semibold text-gray-300">Freelancer Skills:</span>
              {application.freelancerSkills.map((skill) => (
                <span key={skill} className="bg-gray-700 px-2 py-1 rounded">{skill}</span>
              ))}
            </div>

            <h6 className="text-lg font-medium text-blue-400 mt-2">Proposed Budget - $ {application.bidAmount}</h6>
            <p className="text-gray-400 mt-2">Proposal: {application.proposal}</p>

            <div className="mt-3 flex items-center gap-4">
              {application.status === 'Pending' ? (
                <>
                  <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => handleApprove(application._id)}>Approve</button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleReject(application._id)}>Decline</button>
                </>
              ) : (
                <h6 className="text-gray-300">Status: <b>{application.status}</b></h6>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectApplications;
