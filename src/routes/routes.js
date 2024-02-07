const express = require("express");

const {
  getAllUsers,
  getUserById,
  updateSingleUser,
  disableSingleUser,
  deleteSingleUser,
} = require("../controller/user.controller");
const {getUserProfile, loginUser, registerUser, loginWithOtp,resetPassword} = require("../controller/login.controller");
const { createAndUpdateProducts, getAllProducts, sellerCreatedProducts, deleteSellerProducts } = require("../controller/products.controller");
const uploadImage  = require("../middlewares/multer");
// const productvalidations = require("../validations/productvalidations");
const { addToCart, getCartItems, removeProductFromCart, updateToCart, checkoutSession ,checkoutOrderSuccess,checkoutOrderFailure, orderSuccessList} = require("../controller/cart.controller");


const router = express.Router();

router.post("/user-login",loginUser);
router.post("/create-user",registerUser);
router.get("/products",getAllProducts);
router.get("/get-users", getAllUsers);
router.get("/user/:id", getUserById);
router.delete("/user/:id", deleteSingleUser);
router.patch("/disable-user/:id", disableSingleUser);
router.put("/update-user/:id", updateSingleUser);
router.get("/get-profile", getUserProfile);
router.post("/products/new-products",uploadImage.fields([{name:"thumbnail",maxCount:1},{name:"images",maxCount:10}]),createAndUpdateProducts);
router.put("/products/update-products",uploadImage.fields([{name:"thumbnail",maxCount:1},{name:"images",maxCount:10}]),createAndUpdateProducts);
router.post("/add-to-cart",addToCart);
router.get("/get-cart-items",getCartItems);
router.delete("/remove-from-cart/:id",removeProductFromCart);
router.put("/update-to-cart",updateToCart);
router.post("/start-checkout-session",checkoutSession);
router.get("/checkout-order-success",checkoutOrderSuccess);
router.get("/checkout-order-failure",checkoutOrderFailure);
router.post("/login-with-otp",loginWithOtp);
router.get("/reset-password",resetPassword);
router.get("/buy-order-list",orderSuccessList);
router.get("/creators-product",sellerCreatedProducts);
router.delete("/delete-seller-product",deleteSellerProducts);



module.exports = router;
