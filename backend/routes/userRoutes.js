import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  registerAdmin,
} from "../controllers/userControllers.js";
import { protect, adminOnly } from "../middlewares/admin.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to the User Page");
});

router.post("/register", registerUser);
router.post("/register-admin", protect, adminOnly, registerAdmin);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
export default router;
