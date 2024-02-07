const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    creator_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    product_name: {
      type: String,
      required: [true, "Product name is required"],
      unique: [true, "Product name should be unique"],
      min: 3,
    },
    product_category: {
      type: String,
      required: true,
      min: 3,
    },
    stock: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
      min: 1,
    },
    images: {
      type: Array,
      required: true,
      min: [2, "Minimum 2 images required"],
    },
    description: {
      type: String,
      min: [20, "Add description of minimum 20 words"],
      max: [500, "Max 500 words are allowed"],
    },
  },
  { timestamps: true },
  { versionKey: false }
);

const Product = mongoose.model("product", productSchema);
module.exports = Product;
