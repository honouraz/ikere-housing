import mongoose from "mongoose";
import crypto from "crypto";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["student", "agent", "admin"], default: "student" },
  verificationToken: String,
});

// Add to UserSchema methods:
UserSchema.methods.generateVerificationToken = function () {
  this.verificationToken = crypto.randomBytes(32).toString("hex");
  return this.verificationToken;
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
