const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const orderSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
    },
    customer_email: { type: String },
    customer_contact: { type: String },
    customer_name: { type: String },
    address: {
      city: {
        type: String,
        required: [true, "Select your city"],
      },
      line1: {
        type: String,
        required: [true, "Please fill the address"],
      },
      line2: {
        type: String,
      },
      postal_code: {
        type: Number,
        required: [true, "Postal code is required"],
      },
      state: {
        type: String,
        required: [true, "Select your state"],
      },
      country: {
        type: String,
        required: [true, "Select your country"],
      },
    },
    metadata: { type: String, required: true },
  },
  { timestamps: true },
  { versionKey: false }
);

const Address = mongoose.model("address", orderSchema);
module.exports = Address;
