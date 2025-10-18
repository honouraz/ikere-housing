import mongoose, { Document } from "mongoose";
import crypto from "crypto";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "student" | "agent" | "admin";
  verificationToken?: string;
  generateVerificationToken: () => string;
}

const UserSchema = new mongoose.Schema<IUser>({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["student", "agent", "admin"], default: "student" },
  verificationToken: String,
});

UserSchema.methods.generateVerificationToken = function () {
  this.verificationToken = crypto.randomBytes(32).toString("hex");
  return this.verificationToken;
};

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
