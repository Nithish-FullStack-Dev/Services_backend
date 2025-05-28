import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import nodemailer from "nodemailer";
import mongoDb from "./server/config/db.js";
import adminRoutes from "./server/routes/adminRoutes.js";
import userRouters from "./server/routes/userRoutes.js";
import bookingRouters from "./server/routes/bookingsRoutes.js";
import Admin from "./server/models/adminModel.js";
import User from "./server/models/userModel.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());
await mongoDb();

const PORT = process.env.PORT || 3000;
const otpStore = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nithishintern.infasta@gmail.com",
    pass: "lpqz ymrh xool lncu",
  },
});

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

app.post("/send-otp", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const otp = generateOTP();
  otpStore[email] = otp;

  const mailOptions = {
    from: "nithishintern.infasta@gmail.com",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) return res.status(500).json({ error: "Failed to send OTP" });
    res.json({ message: "OTP sent" });
  });
});

app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ error: "Required fields missing" });

  if (otpStore[email] && otpStore[email] === otp) {
    delete otpStore[email];

    let existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.json({
        message: "OTP verified and admin already exists",
        admin: existingAdmin,
      });
    }

    const newAdmin = new Admin({
      email,
      name: "",
      age: 0,
      gender: "",
      phone: "",
      adhaarNumber: "",
      location: "",
      service: [],
      ratings: {},
      reviews: [],
      photo: "",
    });

    try {
      await newAdmin.save();
      return res.json({
        message: "OTP verified and admin created",
        admin: newAdmin,
      });
    } catch (err) {
      console.error("Error creating admin after OTP verification:", err);
      return res
        .status(500)
        .json({ error: "Failed to create admin after OTP verification" });
    }
  } else {
    res.status(400).json({ error: "Invalid OTP" });
  }
});

app.post("/userverify-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ error: "Required fields missing" });

  if (otpStore[email] && otpStore[email] === otp) {
    delete otpStore[email];

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({
        message: "OTP verified and user already exists",
        user: existingUser,
      });
    }

    const newUser = new User({
      email,
      name: "",
      age: 0,
      gender: "",
      phone: "",
      location: "",
      photo: "",
    });

    try {
      await newUser.save();
      return res.json({
        message: "OTP verified and user created",
        user: newUser,
      });
    } catch (err) {
      console.error("Error creating user after OTP verification:", err);
      return res
        .status(500)
        .json({ error: "Failed to create user after OTP verification" });
    }
  } else {
    res.status(400).json({ error: "Invalid OTP" });
  }
});

// API route
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRouters);
app.use("/api/booking", bookingRouters);

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
