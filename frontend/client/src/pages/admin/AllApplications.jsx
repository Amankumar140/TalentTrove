import React, { useEffect, useState } from 'react';
import { api } from '../../context/GeneralContext';

const AllApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/fetch-applications');
      setApplications([...response.data].reverse());
    } catch (err) {
      console.error(err);
    }
  };

  const statusClass = {
    Pending:  'status-pending',
    Accepted: 'status-accepted',
    Rejected: 'status-rejected',
  };

  return (
    <div className="bg-surface text-white min-h-screen p-6 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="page-title">All Applications</h3>
          <span className="text-sm text-gray-500">{applications.length} total</span>
        </div>
        <div className="space-y-4">
          {applications.map((application, i) => (
            <div key={application._id} className="glass-card p-6 animate-slide-up" style={{animationDelay: `${i * 0.03}s`}}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-white">{application.title}</h3>
                <span className={statusClass[application.status] || 'status-pending'}>
                  {application.status}
                </span>
              </div>
              <p className="text-gray-400 text-sm">{application.description}</p>
              <div className="mt-3">
                <p className="section-label mb-2">Required Skills</p>
                <div className="flex flex-wrap gap-2">
                  {application.requiredSkills.map((skill) => (
                    <span key={skill} className="skill-pill">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-gray-500">Budget: <span className="text-accent-blue font-semibold">${application.budget}</span></p>
                  <p className="text-gray-500">Bid: <span className="text-emerald-400 font-semibold">${application.bidAmount}</span> · {application.estimatedTime} days</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500">Client: <span className="text-white">{application.clientName}</span></p>
                  <p className="text-gray-500">Freelancer: <span className="text-white">{application.freelancerName}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllApplications;
