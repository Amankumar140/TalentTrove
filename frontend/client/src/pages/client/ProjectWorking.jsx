import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GeneralContext, api } from '../../context/GeneralContext';
import { useToast } from '../../components/Toast';

const ProjectWorking = () => {
  const { socket } = useContext(GeneralContext);
  const params = useParams();
  const [project, setProject] = useState(null);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState({ messages: [] });
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchProject(params.id);
  }, [params.id]);

  useEffect(() => {
    if (!socket) return;

    const joinRoom = () => {
      socket.emit('join-chat-room-client', { projectId: params.id });
    };

    if (socket.connected) joinRoom();
    socket.on('connect', joinRoom);

    const handleMessagesUpdated = ({ chat }) => {
      if (chat && Array.isArray(chat.messages)) {
        setChats(chat);
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
      setLoading(true);
      const response = await api.get(`/fetch-project/${id}`);
      setProject(response.data);
      await fetchChats();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChats = async () => {
    try {
      const response = await api.get(`/fetch-chats/${params.id}`);
      if (response.data && response.data.messages) {
        setChats(response.data);
      } else {
        setChats({ messages: [] });
      }
    } catch (err) {
      console.error('Error fetching chats:', err);
      setChats({ messages: [] });
    }
  };

  const handleApproveSubmission = async () => {
    try {
      await api.get(`/approve-submission/${params.id}`);
      showToast('Submission approved! Project marked as completed.', 'success');
      fetchProject(params.id);
    } catch (err) {
      console.error(err);
      showToast('Failed to approve submission.', 'error');
    }
  };

  const handleRejectSubmission = async () => {
    try {
      await api.get(`/reject-submission/${params.id}`);
      showToast('Submission rejected. The freelancer has been notified.', 'warning');
      fetchProject(params.id);
    } catch (err) {
      console.error(err);
      showToast('Failed to reject submission.', 'error');
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
      <div className="p-6 bg-surface min-h-screen text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-accent-blue border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      {project ? (
        <div className="p-6 bg-surface min-h-screen text-white animate-fade-in">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  {project.skills && project.skills.map((skill) => (
                    <span key={skill} className="skill-pill">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/[0.06]">
                <p className="section-label mb-1">Budget</p>
                <p className="text-2xl font-bold text-emerald-400">${project.budget}</p>
              </div>
              {project.freelancerName && (
                <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center text-xs font-bold">
                    {project.freelancerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Assigned to</p>
                    <p className="text-sm font-semibold text-white">{project.freelancerName}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Submission Panel */}
            <div className="glass-card p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Submission</h4>
              {project.submission ? (
                <div className="space-y-4">
                  <div>
                    <p className="section-label mb-1">Project Link</p>
                    <a href={project.projectLink} target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline text-sm break-all">
                      {project.projectLink}
                    </a>
                  </div>
                  {project.manualLink && (
                    <div>
                      <p className="section-label mb-1">Documentation</p>
                      <a href={project.manualLink} target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline text-sm break-all">
                        {project.manualLink}
                      </a>
                    </div>
                  )}
                  <div>
                    <p className="section-label mb-1">Description</p>
                    <p className="text-gray-400 text-sm">{project.submissionDescription}</p>
                  </div>
                  {project.submissionAccepted ? (
                    <div className="text-center py-4">
                      <p className="text-4xl mb-2">✅</p>
                      <p className="text-emerald-400 font-semibold">Project Completed!</p>
                    </div>
                  ) : (
                    <div className="flex gap-3 pt-2">
                      <button className="btn-emerald" onClick={handleApproveSubmission}>
                        Approve
                      </button>
                      <button className="btn-danger" onClick={handleRejectSubmission}>
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-4xl mb-2">📦</p>
                  <p className="text-gray-500 text-sm">No submission yet from the freelancer.</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Section */}
          <div className="glass-card mt-6 max-w-6xl mx-auto flex flex-col overflow-hidden" style={{height: '520px'}}>
            {/* Chat header */}
            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-3 bg-surface-100">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center text-sm font-bold">F</div>
              <div>
                <h4 className="text-sm font-semibold text-white leading-none">Chat with Freelancer</h4>
                <p className="text-xs text-emerald-400 mt-0.5">
                  {project.freelancerName || 'Freelancer'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div
              id="client-chat-messages"
              className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-surface"
            >
              {chats && chats.messages && chats.messages.length > 0 ? (
                chats.messages.map((msg, index) => {
                  const isMe = msg.senderId === localStorage.getItem('userId');
                  const senderLabel = isMe ? 'You' : (project?.freelancerName || 'Freelancer');
                  return (
                    <div key={msg._id || msg.id || index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <span className={`text-[10px] mb-0.5 font-semibold px-1 ${isMe ? 'text-blue-300' : 'text-gray-500'}`}>
                        {senderLabel}
                      </span>
                      <div className={`max-w-[70%] px-3.5 py-2.5 text-sm ${
                        isMe
                          ? 'bg-accent-blue/90 text-white rounded-t-2xl rounded-bl-2xl rounded-br-sm'
                          : 'bg-surface-300 text-gray-100 rounded-t-2xl rounded-br-2xl rounded-bl-sm'
                      }`}>
                        <p className="break-words leading-snug">{msg.text}</p>
                        <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-gray-500'}`}>
                          {new Date(msg.time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-600">
                  <p className="text-4xl">💬</p>
                  <p className="text-sm">No messages yet. Start the conversation!</p>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input bar */}
            <div className="px-4 py-3 border-t border-white/[0.06] flex items-center gap-2 bg-surface-50">
              <input
                type="text"
                className="flex-1 bg-surface-200 text-white text-sm px-4 py-2.5 rounded-full outline-none border border-white/[0.06] focus:border-accent-blue/50 transition placeholder-gray-600"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleMessageSend()}
              />
              <button
                onClick={handleMessageSend}
                disabled={!message.trim()}
                className="w-10 h-10 flex items-center justify-center bg-accent-blue hover:bg-blue-600 disabled:opacity-30 rounded-full transition flex-shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white rotate-45">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-surface min-h-screen text-white flex items-center justify-center">
          <p className="text-gray-500">Project not found or error loading project.</p>
        </div>
      )}
    </>
  );
};

export default ProjectWorking;