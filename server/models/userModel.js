import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  age: { type: Number, default: 0 },
  gender: { type: String, enum: ["Male", "Female", "Other", ""], default: "" },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: "" },
  location: {
    address: { type: String, default: "" },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
  },
  photo: { type: String, default: "" },
  ratings: [
    {
      stars: { type: Number, min: 1, max: 5 },
      review: { type: String },
      reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
      date: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
