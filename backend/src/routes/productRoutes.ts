import express from "express";
import {
  CreateProduct,
  CreateReview,
  GetAllCategories,
  getAllProducts,
  GetProductByCategory,
  GetProductById,
} from "../controllers/productControllers";
const { isAdmin, ProtectedRoute } = require("../middlewares/auth");

const productRouter = express.Router();

// ! GET METHODS
// Get all products
productRouter.get("/", getAllProducts);
// Get product by ID
productRouter.get("/categories/:category/:id", GetProductById);
// Get product by category
productRouter.get("/categories/:category", GetProductByCategory);
// Get all categories
productRouter.get("/categories", GetAllCategories);

// !POST METHODS
// Create a new product route
productRouter.post("/", ProtectedRoute, isAdmin, CreateProduct);
// Create a review
productRouter.post("/categories/:category/:id", ProtectedRoute, CreateReview);

export default productRouter;
