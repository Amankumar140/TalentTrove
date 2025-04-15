import React, { useEffect, useState } from 'react';
import { api } from '../../context/GeneralContext';
import { useToast } from '../../components/Toast';

const ProjectApplications = () => {
  const [applications, setApplications] = useState([]);
  const [displayApplications, setDisplayApplications] = useState([]);
  const [projectTitles, setProjectTitles] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/fetch-applications');
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
      await api.get(`/approve-application/${id}`);
      showToast('Application approved! The freelancer has been assigned.', 'success');
      fetchApplications();
    } catch (err) {
      showToast('Failed to approve application. Please try again.', 'error');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.get(`/reject-application/${id}`);
      showToast('Application declined.', 'info');
      fetchApplications();
    } catch (err) {
      showToast('Failed to decline application. Please try again.', 'error');
    }
  };

  const handleFilterChange = (value) => {
    if (value === '') {
      setDisplayApplications([...applications].reverse());
    } else {
      setDisplayApplications([...applications].filter((app) => app.title === value).reverse());
    }
  };

  const statusClass = {
    Pending:  'status-pending',
    Accepted: 'status-accepted',
    Rejected: 'status-rejected',
  };

  return (
    <div className="bg-surface text-white min-h-screen p-6 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <h3 className="page-title mb-6">Applications</h3>

        {projectTitles.length > 0 && (
          <select
            className="form-input w-full max-w-sm mb-6 cursor-pointer"
            onChange={(e) => handleFilterChange(e.target.value)}
          >
            <option value="" className="bg-surface-200">All Projects</option>
            {projectTitles.map((title) => (
              <option key={title} value={title} className="bg-surface-200">{title}</option>
            ))}
          </select>
        )}

        {displayApplications.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-gray-500">No applications yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayApplications.map((application, i) => (
              <div key={application._id} className="glass-card p-6 animate-slide-up" style={{animationDelay: `${i * 0.05}s`}}>
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-semibold text-white">{application.title}</h4>
                  <span className={statusClass[application.status] || 'status-pending'}>
                    {application.status}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{application.description}</p>
                <p className="text-accent-blue font-semibold mt-2">Budget: ${application.budget}</p>

                <div className="mt-3">
                  <p className="section-label mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {application.requiredSkills.map((skill) => (
                      <span key={skill} className="skill-pill">{skill}</span>
                    ))}
                  </div>
                </div>

                {/* Freelancer info */}
                <div className="mt-4 p-4 bg-surface-200/50 rounded-xl border border-white/[0.04]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center text-xs font-bold">
                      {application.freelancerName?.charAt(0)?.toUpperCase() || 'F'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{application.freelancerName}</p>
                      <p className="text-xs text-gray-500">{application.freelancerEmail}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {application.freelancerSkills.map((skill) => (
                      <span key={skill} className="skill-pill" style={{background: 'rgba(59, 130, 246, 0.15)', color: '#93c5fd', borderColor: 'rgba(59, 130, 246, 0.2)'}}>
                        {skill}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{application.proposal}</p>
                  <p className="text-emerald-400 font-semibold text-sm">
                    Bid: ${application.bidAmount} · {application.estimatedTime} days
                  </p>
                </div>

                {application.status === 'Pending' && (
                  <div className="mt-4 flex gap-3">
                    <button
                      className="btn-emerald"
                      onClick={() => handleApprove(application._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => handleReject(application._id)}
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectApplications;
