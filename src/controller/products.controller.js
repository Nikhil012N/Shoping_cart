const Product = require("../models/product.Schema");
const path = require("path");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createNewProducts = async function (req, res, next) {
const {name,category,description,quantity,price}=req.body;
console.log(req.files);
console.log("body",req.body);
  const Thumbnail = await Promise.all(
    req?.files?.thumbnail?.map(async (image) => {
      const result = await cloudinary?.uploader?.upload(image?.path);
      return result?.secure_url;
    })
  )
    .then((res) => res.toString())
    .catch((e) => console.error("errorThumbnail", e));

  const Images = await Promise.all(
    req?.files?.images?.map(async (image) => {
      const result = await cloudinary?.uploader?.upload(image?.path);
      return result.secure_url;
    })
  ).then((res) => res).catch((e) => console.error("errorImages", e));

  try {
    const product = await new Product({
      product_name: name,
      product_category: category,
      stock:+quantity,
      price:+price,
      thumbnail: Thumbnail,
      images: Images,
      description: description,
    });
    await product.save();
    console.log("product",product)
   return res.status(200).json({ message: "saved successfully" });
  } catch (error) {
    console.log(error.toString());
   return  res.status(500).send({ message: error });
  }
};

const getAllProducts = async(req, res, next) => {
  try {
  const product=await Product.find();
  return res.status(200).send({product:product})
  } catch (error) {
    console.error(error.toString());
   return res.status(500).send({ message: error });
  }
};

module.exports = { createNewProducts,getAllProducts};
