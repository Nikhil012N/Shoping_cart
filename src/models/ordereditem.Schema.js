const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderItemSchema = new Schema(
  {
    order_id: { type: Schema.Types.ObjectId, ref: "Address",unique:true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ordered_items: [
      {
        product_id: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true },
  { versionKey: false }
);

const OrderItem = mongoose.model("orderitem", orderItemSchema);
module.exports = OrderItem;
