import express from "express";

import {
  addBooking,
  cancelBookingByAdmin,
  cancelBookingByUser,
  conformBooking,
  getBookings,
  getBookingsByUser,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/addBooking", addBooking);
router.get("/user/:userId", getBookingsByUser);
router.get("/getBookings", getBookings);
router.put("/conformBooking", conformBooking);
router.post("/admin/cancel", cancelBookingByAdmin);
router.put("/user/cancel/:bookingId", cancelBookingByUser);

export default router;
