import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GeneralContext, api } from '../../context/GeneralContext';

const ProjectWorking = () => {
  const { socket } = useContext(GeneralContext);
  const params = useParams();
  const [project, setProject] = useState(null);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState({ messages: [] });
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchProject(params.id);
  }, [params.id]);

  // Socket connection management — joins room on connect AND reconnect
  useEffect(() => {
    if (!socket) return;

    const joinRoom = () => {
      socket.emit('join-chat-room-client', { projectId: params.id });
    };

    // Join immediately if already connected
    if (socket.connected) {
      joinRoom();
    }

    // Re-join on every (re)connection so room membership is restored
    socket.on('connect', joinRoom);

    const handleMessagesUpdated = ({ chat }) => {
      console.log('[Client Chat] messages-updated received:', JSON.stringify(chat?.messages?.length), chat);
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

  // Auto-scroll to bottom on new messages
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
      alert('Submission approved!');
      fetchProject(params.id);
    } catch (err) {
      console.error(err);
      alert('Failed to approve submission.');
    }
  };

  const handleRejectSubmission = async () => {
    try {
      await api.get(`/reject-submission/${params.id}`);
      alert('Submission rejected!');
      fetchProject(params.id);
    } catch (err) {
      console.error(err);
      alert('Failed to reject submission.');
    }
  };

  const handleMessageSend = async () => {
    if (!message.trim() || !socket) return;

    try {
      const messageData = {
        projectId: params.id,
        senderId: localStorage.getItem('userId'),
        message: message.trim(),
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
      <div className="p-6 bg-gray-900 min-h-screen text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <>
      {project ? (
        <div className="p-6 bg-gray-900 min-h-screen text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Details */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold">{project.title}</h3>
              <p className="mt-2 text-gray-300">{project.description}</p>
              <div className="mt-4">
                <h5 className="text-lg font-medium">Required Skills</h5>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.skills && project.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-purple-600 rounded-full text-sm">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <h5 className="text-lg font-medium">Budget</h5>
                <h6 className="text-green-400 font-semibold">${project.budget}</h6>
              </div>
              <div className="mt-4">
                <span className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
                  project.status === 'Assigned' ? 'bg-yellow-700' : 'bg-green-700'
                }`}>
                  {project.status}
                </span>
              </div>
              {project.freelancerName && (
                <p className="mt-3 text-gray-400 text-sm">Assigned to: <span className="text-white">{project.freelancerName}</span></p>
              )}
            </div>

            {/* Submission Panel */}
            <div className="bg-[#1B1F32] shadow-md rounded-lg p-6">
              <h4 className="text-lg font-semibold text-purple-400">Submission</h4>
              {project.submission ? (
                <div className="mt-4 space-y-3">
                  <div>
                    <h5 className="font-semibold">Project Link:</h5>
                    <a href={project.projectLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                      {project.projectLink}
                    </a>
                  </div>
                  {project.manualLink && (
                    <div>
                      <h5 className="font-semibold">Documentation Link:</h5>
                      <a href={project.manualLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                        {project.manualLink}
                      </a>
                    </div>
                  )}
                  <div>
                    <h5 className="font-semibold">Description:</h5>
                    <p className="text-gray-300">{project.submissionDescription}</p>
                  </div>
                  {project.submissionAccepted ? (
                    <h5 className="text-green-400 font-semibold">✅ Project Completed!</h5>
                  ) : (
                    <div className="flex gap-3 mt-4">
                      <button
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
                        onClick={handleApproveSubmission}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                        onClick={handleRejectSubmission}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-400 mt-4">No submission yet from the freelancer.</p>
              )}
            </div>
          </div>

          {/* Chat Section — WhatsApp style */}
          <div className="mt-6 rounded-xl shadow-lg flex flex-col overflow-hidden border border-gray-700" style={{height: '520px', background: '#161b25'}}>
            {/* Chat header */}
            <div className="px-5 py-4 border-b border-gray-700 flex items-center gap-3" style={{background: '#1e2433'}}>
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">F</div>
              <div>
                <h4 className="text-base font-semibold text-white leading-none">Chat with Freelancer</h4>
                <p className="text-xs text-green-400 mt-0.5">
                  {project.freelancerName || 'Freelancer'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div
              id="client-chat-messages"
              className="flex-1 overflow-y-auto px-4 py-3 space-y-1"
              style={{background: '#0d1117'}}
            >
              {chats && chats.messages && chats.messages.length > 0 ? (
                chats.messages.map((msg, index) => {
                  const isMe = msg.senderId === localStorage.getItem('userId');
                  const senderLabel = isMe
                    ? 'You'
                    : (project?.freelancerName || 'Freelancer');
                  return (
                    <div key={msg._id || msg.id || index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      {/* Sender name above bubble */}
                      <span className={`text-[10px] mb-0.5 font-semibold px-1 ${
                        isMe ? 'text-blue-300' : 'text-gray-400'
                      }`}>
                        {senderLabel}
                      </span>
                      <div
                        className={`max-w-[70%] px-3 py-2 text-sm shadow ${
                          isMe
                            ? 'bg-[#1d4ed8] text-white rounded-t-2xl rounded-bl-2xl rounded-br-sm'
                            : 'bg-[#1e2433] text-gray-100 rounded-t-2xl rounded-br-2xl rounded-bl-sm'
                        }`}
                      >
                        <p className="break-words leading-snug">{msg.text}</p>
                        <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                          {new Date(msg.time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-500">
                  <p className="text-4xl">💬</p>
                  <p className="text-sm">No messages yet. Start the conversation!</p>
                </div>
              )}
              {/* Scroll anchor */}
              <div ref={chatEndRef} />
            </div>

            {/* Input bar */}
            <div className="px-4 py-3 border-t border-gray-700 flex items-center gap-2" style={{background: '#1e2433'}}>
              <input
                type="text"
                className="flex-1 bg-[#0d1117] text-white text-sm px-4 py-2.5 rounded-full outline-none border border-gray-600 focus:border-blue-500 transition placeholder-gray-500"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleMessageSend()}
              />
              <button
                onClick={handleMessageSend}
                disabled={!message.trim()}
                className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-full transition flex-shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white rotate-45">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>

      ) : (
        <div className="p-6 bg-gray-900 min-h-screen text-white flex items-center justify-center">
          <p>Project not found or error loading project.</p>
        </div>
      )}
    </>
  );
};

export default ProjectWorking;