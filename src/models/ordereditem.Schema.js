const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const orderItemSchema = new Schema(
  {
    product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    price: { type: Number, required: true },
    quantity:{type:Number,required:true},
    order_id: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  },
  { timestamps: true },
  { versionKey: false }
);

const OrderItem = mongoose.model("Orderitem", orderItemSchema);
module.exports = OrderItem;
