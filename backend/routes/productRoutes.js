import express from "express";

const router = express.Router();

// Home Route
router.get("/home", (req, res) => {
  res.send("Welcome to the Home Page");
});

export default router;
