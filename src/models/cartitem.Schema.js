const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const cartItemSchema = new Schema({
  cart_id: {
    type: Schema.Types.ObjectId,
    ref: "Cart",
    required: true,
  },
  product_id: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  }
}, { timestamps: true }, { versionKey: false });

const CartItem = mongoose.model("cartitem", cartItemSchema);
module.exports = CartItem;
