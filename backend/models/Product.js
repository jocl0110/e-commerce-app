import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: String,
    weight: String,
    returnPolicy: String,
    shippingInfo: String,
    stock: {
      type: Number,
      required: true,
    },
    reviews: [
      {
        type: [mongoose.Schema.Types.Mixed],
        ref: "Review",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
