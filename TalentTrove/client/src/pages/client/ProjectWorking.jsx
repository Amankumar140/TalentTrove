 



import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { GeneralContext } from '../../context/GeneralContext';

const ProjectWorking = () => {
  const { socket } = useContext(GeneralContext);
  const params = useParams();
  const [project, setProject] = useState(null);
  const [clientId, setClientId] = useState(localStorage.getItem('userId'));
  const [projectId, setProjectId] = useState(params.id);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);

  useEffect(() => {
    fetchProject(params.id);
    joinSocketRoom();
    fetchChats();
  }, []);

  const joinSocketRoom = async () => {
    await socket.emit('join-chat-room', { projectId: params.id, freelancerId: '' });
  };

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

  const handleApproveSubmission = async () => {
    try {
      await axios.get(`http://localhost:6001/approve-submission/${params.id}`);
      fetchProject(params.id);
      alert('Submission approved!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectSubmission = async () => {
    try {
      await axios.get(`http://localhost:6001/reject-submission/${params.id}`);
      fetchProject(params.id);
      alert('Submission rejected!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleMessageSend = async () => {
    socket.emit('new-message', {
      projectId: params.id,
      senderId: localStorage.getItem('userId'),
      message,
      time: new Date()
    });
    setMessage('');
    fetchChats();
  };

  const fetchChats = async () => {
    try {
      const response = await axios.get(`http://localhost:6001/fetch-chats/${params.id}`);
      setChats(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    socket.on('message-from-user', fetchChats);
  }, [socket]);

  return (
    <div className="container mx-auto p-6">
      {project && (
        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-blue-400">{project.title}</h3>
          <p className="mt-2 text-gray-300">{project.description}</p>
          <h5 className="mt-4 text-lg font-semibold">Required Skills</h5>
          <div className="flex flex-wrap gap-2 mt-2">
            {project.skills.map((skill) => (
              <span key={skill} className="bg-blue-600 px-3 py-1 rounded-full text-sm">{skill}</span>
            ))}
          </div>
          <h5 className="mt-4 text-lg font-semibold">Budget: ₹ {project.budget}</h5>
        </div>
      )}

      {project?.freelancerId && (
        <div className="mt-6 bg-gray-800 text-white p-6 rounded-lg shadow-lg">
          <h4 className="text-xl font-bold">Submission</h4>
          {project.submission ? (
            <div className="mt-4">
              <p>
                <strong>Project Link:</strong>{' '}
                <a href={project.projectLink} target="_blank" className="text-blue-400">{project.projectLink}</a>
              </p>
              <p>
                <strong>Manual Link:</strong>{' '}
                <a href={project.manulaLink} target="_blank" className="text-blue-400">{project.manulaLink}</a>
              </p>
              <p className="mt-2 text-gray-300">{project.submissionDescription}</p>
              {project.submissionAccepted ? (
                <h5 className="text-green-400 mt-3">Project completed!</h5>
              ) : (
                <div className="flex gap-3 mt-3">
                  <button onClick={handleApproveSubmission} className="px-4 py-2 bg-green-500 text-white rounded-lg">Approve</button>
                  <button onClick={handleRejectSubmission} className="px-4 py-2 bg-red-500 text-white rounded-lg">Reject</button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-400">No submissions yet.</p>
          )}
        </div>
      )}

      <div className="mt-6 bg-gray-900 text-white p-6 rounded-lg shadow-lg">
        <h4 className="text-xl font-bold">Chat with Freelancer</h4>
        <hr className="my-4 border-gray-700" />
        {project?.freelancerId ? (
          <div>
            <div className="chat-messages h-64 overflow-y-auto p-4 bg-gray-800 rounded-lg">
              {chats?.messages?.map((msg, index) => (
                <div key={index} className={`p-2 my-2 ${msg.senderId === localStorage.getItem('userId') ? 'bg-blue-600' : 'bg-gray-700'} rounded-lg w-fit max-w-xs`}> 
                  <p>{msg.text}</p>
                  <span className="text-xs text-gray-400">{msg.time.slice(11, 19)}</span>
                </div>
              ))}
            </div>
            <div className="flex mt-4">
              <input type="text" className="flex-1 p-2 rounded-lg bg-gray-800 text-white" placeholder="Enter message..." value={message} onChange={(e) => setMessage(e.target.value)} />
              <button onClick={handleMessageSend} className="ml-2 px-4 py-2 bg-blue-500 rounded-lg">Send</button>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">Chat will be enabled once the project is assigned.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectWorking;
