 

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
  const [chats, setChats] = useState();

  useEffect(() => {
    fetchProject(params['id']);
    joinSocketRoom();
  }, []);

  const joinSocketRoom = async () => {
    await socket.emit("join-chat-room", { projectId: params['id'], freelancerId: "" });
  };

  const fetchProject = async (id) => {
    await axios.get(`http://localhost:6001/fetch-project/${id}`)
      .then((response) => {
        setProject(response.data);
        setProjectId(response.data._id);
        setClientId(response.data.clientId);
      })
      .catch((err) => console.log(err));
  };

  const handleApproveSubmission = async () => {
    await axios.get(`http://localhost:6001/approve-submission/${params['id']}`)
      .then(() => {
        fetchProject(params['id']);
        alert("Submission approved!");
      })
      .catch((err) => console.log(err));
  };

  const handleRejectSubmission = async () => {
    await axios.get(`http://localhost:6001/reject-submission/${params['id']}`)
      .then(() => {
        fetchProject(params['id']);
        alert("Submission rejected!");
      })
      .catch((err) => console.log(err));
  };

  const handleMessageSend = async () => {
    socket.emit("new-message", { projectId: params['id'], senderId: localStorage.getItem("userId"), message, time: new Date() });
    setMessage("");
    fetchChats();
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    await axios.get(`http://localhost:6001/fetch-chats/${params['id']}`)
      .then((response) => {
        setChats(response.data);
      });
  };

  useEffect(() => {
    socket.on("message-from-user", () => {
      fetchChats();
    });
  }, [socket]);

 
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
                  {project.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-purple-600 rounded-full text-sm">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <h5 className="text-lg font-medium">Budget</h5>
                <h6 className="text-green-400 font-semibold">₹ {project.budget}</h6>
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
            <div className="mt-4 h-64 overflow-y-auto bg-gray-900 p-4 rounded-lg">
              {chats && chats.messages.map((message) => (
                <div key={message.id} className={`p-1 px-2 my-2 rounded-lg w-max ${message.senderId === localStorage.getItem("userId") ? "bg-purple-600 ml-auto" : "bg-purple-600"}`}>
                  <p>{message.text}</p>
                  <h6 className="text-[10px]">{message.time.slice(5, 10)} - {message.time.slice(11, 19)}</h6>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input type="text" className="flex-1 p-2 bg-gray-700 rounded" placeholder="Enter something..." value={message} onChange={(e) => setMessage(e.target.value)} />
              <button className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700" onClick={handleMessageSend}>Send</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ProjectWorking;
