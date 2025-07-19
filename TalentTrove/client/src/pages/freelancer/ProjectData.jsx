  
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
 
import { GeneralContext } from '../../context/GeneralContext';

const ProjectData = () => {
  const { socket } = useContext(GeneralContext);
  const params = useParams();
  const [project, setProject] = useState(null);
  const [clientId, setClientId] = useState('');
  const [freelancerId, setFreelancerId] = useState(localStorage.getItem('userId'));
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

  // Combined project and chat loading into a single effect
  useEffect(() => {
    const loadProjectAndChats = async () => {
      setLoading(true);
      try {
        await fetchProject(params.id);
        await fetchChats();
      } catch (error) {
        console.error("Error loading project data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProjectAndChats();
  }, [params.id]);

  // Socket connection management
  useEffect(() => {
    if (!socket) return;

    // Join chat room when socket is available
    socket.emit("join-chat-room", { 
      projectId: params.id, 
      freelancerId: localStorage.getItem("userId") 
    });

    // Listen for new messages
    socket.on("new-message", (message) => {
      setChats(prevChats => ({
        ...prevChats,
        messages: [...(prevChats.messages || []), message]
      }));
    });

    // Cleanup event listeners on unmount
    return () => {
      socket.off("new-message");
      socket.emit("leave-chat-room", { 
        projectId: params.id, 
        freelancerId: localStorage.getItem("userId") 
      });
    };
  }, [socket, params.id]);

  const fetchProject = async (id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/fetch-project/${id}`);
      setProject(response.data);
      setProjectId(response.data._id);
      setClientId(response.data.clientId);
      return response.data;
    } catch (err) {
      console.error("Error fetching project:", err);
      throw err;
    }
  };

  const fetchChats = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/fetch-chats/${params.id}`);
      if (response.data && Array.isArray(response.data.messages)) {
        setChats(response.data);
      } else {
        // Handle case where response doesn't have the expected structure
        setChats({ messages: [] });
        console.warn("Chat data format unexpected:", response.data);
      }
      return response.data;
    } catch (err) {
      console.error("Error fetching chats:", err);
      setChats({ messages: [] });
      throw err;
    }
  };

  const handleBidding = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}
/make-bid`, { 
        clientId, 
        freelancerId, 
        projectId, 
        proposal, 
        bidAmount, 
        estimatedTime 
      });
      
      setProposal('');
      setBidAmount(0);
      setEstimatedTime('');
      alert("Bidding successful!!");
      
      // Refresh project data to update UI
      await fetchProject(params.id);
    } catch (err) {
      alert("Bidding failed!! Try again!");
      console.error("Bidding error:", err);
    }
  };

  const handleProjectSubmission = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}
/submit-project`, { 
        clientId, 
        freelancerId, 
        projectId, 
        projectLink, 
        manualLink, 
        submissionDescription 
      });
      
      setProjectLink('');
      setManualLink('');
      setSubmissionDescription('');
      alert("Submission successful!!");
      
      // Refresh project data to update UI
      await fetchProject(params.id);
    } catch (err) {
      alert("Submission failed!! Try again!");
      console.error("Submission error:", err);
    }
  };

  
const handleMessageSend = async () => {
  if (!message.trim()) return;  
  
  try {
     
    const messageText = message.trim();
    
     
    const messageData = { 
      projectId: params['id'], 
      senderId: localStorage.getItem("userId"), 
      message: messageText,  
      text: messageText,  
      time: new Date().toISOString() 
    };
    
    
    socket.emit("new-message", messageData);
    console.log("Sending message:", messageData);
    
    
    setMessage("");
    
    
    setTimeout(fetchChats, 800);
  } catch (err) {
    console.error("Error sending message:", err);
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
          <span>
            <h5 className="mt-2">Required skills</h5>
            <div className="flex flex-wrap gap-2 mt-2">
              {project.skills.map((skill) => (
                <p key={skill} className="bg-purple-800 text-white px-3 py-1 text-sm rounded">{skill}</p>
              ))}
            </div>
          </span>
          <span>
            <h5 className="mt-2">Budget</h5>
            <h6 className="text-lg font-semibold text-green-400"> ${project.budget}</h6>
          </span>
        </div>

        {/* Freelancer proposal */}
        {project.status === "Available" && (
          <div className="bg-[#1B1F32] shadow-md rounded-lg p-6">
            <h4 className="text-lg font-semibold text-purple-400">Send proposal</h4>
            <div className="mt-4">
              <div className="form-floating">
                <input 
                  type="number" 
                  className="w-full p-3 bg-[#0B0F19] border border-gray-700 text-white rounded mb-3" 
                  placeholder="Budget" 
                  value={bidAmount} 
                  onChange={(e) => setBidAmount(e.target.value)} 
                />
                <label>Budget</label>
              </div>
              <div className="form-floating">
                <input 
                  type="number" 
                  className="w-full p-3 bg-[#0B0F19] border border-gray-700 text-white rounded mb-3" 
                  placeholder="Estimated time (days)" 
                  value={estimatedTime} 
                  onChange={(e) => setEstimatedTime(e.target.value)} 
                />
                <label>Estimated time (days)</label>
              </div>
              <div className="form-floating">
                <textarea 
                  className="w-full p-3 bg-[#0B0F19] border border-gray-700 text-white rounded mb-3" 
                  placeholder="Describe your proposal" 
                  value={proposal} 
                  onChange={(e) => setProposal(e.target.value)} 
                />
                <label>Describe your proposal</label>
              </div>
              {!project.bids.includes(localStorage.getItem('userId')) ? (
                <button 
                  className='w-full bg-purple-500 text-white py-3 rounded hover:bg-purple-600 transition' 
                  onClick={handleBidding}
                >
                  Post Bid
                </button>
              ) : (
                <button 
                  className='w-full bg-blue-500 text-white py-3 rounded' 
                  disabled
                >
                  Already bidded
                </button>
              )}
            </div>
          </div>
        )}

        {project.freelancerId === localStorage.getItem('userId') && (
          <div className="bg-[#1B1F32] shadow-md rounded-lg p-6">
            <h4 className="text-lg font-semibold text-purple-400">Submit the project</h4>
            {project.submissionAccepted ? (
              <p>Project completed</p>
            ) : (
              <>
                <div className="form-floating">
                  <input 
                    type="text" 
                    className="w-full p-3 bg-[#0B0F19] border border-gray-700 text-white rounded mb-3" 
                    placeholder="Project link" 
                    value={projectLink} 
                    onChange={(e) => setProjectLink(e.target.value)} 
                  />
                  <label>Project link</label>
                </div>
                <div className="form-floating">
                  <input 
                    type="text" 
                    className="w-full p-3 bg-[#0B0F19] border border-gray-700 text-white rounded mb-3" 
                    placeholder="Manual link" 
                    value={manualLink} 
                    onChange={(e) => setManualLink(e.target.value)} 
                  />
                  <label>Manual link</label>
                </div>
                <div className="form-floating">
                  <textarea 
                    className="w-full p-3 bg-[#0B0F19] border border-gray-700 text-white rounded mb-3" 
                    placeholder="Describe your work" 
                    value={submissionDescription} 
                    onChange={(e) => setSubmissionDescription(e.target.value)} 
                  />
                  <label>Describe your work</label>
                </div>
                {project.submission ? (
                  <button 
                    className="w-full bg-gray-500 text-white py-3 rounded" 
                    disabled
                  >
                    Already submitted
                  </button>
                ) : (
                  <button 
                    className="w-full bg-purple-500 text-white py-3 rounded hover:bg-purple-600 transition" 
                    onClick={handleProjectSubmission}
                  >
                    Submit project
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="bg-[#1B1F32] shadow-md rounded-lg p-6 mt-6">
        <h4 className="text-lg font-semibold text-purple-400">Chat with the client</h4>
        <hr className="my-4" />
        {project.freelancerId === localStorage.getItem('userId') ? (
          <div className="chat-body">
            <div className="chat-messages h-64 overflow-y-auto bg-[#0B0F19] p-4 rounded border border-gray-700">
              {chats && chats.messages && chats.messages.length > 0 ? (
                chats.messages.map((message, index) => (
                  <div 
                    className={message.senderId === localStorage.getItem("userId") ? "text-right" : "text-left"} 
                    key={message.id || message._id || `message-${index}-${message.time}`}
                  >
                    <div 
                      className={`bg-purple-800 text-white px-3 py-1 text-sm rounded inline-block max-w-xs break-words my-2 ${
                        message.senderId === localStorage.getItem("userId") ? "ml-auto" : "mr-auto"
                      }`}
                    >
                      <p>{message.text}</p>
                      <h6 className="text-[10px]">
                        {typeof message.time === 'string' ? 
                          `${message.time.slice(5, 10)} - ${message.time.slice(11, 19)}` : 
                          new Date(message.time).toLocaleString()
                        }
                      </h6>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-400">No messages yet. Start the conversation!</p>
                </div>
              )}
            </div>
            <hr className="my-4" />
            <div className="flex">
              <input 
                type="text" 
                className="flex-grow p-3 bg-[#0B0F19] border border-gray-700 text-white rounded" 
                placeholder="Enter something..." 
                value={message} 
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleMessageSend()}
              />
              <button 
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 px-6 rounded-lg shadow-md hover:from-purple-600 hover:to-indigo-600 hover:scale-105 transition-all duration-300 ease-in-out ml-2" 
                onClick={handleMessageSend}
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <i style={{ color: '#938f8f' }}>Chat will be enabled if the project is assigned to you!!</i>
        )}
      </div>
    </div>
  );
};

export default ProjectData;