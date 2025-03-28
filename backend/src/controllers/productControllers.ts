import Product from "../models/Product";
import mongoose from "mongoose";
import catchErrors from "../utils/catchErrors";
import { AuthenticatedRequest } from "../middlewares/auth";
import {
  CREATED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  UNAUTHORIZED,
} from "../constants/http";
import Review from "../models/Reviews";

// !GET CONTROLLERS
// Get All Products
export const getAllProducts = catchErrors(async (req, res) => {
  const { search } = req.query;
  try {
    if (search) {
      const filteredProducts = await Product.find({
        name: { $regex: search, $options: "i" },
        description: { $regex: search, $options: "i" },
      });
      return res.status(200).json({ success: true, data: filteredProducts });
    }
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
});
// Get Product Details
export const GetProductById = catchErrors(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid product ID" });
  }
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.log(`Error ${error}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});
// Get Products by Category
export const GetProductByCategory = catchErrors(async (req, res) => {
  const { category } = req.params;
  try {
    const decodedCategory = category.replace(/-/g, "");
    const products = await Product.find({
      category: { $regex: decodedCategory, $options: "i" },
    });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log(`Error ${error}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
// Get All Categories
export const GetAllCategories = catchErrors(async (_req, res) => {
  try {
    const categories = await Product.distinct("category");
    if (!categories || categories.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No categories found" });
    }
    return res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.log(`Error ${error}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});
// !POST CONTROLLERS
// Create a Product
export const CreateProduct = catchErrors(async (req, res) => {
  const {
    name,
    price,
    image,
    category,
    description,
    weight,
    returnPolicy,
    shippingInfo,
    stock,
  } = req.body;
  if (
    !name ||
    !price ||
    !image ||
    !category ||
    !description ||
    !weight ||
    !returnPolicy ||
    !shippingInfo ||
    !stock
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const product = new Product({
    name,
    price,
    image,
    category,
    description,
    weight,
    returnPolicy,
    shippingInfo,
    stock,
  });
  try {
    await product.save();
    return res
      .status(201)
      .json({ message: "Product created successfully", product });
  } catch (error) {
    return res.status(400).json({ message: "Bad Request" });
  }
});
// Create a Review
export const CreateReview = catchErrors(
  async (req: AuthenticatedRequest, res) => {
    const { rating, comment } = req.body;
    const { id } = req.params;
    const user = req.user;
    if (!user) {
      return res
        .status(UNAUTHORIZED)
        .json({ message: "Unauthorized, Please log in" });
    }

    try {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(NOT_FOUND).json({ message: "Product not found" });
      }
      // Create the review
      const newReview = new Review({
        rating,
        comment,
        reviewerName: user.firstName,
      });
      await newReview.save();

      // Add the review to the product
      product.reviews.push(newReview._id);
      await product.save();
      return res
        .status(CREATED)
        .json({ message: "Thanks for your feedback", review: newReview });
    } catch (error) {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "Error creating review", error });
    }
  }
);
