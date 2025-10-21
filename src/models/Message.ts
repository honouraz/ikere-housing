// src/models/Message.ts
import mongoose, { Document } from "mongoose";

export interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId | string;
  senderId: string;
  text: string;
  read?: boolean;
  createdAt?: Date;
}

const MessageSchema = new mongoose.Schema<IMessage>(
  {
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
    senderId: { type: String, required: true },
    text: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Message =
  mongoose.models.Message ||
  mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
