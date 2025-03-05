
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
 
import { GeneralContext } from '../../context/GeneralContext';

const ProjectData = () => {
  const { socket } = useContext(GeneralContext);
  const params = useParams();
  const [project, setProject] = useState();
  const [clientId, setClientId] = useState('');
  const [freelancerId, setFreelancerId] = useState(localStorage.getItem('userId'));
  const [projectId, setProjectId] = useState(params['id']);
  const [proposal, setProposal] = useState('');
  const [bidAmount, setBidAmount] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [manualLink, setManualLink] = useState('');
  const [submissionDescription, setSubmissionDescription] = useState('');
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState();

  useEffect(() => {
    fetchProject(params['id']);
    joinSocketRoom();
  }, []);

  const joinSocketRoom = async () => {
    await socket.emit("join-chat-room", { projectId: params['id'], freelancerId: localStorage.getItem("userId") });
  };

  const fetchProject = async (id) => {
    await axios.get(`http://localhost:6001/fetch-project/${id}`).then(
      (response) => {
        setProject(response.data);
        setProjectId(response.data._id);
        setClientId(response.data.clientId);
      }
    ).catch((err) => {
      console.log(err);
    });
  };

  const handleBidding = async () => {
    await axios.post("http://localhost:6001/make-bid", { clientId, freelancerId, projectId, proposal, bidAmount, estimatedTime }).then(
      (response) => {
        setProposal('');
        setBidAmount(0);
        setEstimatedTime('');
        alert("Bidding successful!!");
      }
    ).catch((err) => {
      alert("Bidding failed!! Try again!");
    });
  };

  const handleProjectSubmission = async () => {
    await axios.post("http://localhost:6001/submit-project", { clientId, freelancerId, projectId, projectLink, manualLink, submissionDescription }).then(
      (response) => {
        setProjectLink('');
        setManualLink('');
        setSubmissionDescription('');
        alert("Submission successful!!");
      }
    ).catch((err) => {
      alert("Submission failed!! Try again!");
    });
  };

  const handleMessageSend = async () => {
    socket.emit("new-message", { projectId: params['id'], senderId: localStorage.getItem("userId"), message, time: new Date() });
    fetchChats();
    setMessage("");
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    await axios.get(`http://localhost:6001/fetch-chats/${params['id']}`).then(
      (response) => {
        setChats(response.data);
      }
    );
  };

  useEffect(() => {
    socket.on("message-from-user", () => {
      fetchChats();
    });
  }, [socket]);

  return (
    <>
      {project ?
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
                <h6 className="text-lg font-semibold text-green-400">&#8377; {project.budget}</h6>
              </span>
            </div>

            {/* Freelancer proposal */}
            {project.status === "Available" ?
              <div className="bg-[#1B1F32] shadow-md rounded-lg p-6">
                <h4 className="text-lg font-semibold text-purple-400">Send proposal</h4>
                <div className="mt-4">
                  <div className="form-floating">
                    <input type="number" className="w-full p-3 bg-[#0B0F19] border border-gray-700 text-white rounded mb-3" placeholder="Budget" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} />
                    <label>Budget</label>
                  </div>
                  <div className="form-floating">
                    <input type="number" className="w-full p-3 bg-[#0B0F19] border border-gray-700 text-white rounded mb-3" placeholder="Estimated time (days)" value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} />
                    <label>Estimated time (days)</label>
                  </div>
                  <div className="form-floating">
                    <textarea className="w-full p-3 bg-[#0B0F19] border border-gray-700 text-white rounded mb-3" placeholder="Describe your proposal" value={proposal} onChange={(e) => setProposal(e.target.value)} />
                    <label>Describe your proposal</label>
                  </div>
                  {!project.bids.includes(localStorage.getItem('userId')) ?
                    <button className='w-full bg-purple-500 text-white py-3 rounded hover:bg-purple-600 transition' onClick={handleBidding}>Post Bid</button> :
                    <button className='w-full bg-blue-500 text-white py-3 rounded' disabled>Already bidded</button>
                  }
                </div>
              </div>
              : ""}

            {project.freelancerId === localStorage.getItem('userId') ?
              <div className="bg-[#1B1F32] shadow-md rounded-lg p-6">
                <h4 className="text-lg font-semibold text-purple-400">Submit the project</h4>
                {project.submissionAccepted ?
                  <p>Project completed</p>
                  :
                  <>
                    <div className="form-floating">
                      <input type="text" className="w-full p-3 bg-[#0B0F19] border border-gray-700 text-white rounded mb-3" placeholder="Project link" value={projectLink} onChange={(e) => setProjectLink(e.target.value)} />
                      <label>Project link</label>
                    </div>
                    <div className="form-floating">
                      <input type="text" className="w-full p-3 bg-[#0B0F19] border border-gray-700 text-white rounded mb-3" placeholder="Manual link" value={manualLink} onChange={(e) => setManualLink(e.target.value)} />
                      <label>Manual link</label>
                    </div>
                    <div className="form-floating">
                      <textarea className="w-full p-3 bg-[#0B0F19] border border-gray-700 text-white rounded mb-3" placeholder="Describe your work" value={submissionDescription} onChange={(e) => setSubmissionDescription(e.target.value)} />
                      <label>Describe your work</label>
                    </div>
                    {project.submission ?
                      <button className="w-full bg-gray-500 text-white py-3 rounded" disabled>Already submitted</button>
                      :
                      <button className="w-full bg-purple-500 text-white py-3 rounded hover:bg-purple-600 transition" onClick={handleProjectSubmission}>Submit project</button>
                    }
                  </>
                }
              </div>
              : ""}
          </div>

          <div className="bg-[#1B1F32] shadow-md rounded-lg p-6 mt-6  ">
            <h4 className="text-lg font-semibold text-purple-400">Chat with the client</h4>
            <hr className="my-4" />
            {project.freelancerId === localStorage.getItem('userId') ?
              <div className="chat-body">
                {chats ?
                  <div className="chat-messages h-64 overflow-y-auto bg-[#0B0F19] p-4 rounded border border-gray-700">
                    {chats.messages.map((message) => (
                      <div className={message.senderId === localStorage.getItem("userId") ? "text-right" : "text-left"} key={message.id}>
                        <div className={`bg-purple-800 text-white px-3 py-1  text-sm rounded inline-block max-w-xs break-words my-2 ${message.senderId === localStorage.getItem("userId") ? "ml-auto" : "mr-auto "}`}>
                          <p>{message.text}</p>
                          <h6 className="text-[10px]">{message.time.slice(5, 10)} - {message.time.slice(11, 19)}</h6>
                        </div>
                      </div>
                    ))}
                  </div>
                  : ""}
                <hr className="my-4" />
                <div className="flex">
                  <input type="text" className='flex-grow p-3 bg-[#0B0F19] border border-gray-700 text-white rounded' placeholder='Enter something...' value={message} onChange={(e) => setMessage(e.target.value)} />
                    <button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 px-6 rounded-lg shadow-md hover:from-purple-600 hover:to-indigo-600 hover:scale-105 transition-all duration-300 ease-in-out" onClick={handleMessageSend}>
                         Send
                  </button>

                </div>
              </div>
              :
              <i style={{ color: '#938f8f' }}>Chat will be enabled if the project is assigned to you!!</i>
            }
          </div>
        </div>
        : ""}
    </>
  );
};

export default ProjectData;