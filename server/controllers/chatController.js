import Chat from "../models/Chat.js";

/**
 * GET /fetch-chats/:id
 * Fetch chat messages by chat/project ID.
 */
export const getChats = async (req, res) => {
  try {
    const chats = await Chat.findById(req.params.id);
    res.status(200).json(chats || { _id: req.params.id, messages: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
