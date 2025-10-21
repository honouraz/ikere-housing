import mongoose from 'mongoose';

const HouseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    description: { type: String },
    agentId: { type: String, required: true },
    houseType: { type: String, enum: ['Single Room', 'Self Contain', 'Flat', 'Duplex'], required: true },
    facilities: [{ type: String }], // 👈 new: array of strings like ["Fenced", "Toilet", "Water Supply"]
  },
  { timestamps: true }
);

export default mongoose.models.House || mongoose.model('House', HouseSchema);
