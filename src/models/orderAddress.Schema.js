const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const orderSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
    },
    address_line: {
      type: String,
      required: [true, "Please fill the address"],
    },
    address_postal_code: {
      type: Number,
      required: [true, "Postal code is required"],
    },
    address_city: {
      type: String,
      required: [true, "Select your city"],
    },
    address_state: {
      type: String,
      required: [true, "Select your state"],
    },
  }, { timeStamp: true },
  { versionKey: false }
);

const Order = mongoose.model("Address", orderSchema);
module.exports = Order;
