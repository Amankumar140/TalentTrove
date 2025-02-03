import { Chat, Project } from "./Schema.js";
import { v4 as uuid } from "uuid";

// Helper: get or create a chat room safely using upsert (no duplicate key errors)
const getOrCreateChat = async (projectId) => {
  return await Chat.findOneAndUpdate(
    { _id: projectId },
    { $setOnInsert: { _id: projectId, messages: [] } },
    { upsert: true, new: true }
  );
};

// io is passed in so we can broadcast to entire rooms (not just socket.broadcast)
const SocketHandler = (io, socket) => {

  // Freelancer joins chat room
  socket.on("join-chat-room", async ({ projectId, freelancerId }) => {
    try {
      const project = await Project.findById(projectId);
      if (!project) return;

      if (project.freelancerId === freelancerId) {
        await socket.join(projectId);
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
      const project = await Project.findById(projectId);
      if (!project) return;

      if (project.status === "Assigned" || project.status === "Completed") {
        await socket.join(projectId);
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
      const chat = await Chat.findOneAndUpdate(
        { _id: projectId },
        {
          $push: {
            messages: { id: uuid(), text: message, senderId, time },
          },
        },
        { new: true, upsert: true }
      );

      // FIX: broadcast to the ENTIRE room (sender + other party) so both
      // see the new message in real-time without needing a separate fetch
      io.to(projectId).emit("messages-updated", { chat });
    } catch (error) {
      console.error("Error adding new message:", error);
    }
  });
};

export default SocketHandler;