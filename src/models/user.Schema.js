const mongoose = require("mongoose");
const {gender,userRoles,Admin}=require("../utils/constant");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      minLength: 3,
    },
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      minLength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    age: {
      type: Number,
      min: 16,
      max: 70,
      trim: true,
    },
    gender: {
      type: String,
      enum: gender,
    },
    role: {
      type: String,
      enum:userRoles,
      default:"user"
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
  { version: false }
);

userSchema.pre("save",async function(next){
 if(this.email===Admin )
 {
  this.role='admin';
 }
 else if(this.email.match(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+(@gmail.com)$/gmi)){
this.role="client";
 }
 else{
  this.role="user";
 }
 
})


userSchema.post("save", async function (req,res,next) {
  console.log("Data saved successfully");
});
const User= mongoose.model("User", userSchema);
module.exports = User;
