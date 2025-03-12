import Chat from "../models/Chat.js";
import Project from "../models/Project.js";
import { v4 as uuid } from "uuid";

/**
 * Helper: get or create a chat room safely using upsert (no duplicate key errors).
 */
const getOrCreateChat = async (projectId) => {
  const chat = await Chat.findOneAndUpdate(
    { _id: projectId },
    { $setOnInsert: { _id: projectId, messages: [] } },
    { upsert: true, new: true }
  );
  return chat ? chat.toObject() : { _id: projectId, messages: [] };
};

/**
 * Socket.IO event handler.
 * @param {import("socket.io").Server} io  - The Socket.IO server instance
 * @param {import("socket.io").Socket} socket - The connected socket
 */
const socketHandler = (io, socket) => {

  // Freelancer joins chat room
  socket.on("join-chat-room", async ({ projectId, freelancerId }) => {
    try {
      console.log(`[Socket] join-chat-room: projectId=${projectId}, freelancerId=${freelancerId}`);
      const project = await Project.findById(projectId);
      if (!project) {
        console.log(`[Socket] join-chat-room: project not found`);
        return;
      }

      console.log(`[Socket] project.freelancerId=${project.freelancerId}, match=${project.freelancerId === freelancerId}`);
      if (project.freelancerId === freelancerId) {
        await socket.join(projectId);
        console.log(`[Socket] Freelancer joined room: ${projectId}`);
        socket.broadcast.to(projectId).emit("user-joined-room");

        const chat = await getOrCreateChat(projectId);
        socket.emit("messages-updated", { chat });
      }
    } catch (error) {
      console.error("Error in join-chat-room:", error);
    }
  });

  // Client joins chat room
  socket.on("join-chat-room-client", async ({ projectId }) => {
    try {
      console.log(`[Socket] join-chat-room-client: projectId=${projectId}`);
      const project = await Project.findById(projectId);
      if (!project) {
        console.log(`[Socket] join-chat-room-client: project not found`);
        return;
      }

      console.log(`[Socket] project.status=${project.status}`);
      if (project.status === "Assigned" || project.status === "Completed") {
        await socket.join(projectId);
        console.log(`[Socket] Client joined room: ${projectId}`);
        socket.broadcast.to(projectId).emit("user-joined-room");

        const chat = await getOrCreateChat(projectId);
        socket.emit("messages-updated", { chat });
      }
    } catch (error) {
      console.error("Error in join-chat-room-client:", error);
    }
  });

  // Fetch updated messages on request
  socket.on("update-messages", async ({ projectId }) => {
    try {
      const chat = await Chat.findById(projectId);
      socket.emit("messages-updated", { chat });
    } catch (error) {
      console.error("Error updating messages:", error);
    }
  });

  // New message sent by either party
  socket.on("new-message", async ({ projectId, senderId, message, time }) => {
    try {
      console.log(`[Socket] new-message: projectId=${projectId}, senderId=${senderId}, message="${message}"`);
      const chatDoc = await Chat.findOneAndUpdate(
        { _id: projectId },
        {
          $push: {
            messages: { id: uuid(), text: message, senderId, time },
          },
        },
        { new: true, upsert: true }
      );

      // Convert Mongoose doc to plain object for reliable Socket.IO serialization
      const chat = chatDoc.toObject();

      // Broadcast to the ENTIRE room (sender + other party) so both
      // see the new message in real-time without needing a separate fetch
      const roomSockets = await io.in(projectId).fetchSockets();
      console.log(`[Socket] Broadcasting to room ${projectId} — ${roomSockets.length} socket(s) in room`);
      console.log(`[Socket] Chat has ${chat.messages.length} messages`);
      io.to(projectId).emit("messages-updated", { chat });
    } catch (error) {
      console.error("Error adding new message:", error);
    }
  });
};

export default socketHandler;
