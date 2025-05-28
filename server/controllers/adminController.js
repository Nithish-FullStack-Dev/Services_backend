import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";
import Bookings from "../models/bookingsModel.js";

export const createAdmin = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      email,
      phone,
      adhaarNumber,
      location,
      service,
      ratings,
      reviews,
      photo,
    } = req.body;

    if (!name || !email || !phone || !location || !adhaarNumber || !service) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newAdmin = new Admin({
      name,
      age,
      gender,
      email,
      phone,
      adhaarNumber,
      location,
      service,
      ratings,
      reviews,
      photo,
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin created", admin: newAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create admin" });
  }
};

export const getAdminByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    return res.json({ admin });
  } catch (err) {
    console.error("Error fetching admin by email:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getAdminById = async (req, res) => {
  try {
    const { adminId } = req.params;

    if (!adminId) {
      return res.status(400).json({ error: "Admin ID is required" });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    return res.json({ admin });
  } catch (err) {
    console.error("Error fetching admin by ID:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateAdminDetails = async (req, res) => {
  try {
    const { name, age, gender, email, adhaarNumber, phone, service, location } =
      req.body;

    const existingUser = await Admin.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ error: "Admin not found" });
    }
    existingUser.name = name;
    existingUser.age = age;
    existingUser.gender = gender;
    existingUser.adhaarNumber = adhaarNumber;
    existingUser.phone = phone;
    existingUser.service = service;
    existingUser.location = location;

    await existingUser.save();
    return res
      .status(200)
      .json({ message: "Admin updated successfully", admin: existingUser });
  } catch (error) {
    console.error("Error updating admin by email:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

//! USER

export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ user });
  } catch (err) {
    console.error("Error fetching user by email:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateUserByEmail = async (req, res) => {
  try {
    const { name, age, gender, email, phone, location, photo } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }
    existingUser.name = name;
    existingUser.age = age;
    existingUser.gender = gender;
    existingUser.phone = phone;
    existingUser.location = location;
    existingUser.photo = photo;

    await existingUser.save();
    return res
      .status(200)
      .json({ message: "User updated successfully", user: existingUser });
  } catch (error) {
    console.error("Error updating user by email:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

//! BOOKINGS

export const addBooking = async (req, res) => {
  try {
    const { userId, adminId = null, bookingDetails, payment } = req.body;
    console.log(userId);
    if (!userId || !bookingDetails) {
      return res
        .status(400)
        .json({ message: "userId and bookingDetails are required" });
    }

    const newBooking = new Bookings({
      userId,
      adminId,
      bookingDetails,
      payment,
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error("Error adding booking:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBookingsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const bookings = await Bookings.find({ userId })
      .populate("userId")
      .populate("adminId");

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings for user:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

export const getBookings = async (req, res) => {
  try {
    const bookings = await Bookings.find().populate("userId");
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

export const conformBooking = async (req, res) => {
  try {
    const { _id, adminId } = req.body;

    if (!_id || !adminId) {
      return res
        .status(400)
        .json({ message: "Booking ID and Admin ID are required" });
    }

    // Fetch the full admin document
    const adminDetails = await Admin.findById(adminId);
    if (!adminDetails) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Update booking: embed adminDetails and update status
    const updatedBooking = await Bookings.findByIdAndUpdate(
      _id,
      {
        adminId, // keep storing reference if you want
        adminDetails: adminDetails.toObject(), // embed admin data as plain JS object
        status: "Confirmed",
        confirmBooking: true,
      },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({
      success: true,
      message: "Booking confirmed successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error confirming booking:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const cancelBookingByAdmin = async (req, res) => {
  try {
    const { bookingId, adminId, reason } = req.body;

    if (!bookingId || !adminId || !reason) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const booking = await Bookings.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    booking.cancelledBy.push({
      adminId,
      reason,
    });

    await booking.save();

    res
      .status(200)
      .json({ message: "Booking cancellation recorded.", booking });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const cancelBookingByUser = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const deletedBooking = await Bookings.findByIdAndDelete(bookingId);

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res
      .status(200)
      .json({ message: "Booking cancelled successfully", deletedBooking });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error cancelling booking", error: error.message });
  }
};
