import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GeneralContext, api } from '../../context/GeneralContext';

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
  const chatEndRef = useRef(null); // for auto-scroll

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

  // Socket connection management — joins room on connect AND reconnect
  useEffect(() => {
    if (!socket) return;

    const joinRoom = () => {
      socket.emit('join-chat-room', {
        projectId: params.id,
        freelancerId: localStorage.getItem('userId'),
      });
    };

    // Join immediately if already connected
    if (socket.connected) {
      joinRoom();
    }

    // Re-join on every (re)connection so room membership is restored
    socket.on('connect', joinRoom);

    const handleMessagesUpdated = ({ chat, chats: chatsData }) => {
      const data = chat || chatsData;
      console.log('[Chat] messages-updated received:', JSON.stringify(data?.messages?.length), data);
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

  // Auto-scroll to bottom whenever messages update
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
      alert('Bidding successful!!');
      await fetchProject(params.id);
    } catch (err) {
      alert('Bidding failed!! Try again!');
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
      alert('Submission successful!!');
      await fetchProject(params.id);
    } catch (err) {
      alert('Submission failed!! Try again!');
      console.error('Submission error:', err);
    }
  };

  const handleMessageSend = async () => {
    if (!message.trim() || !socket) return;

    try {
      const messageText = message.trim();
      const messageData = {
        projectId: params.id,
        senderId: localStorage.getItem('userId'),
        message: messageText,
        time: new Date().toISOString(),
      };

      socket.emit('new-message', messageData);
      setMessage('');
      // Fallback: fetch chats after a short delay in case socket broadcast misses us
      setTimeout(() => fetchChats(), 500);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-gray-900 min-h-screen text-white flex items-center justify-center">
        <div className="bg-[#1B1F32] shadow-md rounded-lg p-6 max-w-md">
          <h3 className="text-xl font-semibold text-red-400">Project Not Found</h3>
          <p className="text-gray-300 mt-2">Unable to load project details. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white px-4 py-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1B1F32] shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-purple-200">{project.title}</h3>
          <p className="text-gray-300 mt-2">{project.description}</p>
          <div className="mt-3">
            <h5 className="font-semibold">Required Skills</h5>
            <div className="flex flex-wrap gap-2 mt-2">
              {project.skills.map((skill) => (
                <p key={skill} className="bg-purple-800 text-white px-3 py-1 text-sm rounded">
                  {skill}
                </p>
              ))}
            </div>
          </div>
          <div className="mt-3">
            <h5 className="font-semibold">Budget</h5>
            <h6 className="text-lg font-semibold text-green-400">${project.budget}</h6>
          </div>
          <div className="mt-3">
            <span className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
              project.status === 'Available' ? 'bg-green-700' :
              project.status === 'Assigned' ? 'bg-yellow-700' : 'bg-gray-600'
            }`}>
              {project.status}
            </span>
          </div>
        </div>

        {/* Freelancer Proposal Form */}
        {project.status === 'Available' && (
          <div className="bg-[#1B1F32] shadow-md rounded-lg p-6">
            <h4 className="text-lg font-semibold text-purple-400">Send Proposal</h4>
            <div className="mt-4 space-y-3">
              <input
                type="number"
                className="w-full p-3 bg-[#0B0F19] border border-gray-700 text-white rounded"
                placeholder="Your bid amount ($)"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
              />
              <input
                type="number"
                className="w-full p-3 bg-[#0B0F19] border border-gray-700 text-white rounded"
                placeholder="Estimated time (days)"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
              />
              <textarea
                className="w-full p-3 bg-[#0B0F19] border border-gray-700 text-white rounded"
                placeholder="Describe your proposal"
                rows={4}
                value={proposal}
                onChange={(e) => setProposal(e.target.value)}
              />
              {!project.bids.includes(localStorage.getItem('userId')) ? (
                <button
                  className="w-full bg-purple-500 text-white py-3 rounded hover:bg-purple-600 transition"
                  onClick={handleBidding}
                >
                  Post Bid
                </button>
              ) : (
                <button className="w-full bg-blue-500 text-white py-3 rounded opacity-60 cursor-not-allowed" disabled>
                  Already Bidded
                </button>
              )}
            </div>
          </div>
        )}

        {/* Project Submission Form */}
        {project.freelancerId === localStorage.getItem('userId') && (
          <div className="bg-[#1B1F32] shadow-md rounded-lg p-6">
            <h4 className="text-lg font-semibold text-purple-400">Submit the Project</h4>
            {project.submissionAccepted ? (
              <p className="text-green-400 mt-2 font-semibold">✅ Project Completed!</p>
            ) : (
              <div className="mt-4 space-y-3">
                <input
                  type="text"
                  className="w-full p-3 bg-[#0B0F19] border border-gray-700 text-white rounded"
                  placeholder="Project link (GitHub, live URL...)"
                  value={projectLink}
                  onChange={(e) => setProjectLink(e.target.value)}
                />
                <input
                  type="text"
                  className="w-full p-3 bg-[#0B0F19] border border-gray-700 text-white rounded"
                  placeholder="Documentation / Manual link"
                  value={manualLink}
                  onChange={(e) => setManualLink(e.target.value)}
                />
                <textarea
                  className="w-full p-3 bg-[#0B0F19] border border-gray-700 text-white rounded"
                  placeholder="Describe your work"
                  rows={4}
                  value={submissionDescription}
                  onChange={(e) => setSubmissionDescription(e.target.value)}
                />
                {project.submission ? (
                  <button className="w-full bg-gray-600 text-white py-3 rounded opacity-60 cursor-not-allowed" disabled>
                    Already Submitted — Awaiting Review
                  </button>
                ) : (
                  <button
                    className="w-full bg-purple-500 text-white py-3 rounded hover:bg-purple-600 transition"
                    onClick={handleProjectSubmission}
                  >
                    Submit Project
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chat Section — WhatsApp style */}
      <div className="bg-[#1B1F32] shadow-md rounded-lg mt-6 max-w-6xl mx-auto flex flex-col" style={{height: '520px'}}>
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-700 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold">C</div>
          <div>
            <h4 className="text-base font-semibold text-white leading-none">Chat with Client</h4>
            <p className="text-xs text-green-400 mt-0.5">Online</p>
          </div>
        </div>

        {project.freelancerId === localStorage.getItem('userId') ? (
          <>
            {/* Message list */}
            <div
              id="freelancer-chat-messages"
              className="flex-1 overflow-y-auto px-4 py-3 space-y-2"
              style={{background: '#0d1117'}}
            >
              {chats && chats.messages && chats.messages.length > 0 ? (
                chats.messages.map((msg, index) => {
                  const isMe = msg.senderId === localStorage.getItem('userId');
                  // Use project data to resolve the sender display name
                  const senderLabel = isMe
                    ? 'You'
                    : (project?.clientName || 'Client');
                  return (
                    <div key={msg.id || msg._id || index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      {/* Sender name above bubble */}
                      <span className={`text-[10px] mb-0.5 font-semibold px-1 ${
                        isMe ? 'text-purple-300' : 'text-gray-400'
                      }`}>
                        {senderLabel}
                      </span>
                      <div
                        className={`max-w-[70%] px-3 py-2 text-sm shadow ${
                          isMe
                            ? 'bg-[#6d28d9] text-white rounded-t-2xl rounded-bl-2xl rounded-br-sm'
                            : 'bg-[#1e2433] text-gray-100 rounded-t-2xl rounded-br-2xl rounded-bl-sm'
                        }`}
                      >
                        <p className="break-words leading-snug">{msg.text}</p>
                        <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-purple-200' : 'text-gray-400'}`}>
                          {new Date(msg.time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-500">
                  <p className="text-4xl">💬</p>
                  <p className="text-sm">No messages yet. Say hello!</p>
                </div>
              )}
              {/* Scroll anchor */}
              <div ref={chatEndRef} />
            </div>

            {/* Input bar */}
            <div className="px-4 py-3 border-t border-gray-700 flex items-center gap-2" style={{background:'#161b25'}}>
              <input
                type="text"
                className="flex-1 bg-[#1e2433] text-white text-sm px-4 py-2.5 rounded-full outline-none border border-gray-600 focus:border-purple-500 transition placeholder-gray-500"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleMessageSend()}
              />
              <button
                onClick={handleMessageSend}
                disabled={!message.trim()}
                className="w-10 h-10 flex items-center justify-center bg-purple-600 hover:bg-purple-700 disabled:opacity-40 rounded-full transition flex-shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white rotate-45">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 italic text-sm">Chat will be enabled once this project is assigned to you.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectData;