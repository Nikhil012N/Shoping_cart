const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const cartSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  }, { timestamps: true },
  { versionKey: false }
);
const UserCart = mongoose.model("usercart", cartSchema);
module.exports = UserCart;
