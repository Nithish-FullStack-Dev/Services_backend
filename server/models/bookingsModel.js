import mongoose from "mongoose";

const bookingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    default: null,
  },
  adminDetails: {
    type: Object,
    default: {},
  },
  bookingDetails: { type: Object, default: {} },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
    default: "Pending",
  },
  payment: {
    amount: { type: Number, default: 0 },
    method: { type: String, default: "" },
    status: { type: String, enum: ["Paid", "Pending"], default: "Pending" },
  },
  rating: {
    stars: { type: Number, min: 1, max: 5 },
    review: { type: String, default: "" },
  },
  completionDate: { type: String, default: "" },
  completionStatus: { type: Boolean, default: false },
  cancelledBy: [
    {
      adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
      reason: { type: String, default: "" },
      status: { type: String, default: "Cancelled" },
      cancelledAt: { type: Date, default: Date.now },
    },
  ],
  confirmBooking: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Bookings", bookingsSchema);
