import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
} from "../controllers/productController.js";
const router = express.Router();

// Home Route
router.get("/home", (req, res) => {
  res.send("Welcome to the Home Page");
});
//! GET METHODS
// Get all products route
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// !POST METHODS
// Create a new product route
router.post("/", createProduct);

export default router;
