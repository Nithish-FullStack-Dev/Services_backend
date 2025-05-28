import mongoose from "mongoose";

export const adminSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  age: { type: Number, default: 0 },
  gender: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  adhaarNumber: { type: String, default: "" },
  otp: String,
  phone: { type: String, default: "" },
  location: {
    address: { type: String, default: "" },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
  },
  service: { type: [String], default: [] },
  ratings: [
    {
      stars: { type: Number, min: 1, max: 5 },
      review: { type: String },
      reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      date: { type: Date, default: Date.now },
    },
  ],
  photo: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Admin", adminSchema);
