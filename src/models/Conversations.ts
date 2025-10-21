// src/models/Conversation.ts
import mongoose, { Document } from "mongoose";

export interface IConversation extends Document {
  participants: string[]; // user ids
  lastMessage?: string;
  updatedAt?: Date;
}

const ConversationSchema = new mongoose.Schema<IConversation>(
  {
    participants: { type: [String], required: true }, // store user ids as strings
    lastMessage: { type: String },
  },
  { timestamps: true }
);

const Conversation =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversation", ConversationSchema);

export default Conversation;
