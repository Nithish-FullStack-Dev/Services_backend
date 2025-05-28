import express from "express";
import {
  getUserByEmail,
  updateUserByEmail,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/:email", getUserByEmail);
router.put("/updateUser", updateUserByEmail);

export default router;
