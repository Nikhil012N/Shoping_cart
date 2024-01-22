const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const orderItemSchema = new Schema(
  {
    product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    price: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
    order_id: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  },
  { timeStamp: true },
  { versionKey: true }
);

const OrderItem = mongoose.model("Orderitem", orderItemSchema);
module.exports = OrderItem;
