import express from "express";
import {
  createAdmin,
  getAdminByEmail,
  getAdminById,
  updateAdminDetails,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/create-admin", createAdmin);
router.get("/:email", getAdminByEmail);
router.get("/id/:adminId", getAdminById);
router.put("/updateAdmin", updateAdminDetails);

export default router;
