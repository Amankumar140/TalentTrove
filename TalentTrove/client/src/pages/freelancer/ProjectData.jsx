 



import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { GeneralContext } from "../../context/GeneralContext";

const ProjectData = () => {
  const { socket } = useContext(GeneralContext);
  const params = useParams();
  const [project, setProject] = useState(null);
  const [clientId, setClientId] = useState("");
  const [freelancerId] = useState(localStorage.getItem("userId"));
  const [projectId, setProjectId] = useState(params["id"]);
  const [proposal, setProposal] = useState("");
  const [bidAmount, setBidAmount] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [manualLink, setManualLink] = useState("");
  const [submissionDescription, setSubmissionDescription] = useState("");
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);

  useEffect(() => {
    fetchProject(params["id"]);
    socket.emit("join-chat-room", {
      projectId: params["id"],
      freelancerId: freelancerId,
    });
  }, []);

  const fetchProject = async (id) => {
    try {
      const response = await axios.get(`http://localhost:6001/fetch-project/${id}`);
      setProject(response.data);
      setProjectId(response.data._id);
      setClientId(response.data.clientId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBidding = async () => {
    try {
      await axios.post("http://localhost:6001/make-bid", {
        clientId,
        freelancerId,
        projectId,
        proposal,
        bidAmount,
        estimatedTime,
      });
      setProposal("");
      setBidAmount(0);
      setEstimatedTime(0);
      alert("Bidding successful!");
    } catch (err) {
      alert("Bidding failed! Try again.");
    }
  };

  const handleProjectSubmission = async () => {
    try {
      await axios.post("http://localhost:6001/submit-project", {
        clientId,
        freelancerId,
        projectId,
        projectLink,
        manualLink,
        submissionDescription,
      });
      setProjectLink("");
      setManualLink("");
      setSubmissionDescription("");
      alert("Submission successful!");
    } catch (err) {
      alert("Submission failed! Try again.");
    }
  };

  useEffect(() => {
    fetchChats();
    socket.on("message-from-user", () => {
      fetchChats();
    });
  }, [socket]);

  const fetchChats = async () => {
    try {
      const response = await axios.get(`http://localhost:6001/fetch-chats/${params["id"]}`);
      setChats(response.data.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMessageSend = () => {
    socket.emit("new-message", {
      projectId: params["id"],
      senderId: freelancerId,
      message,
      time: new Date(),
    });
    fetchChats();
    setMessage("");
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {project ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Project Details */}
          <div className="bg-white shadow-lg rounded-lg p-4">
            <h3 className="text-xl font-semibold">{project.title}</h3>
            <p className="text-gray-600">{project.description}</p>
            <div className="mt-4">
              <h5 className="font-medium">Required Skills</h5>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.skills.map((skill) => (
                  <span key={skill} className="bg-blue-500 text-white px-3 py-1 text-sm rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <h5 className="font-medium">Budget</h5>
              <h6 className="text-lg font-semibold">₹ {project.budget}</h6>
            </div>
          </div>

          {/* Proposal Form */}
          {project.status === "Available" && (
            <div className="bg-gray-100 shadow-md rounded-lg p-4">
              <h4 className="text-lg font-semibold">Send Proposal</h4>
              <div className="mt-2">
                <input
                  type="number"
                  className="w-full p-2 border rounded mt-2"
                  placeholder="Budget"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                />
                <input
                  type="number"
                  className="w-full p-2 border rounded mt-2"
                  placeholder="Estimated time (days)"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                />
                <textarea
                  className="w-full p-2 border rounded mt-2"
                  placeholder="Describe your proposal"
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                />
                {!project.bids.includes(freelancerId) ? (
                  <button className="w-full mt-3 bg-green-500 text-white py-2 rounded" onClick={handleBidding}>
                    Post Bid
                  </button>
                ) : (
                  <button className="w-full mt-3 bg-gray-400 text-white py-2 rounded" disabled>
                    Already Bidded
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Chat Section */}
          <div className="col-span-2 bg-gray-100 shadow-md rounded-lg p-4">
            <h4 className="text-lg font-semibold">Chat with the Client</h4>
            {project.freelancerId === freelancerId ? (
              <div className="chat-body mt-4">
                <div className="chat-messages max-h-60 overflow-auto bg-white p-2 rounded">
                  {chats.length > 0 ? (
                    chats.map((chat, index) => (
                      <div key={index} className={`p-2 my-1 text-sm rounded ${chat.senderId === freelancerId ? "bg-blue-500 text-white ml-auto w-fit" : "bg-gray-300 text-black w-fit"}`}>
                        <p>{chat.text}</p>
                        <h6 className="text-xs opacity-80">{new Date(chat.time).toLocaleString()}</h6>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No messages yet</p>
                  )}
                </div>
                <div className="flex mt-2">
                  <input
                    type="text"
                    className="flex-1 p-2 border rounded-l"
                    placeholder="Enter message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button className="bg-blue-500 text-white px-4 rounded-r" onClick={handleMessageSend}>
                    Send
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Chat will be enabled once the project is assigned to you.</p>
            )}
          </div>
        </div>
      ) : (
        <p>Loading project details...</p>
      )}
    </div>
  );
};

export default ProjectData;
