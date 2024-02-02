const Product = require("../models/product.Schema");
const path = require("path");
const User = require("../models/user.Schema");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// for creating product and updating them
const createAndUpdateProducts = async function (req, res, next) {
  const { name, category, description, quantity, price } = await req.body;
  try {
  const Thumbnail = await Promise.all(
    req?.files?.thumbnail?.map(async (image) => {
      const result = await cloudinary?.uploader?.upload(image?.path);
      return result?.secure_url;
    })
  )
    .then((res) => res.toString())
    .catch((e) => console.error("errorThumbnail", e));
//promise chain fo saving images in cloudinary
  const Images = await Promise.all(
    req?.files?.images?.map(async (image) => {
      const result = await cloudinary?.uploader?.upload(image?.path);
      return result.secure_url;
    })
  )
    .then((res) => res)
    .catch((e) => console.error("errorImages", e));

    if(req.method==="POST"||req.method=="post"){

    const product =  new Product({
      user_id:req.userId,
      product_name: name,
      product_category: category,
      stock: +quantity,
      price: +price,
      thumbnail: Thumbnail,
      images: Images,
      description: description,
    });
    await product.save();
    console.log("product", product);
    return res.status(201).json({ message: "saved successfully" });}
    if(req.method==="PUT"||req.method==="put"){

    }
  } catch (error) {
    console.log(error.toString());
    return res.status(500).send({ message:"Something went wrong",error: error });
  }
};
//fetching all products created by creators
const getAllProducts = async (req, res, next) => {
  try {
    const product = await Product.find();
    return res.status(200).send({ product: product });
  } catch (error) {
    console.error(error.toString());
    return res.status(500).send({message:"Something went  wrong", error: error });
  }
};
//fetching all product for geting all products of single creator
const sellerCreatedProducts = async (req, res) => {
  try {
  const user = req.user;
  const myUser = await User.findById(user).select(
    "_id name username email role "
  );
  if (!myUser) {
    return res.status(404).send({ message: "User not found" });
  }

    const creatorsProducts = await Product.find({ user_id: user });
    if (!creatorsProducts || creatorsProducts?.length) {
    return res.status(404).send({ message: "Insert your first product" });
    }
    return res.status(200).send({ products: creatorsProducts });
  } catch (error) {
    console.error("sellerCreatedProducts", error.toString());
    return res.status(403).send({ message: error });
  }
};
//delete creator product 
const deleteSellerProducts = async (req, res) => {
  try {
  const user = await req.user;
  const productId = await req.params.id;

    const myUser = await User.findById(user).select(
      "_id name username email role "
    );
    if (!myUser) {
      return res.status(404).send({ message: "User not found" });
    }
    if (myUser.role !== "client" || myUser.role !== "admin") {
      return res.status(403).send({ message: "Access forbidden" });
    }

    if (myUser.role === "admin") {
      await Product.deleteOne({ _id: productId });
      return res.status(200).send({ message: "Product deleted successfully" });
    } else {
      const findProductByUser = await Product.findById(productId)
        .where("user_id")
        .equals(user);
      if (!findProductByUser || findProductByUser.length == 0) {
        return res.status(403).send({ message: "Access denied" });
      }
      await Product.deleteOne({ _id: productId });
      return res.status(200).send({ message: "Product deleted successfully" });
    }
  } catch (error) {
    console.log("deleteSellerProduct", error.toString());
    return res.status(403).send({ message: error });
  }
};

module.exports = { createAndUpdateProducts, getAllProducts };
