 
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { GeneralContext } from '../../context/GeneralContext';

const ProjectWorking = () => {
  const { socket } = useContext(GeneralContext);
  const params = useParams();
  const [project, setProject] = useState();
  const [clientId, setClientId] = useState(localStorage.getItem('userId'));
  const [projectId, setProjectId] = useState(params['id']);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState({ messages: [] });
  const [loading, setLoading] = useState(true);

  // Fetch project and join socket room on component mount
  useEffect(() => {
    fetchProject(params['id']);
    joinSocketRoom();
    
    // Set up socket listeners
    socket.on("message-from-user", () => {
      fetchChats();
    });
    
    // Cleanup the socket listener on component unmount
    return () => {
      socket.off("message-from-user");
    };
  }, []);

  const joinSocketRoom = async () => {
    await socket.emit("join-chat-room", { projectId: params['id'], freelancerId: "" });
  };

  const fetchProject = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}
/fetch-project/${id}`);
      setProject(response.data);
      setProjectId(response.data._id);
      setClientId(response.data.clientId);
      // Fetch chats after project is loaded
      await fetchChats();
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const fetchChats = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}
/fetch-chats/${params['id']}`);
      if (response.data && response.data.messages) {
        setChats(response.data);
      } else {
        setChats({ messages: [] });
      }
    } catch (err) {
      console.log("Error fetching chats:", err);
      setChats({ messages: [] });
    }
  };

  const handleApproveSubmission = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_API_BASE_URL}
/approve-submission/${params['id']}`);
      fetchProject(params['id']);
      alert("Submission approved!");
    } catch (err) {
      console.log(err);
      alert("Failed to approve submission.");
    }
  };

  const handleRejectSubmission = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_API_BASE_URL}
/reject-submission/${params['id']}`);
      fetchProject(params['id']);
      alert("Submission rejected!");
    } catch (err) {
      console.log(err);
      alert("Failed to reject submission.");
    }
  };

 // When sending a message
const handleMessageSend = async () => {
  if (!message.trim()) return; // Prevent empty messages
  
  try {
    // Make sure we have valid text before sending
    const messageText = message.trim();
    
    // Create message object with all fields properly set
    const messageData = { 
      projectId: params['id'], 
      senderId: localStorage.getItem("userId"), 
      message: messageText, // Make sure this field name matches what your server expects
      text: messageText, // Add this as a backup if your server uses 'text' instead of 'message'
      time: new Date().toISOString() 
    };
    
    // Emit with the complete message object
    socket.emit("new-message", messageData);
    console.log("Sending message:", messageData);
    
    // Clear input field
    setMessage("");
    
    // Fetch chats with a slight delay to allow server processing
    setTimeout(fetchChats, 800);
  } catch (err) {
    console.error("Error sending message:", err);
  }
};

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleMessageSend();
    }
  };

  if (loading) {
    return <div className="p-6 bg-gray-900 min-h-screen text-white flex items-center justify-center">
      <p>Loading project details...</p>
    </div>;
  }

  return (
    <>
      {project ? (
        <div className="p-6 bg-gray-900 min-h-screen text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold">{project.title}</h3>
              <p className="mt-2 text-gray-300">{project.description}</p>
              <div className="mt-4">
                <h5 className="text-lg font-medium">Required skills</h5>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.skills && project.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-purple-600 rounded-full text-sm">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <h5 className="text-lg font-medium">Budget</h5>
                <h6 className="text-green-400 font-semibold">$ {project.budget}</h6>
              </div>
            </div>
            
            <div className="project-submissions-container bg-[#1B1F32] shadow-md rounded-lg p-6">
              <h4 className="text-lg font-semibold text-purple-400">Submission</h4>
              {project.submission ? (
                <div className="project-submission">
                  <span className="block mb-2">
                    <h5 className="font-semibold">Project Link:</h5>
                    <a href={project.projectLink} target='_blank' rel="noopener noreferrer" className="text-blue-400 hover:underline">{project.projectLink}</a>
                  </span>
                  <span className="block mb-2">
                    <h5 className="font-semibold">Manual Link:</h5>
                    <a href={project.manualLink} target='_blank' rel="noopener noreferrer" className="text-blue-400 hover:underline">{project.manualLink}</a>
                  </span>
                  <h5 className="font-semibold mt-4">Description for work:</h5>
                  <p className="text-gray-300">{project.submissionDescription}</p>
                  {project.submissionAccepted ? (
                    <h5 className="text-green-400 font-semibold mt-4">Project completed!!</h5>
                  ) : (
                    <div className="submission-btns mt-4">
                      <button className='bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition mr-2' onClick={handleApproveSubmission}>Approve</button>
                      <button className='bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition' onClick={handleRejectSubmission}>Reject</button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-300">No submissions yet!!</p>
              )}
            </div>
          </div>
          
          <div className="mt-6 bg-gray-800 p-6 rounded-xl shadow-lg">
            <h4 className="text-lg font-semibold">Chat with the Freelancer</h4>
            <div id="chat-container" className="mt-4 h-64 overflow-y-auto bg-gray-900 p-4 rounded-lg">
              {chats && chats.messages && chats.messages.length > 0 ? (
                chats.messages.map((message, index) => (
                  <div key={message._id || index} className={`p-2 px-3 my-2 rounded-lg w-max max-w-[80%] ${message.senderId === localStorage.getItem("userId") ? "bg-purple-600 ml-auto" : "bg-gray-700"}`}>
                    <p className="break-words">{message.text}</p>
                    <h6 className="text-[10px] text-gray-300 mt-1">
                      {new Date(message.time).toLocaleDateString()} - {new Date(message.time).toLocaleTimeString()}
                    </h6>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">No messages yet. Start the conversation!</p>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <input 
                type="text" 
                className="flex-1 p-2 bg-gray-700 rounded" 
                placeholder="Enter message..." 
                value={message} 
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button 
                className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 transition disabled:opacity-50" 
                onClick={handleMessageSend}
                disabled={!message.trim()}
              >
                Send
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