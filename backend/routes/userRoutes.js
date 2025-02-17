import express from "express";
import { registerUser } from "../controllers/userControllers.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to the User Page");
});

router.post("/register", registerUser);

export default router;
