import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getAllCategories,
} from "../controllers/productController.js";
const router = express.Router();

// Home Route
router.get("/home", (req, res) => {
  res.send("Welcome to the Home Page");
});
//! GET METHODS
// Get all products route
router.get("/", getAllProducts);
// Get product by ID
router.get("/categories/:category/:id", getProductById);
// Get products by category
router.get("/categories/:category", getProductsByCategory);
// Get all categories
router.get("/categories", getAllCategories);

// !POST METHODS
// Create a new product route
router.post("/", createProduct);

export default router;
