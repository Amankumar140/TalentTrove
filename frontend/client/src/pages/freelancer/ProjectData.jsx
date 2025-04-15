import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GeneralContext, api } from '../../context/GeneralContext';
import { useToast } from '../../components/Toast';

const ProjectData = () => {
  const { socket } = useContext(GeneralContext);
  const params = useParams();
  const [project, setProject] = useState(null);
  const [clientId, setClientId] = useState('');
  const [freelancerId] = useState(localStorage.getItem('userId'));
  const [projectId, setProjectId] = useState(params.id);
  const [proposal, setProposal] = useState('');
  const [bidAmount, setBidAmount] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [manualLink, setManualLink] = useState('');
  const [submissionDescription, setSubmissionDescription] = useState('');
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState({ messages: [] });
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef(null);
  const { showToast } = useToast();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        await fetchProject(params.id);
        await fetchChats();
      } catch (error) {
        console.error('Error loading project data:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.id]);

  useEffect(() => {
    if (!socket) return;

    const joinRoom = () => {
      socket.emit('join-chat-room', {
        projectId: params.id,
        freelancerId: localStorage.getItem('userId'),
      });
    };

    if (socket.connected) joinRoom();
    socket.on('connect', joinRoom);

    const handleMessagesUpdated = ({ chat, chats: chatsData }) => {
      const data = chat || chatsData;
      if (data && Array.isArray(data.messages)) {
        setChats(data);
      }
    };

    socket.on('messages-updated', handleMessagesUpdated);

    return () => {
      socket.off('connect', joinRoom);
      socket.off('messages-updated', handleMessagesUpdated);
    };
  }, [socket, params.id]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chats.messages]);

  const fetchProject = async (id) => {
    try {
      const response = await api.get(`/fetch-project/${id}`);
      setProject(response.data);
      setProjectId(response.data._id);
      setClientId(response.data.clientId);
      return response.data;
    } catch (err) {
      console.error('Error fetching project:', err);
      throw err;
    }
  };

  const fetchChats = async () => {
    try {
      const response = await api.get(`/fetch-chats/${params.id}`);
      if (response.data && Array.isArray(response.data.messages)) {
        setChats(response.data);
      } else {
        setChats({ messages: [] });
      }
    } catch (err) {
      console.error('Error fetching chats:', err);
      setChats({ messages: [] });
    }
  };

  const handleBidding = async () => {
    try {
      await api.post('/make-bid', {
        clientId,
        freelancerId,
        projectId,
        proposal,
        bidAmount,
        estimatedTime,
      });
      setProposal('');
      setBidAmount(0);
      setEstimatedTime('');
      showToast('Bid submitted successfully!', 'success');
      await fetchProject(params.id);
    } catch (err) {
      showToast('Failed to submit bid. Please try again.', 'error');
      console.error('Bidding error:', err);
    }
  };

  const handleProjectSubmission = async () => {
    try {
      await api.post('/submit-project', {
        clientId,
        freelancerId,
        projectId,
        projectLink,
        manualLink,
        submissionDescription,
      });
      setProjectLink('');
      setManualLink('');
      setSubmissionDescription('');
      showToast('Project submitted for review!', 'success');
      await fetchProject(params.id);
    } catch (err) {
      showToast('Submission failed. Please try again.', 'error');
      console.error('Submission error:', err);
    }
  };

  const handleMessageSend = async () => {
    if (!message.trim() || !socket) return;
    try {
      socket.emit('new-message', {
        projectId: params.id,
        senderId: localStorage.getItem('userId'),
        message: message.trim(),
        time: new Date().toISOString(),
      });
      setMessage('');
      setTimeout(() => fetchChats(), 500);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const statusClass = {
    Available: 'status-available',
    Assigned: 'status-assigned',
    Completed: 'status-completed',
  };

  if (loading) {
    return (
      <div className="bg-surface min-h-screen text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-accent-purple border-t-transparent"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-surface min-h-screen text-white flex items-center justify-center">
        <div className="glass-card p-8 max-w-md text-center">
          <h3 className="text-xl font-semibold text-red-400">Project Not Found</h3>
          <p className="text-gray-400 mt-2 text-sm">Unable to load project details. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen text-white px-4 py-6 animate-fade-in">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Details */}
        <div className="glass-card p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-bold text-white">{project.title}</h3>
            <span className={statusClass[project.status] || 'status-available'}>
              {project.status}
            </span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">{project.description}</p>
          <div className="mt-4">
            <p className="section-label mb-2">Required Skills</p>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill) => (
                <span key={skill} className="skill-pill">{skill}</span>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <p className="section-label mb-1">Budget</p>
            <p className="text-2xl font-bold text-emerald-400">${project.budget}</p>
          </div>
        </div>

        {/* Freelancer Proposal Form */}
        {project.status === 'Available' && (
          <div className="glass-card p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Send Proposal</h4>
            <div className="space-y-3">
              <div>
                <label className="section-label mb-2 block">Bid Amount ($)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Your bid amount"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                />
              </div>
              <div>
                <label className="section-label mb-2 block">Estimated Time (days)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Estimated time"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                />
              </div>
              <div>
                <label className="section-label mb-2 block">Proposal</label>
                <textarea
                  className="form-input resize-none"
                  placeholder="Describe your proposal"
                  rows={4}
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                />
              </div>
              {!project.bids.includes(localStorage.getItem('userId')) ? (
                <button className="btn-primary w-full" onClick={handleBidding}>
                  Post Bid
                </button>
              ) : (
                <button className="w-full px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-500 bg-surface-400 cursor-not-allowed" disabled>
                  Already Bidded
                </button>
              )}
            </div>
          </div>
        )}

        {/* Project Submission Form */}
        {project.freelancerId === localStorage.getItem('userId') && (
          <div className="glass-card p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Submit Project</h4>
            {project.submissionAccepted ? (
              <div className="text-center py-6">
                <p className="text-4xl mb-2">✅</p>
                <p className="text-emerald-400 font-semibold">Project Completed!</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="section-label mb-2 block">Project Link</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="GitHub, live URL..."
                    value={projectLink}
                    onChange={(e) => setProjectLink(e.target.value)}
                  />
                </div>
                <div>
                  <label className="section-label mb-2 block">Documentation Link</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Documentation / Manual link"
                    value={manualLink}
                    onChange={(e) => setManualLink(e.target.value)}
                  />
                </div>
                <div>
                  <label className="section-label mb-2 block">Description</label>
                  <textarea
                    className="form-input resize-none"
                    placeholder="Describe your work"
                    rows={4}
                    value={submissionDescription}
                    onChange={(e) => setSubmissionDescription(e.target.value)}
                  />
                </div>
                {project.submission ? (
                  <button className="w-full px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-500 bg-surface-400 cursor-not-allowed" disabled>
                    Already Submitted — Awaiting Review
                  </button>
                ) : (
                  <button className="btn-primary w-full" onClick={handleProjectSubmission}>
                    Submit Project
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chat Section */}
      <div className="glass-card mt-6 max-w-6xl mx-auto flex flex-col overflow-hidden" style={{height: '520px'}}>
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-3 bg-surface-100">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center text-sm font-bold">C</div>
          <div>
            <h4 className="text-sm font-semibold text-white leading-none">Chat with Client</h4>
            <p className="text-xs text-emerald-400 mt-0.5">Online</p>
          </div>
        </div>

        {project.freelancerId === localStorage.getItem('userId') ? (
          <>
            {/* Message list */}
            <div
              id="freelancer-chat-messages"
              className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-surface"
            >
              {chats && chats.messages && chats.messages.length > 0 ? (
                chats.messages.map((msg, index) => {
                  const isMe = msg.senderId === localStorage.getItem('userId');
                  const senderLabel = isMe ? 'You' : (project?.clientName || 'Client');
                  return (
                    <div key={msg.id || msg._id || index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <span className={`text-[10px] mb-0.5 font-semibold px-1 ${isMe ? 'text-purple-300' : 'text-gray-500'}`}>
                        {senderLabel}
                      </span>
                      <div className={`max-w-[70%] px-3.5 py-2.5 text-sm ${
                        isMe
                          ? 'bg-accent-purple/90 text-white rounded-t-2xl rounded-bl-2xl rounded-br-sm'
                          : 'bg-surface-300 text-gray-100 rounded-t-2xl rounded-br-2xl rounded-bl-sm'
                      }`}>
                        <p className="break-words leading-snug">{msg.text}</p>
                        <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-purple-200' : 'text-gray-500'}`}>
                          {new Date(msg.time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-600">
                  <p className="text-4xl">💬</p>
                  <p className="text-sm">No messages yet. Say hello!</p>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input bar */}
            <div className="px-4 py-3 border-t border-white/[0.06] flex items-center gap-2 bg-surface-50">
              <input
                type="text"
                className="flex-1 bg-surface-200 text-white text-sm px-4 py-2.5 rounded-full outline-none border border-white/[0.06] focus:border-accent-purple/50 transition placeholder-gray-600"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleMessageSend()}
              />
              <button
                onClick={handleMessageSend}
                disabled={!message.trim()}
                className="w-10 h-10 flex items-center justify-center bg-accent-purple hover:bg-purple-600 disabled:opacity-30 rounded-full transition flex-shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white rotate-45">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-600 italic text-sm">Chat will be enabled once this project is assigned to you.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectData;