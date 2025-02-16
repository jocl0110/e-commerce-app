import Product from "../models/Product.js";

// !GET METHODS

// Get all products
export const getAllProducts = async (req, res) => {
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
    console.log(products);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
// Get products by ID
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.log(`Error ${error}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// !POST METHODS
// Create a new product
export const createProduct = async (req, res) => {
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
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(400).json({ message: "Bad Request" });
  }
};
