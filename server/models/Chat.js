import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    _id:      { type: String, required: true },
    messages: { type: Array,  default: [] },
  },
  { timestamps: true }
);

const Chat = mongoose.model("chats", chatSchema);
export default Chat;
