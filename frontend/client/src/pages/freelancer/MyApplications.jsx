import React, { useEffect, useState } from 'react';
import { api } from '../../context/GeneralContext';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/fetch-applications');
      const myApps = response.data
        .filter((app) => app.freelancerId === localStorage.getItem('userId'))
        .reverse();
      setApplications(myApps);
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
    <div className="min-h-screen bg-surface p-6 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <h3 className="page-title text-center mb-8">My Applications</h3>

        {applications.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-gray-500">No applications submitted yet.</p>
          </div>
        ) : (
          <div className="grid gap-5">
            {applications.map((application, i) => (
              <div key={application._id} className="glass-card p-6 animate-slide-up" style={{animationDelay: `${i * 0.05}s`}}>
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Project Info */}
                  <div className="md:w-1/2 space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="text-lg font-semibold text-white">{application.title}</h4>
                      <span className={statusClass[application.status] || 'status-pending'}>
                        {application.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{application.description}</p>
                    <div>
                      <p className="section-label mb-2">Required Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {application.requiredSkills.map((skill) => (
                          <span key={skill} className="skill-pill">{skill}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-emerald-400 font-semibold">Budget: ${application.budget}</p>
                  </div>

                  {/* Your Proposal */}
                  <div className="md:w-1/2 md:border-l border-white/[0.06] md:pl-6 space-y-3">
                    <p className="section-label">Your Proposal</p>
                    <p className="text-gray-300 text-sm">{application.proposal}</p>
                    <div>
                      <p className="section-label mb-2">Your Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {application.freelancerSkills.map((skill) => (
                          <span key={skill} className="skill-pill" style={{background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', borderColor: 'rgba(16, 185, 129, 0.2)'}}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-accent-blue font-semibold">Your Bid: ${application.bidAmount}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
