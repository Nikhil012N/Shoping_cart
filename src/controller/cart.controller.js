const UserCart = require("../models/usercart.Schema");
const Product = require("../models/product.Schema");
const CartItem = require("../models/cartitem.Schema");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const addToCart = async (req, res, next) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  console.log(product);

  const id = req?.user;
  const foundUserInCart = await UserCart.findOne({ user_id: id });
  try {
    if (quantity > product?.stock) {
      return res
        .status(403)
        .send({ message: "Your qunanity is greater the available stocks" });
    }
    if (!foundUserInCart) {
      const addNewUserToCart = new UserCart({ user_id: id });
      await addNewUserToCart.save();

      const addCartItemToCart = new CartItem({
        cart_id: addNewUserToCart._id,
        product_id: productId,
        quantity: +quantity,
      });
      await addCartItemToCart.save();
      res.status(201).send({ message: "Product created successfully" });
    } else {
      const foundProductInCart = await CartItem.findOne({
        cart_id: foundUserInCart?._id,
        product_id: productId,
      });
      if (foundProductInCart) {
        foundProductInCart.quantity += +quantity;
        await foundProductInCart.save();
        return res.status(200).send({ message: "Quantity added successfully" });
      } else {
        const addCartItemToCart = new CartItem({
          cart_id: foundUserInCart.id,
          product_id: productId,
          quantity: +quantity,
        });
        await addCartItemToCart.save();
        return res.status(201).send({ message: "Product added successfully" });
      }
    }
  } catch (error) {
    console.log("addtoCart", error.toString());
    return res.status(403).send({ message: error });
  }
};

const getCartItems = async (req, res, next) => {
  const id = req.user;
  console.log(id);
  const foundUserInCart = await UserCart.findOne({ user_id: id });
  if (!foundUserInCart) {
    return res.status(404).send({ message: "Sorry your cart is empty" });
  }
  console.log("foundUserInCart?._id", foundUserInCart);
  try {
    const cartData = await CartItem.aggregate([
      {
        $match: { cart_id: foundUserInCart?._id },
      },
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "cartProducts",
        },
      },
      { $unwind: "$cartProducts" },
      {
        $project: {
          _id: "$_id",
          cart_id: "$cart_id",
          product_id: "$product_id",
          product_name: "$cartProducts.product_name",
          quantity: "$quantity",
          product_category: "$cartProducts.product_category",
          product_name: "$cartProducts.product_name",
          thumbnail: "$cartProducts.thumbnail",
          images: "$cartProducts.images",
          description: "$cartProducts.description",
          price: "$cartProducts.price",
          stock: "$cartProducts.stock",
        },
      },
    ]);
    res.status(200).send({ cartData: cartData });
  } catch (error) {
    console.log("getCartItem", error.toString());
    res.status(403).send({ message: error });
  }
};

const removeProductFromCart = async (req, res) => {
  const userId = req.user;
  const productId = req.params.id || req.body.productId;
  const cartUser = await UserCart.findOne({ user_id: userId });

  try {
    const foundProduct = await CartItem.findOneAndDelete({
      cart_id: cartUser._id,
      product_id: productId,
    });
    if (!foundProduct) {
      return res
        .status(404)
        .send({ message: "Product does not exist in cart" });
    }
    return res.status(200).send({ message: "Product remove successfully" });
  } catch (error) {
    console.log("removeformcart", error.toString());
    return res.status(403).send({ message: error });
  }
};

const updateToCart = async (req, res) => {
  const userId = req.user;
  const { productId, quantity } = req.body;
  console.log(userId, productId, quantity);
  if (quantity == 0) {
    return removeProductFromCart(req, res);
  }
  const cartUser = await UserCart.findOne({ user_id: userId });
  try {
    const filter = { cart_id: cartUser._id, product_id: productId };
    const update = { quantity: +quantity };
    await CartItem.findOneAndUpdate(filter, update, { new: true });
    return res.status(200).send({ message: `Product updated successfully` });
  } catch (error) {
    console.log("updateToCart", error.toString());
    return res.status(403).send({ message: error });
  }
};

const checkoutSession = async (req, res) => {
  const products = await req?.body;
  console.log(req);
  // const url = req?.headers?.origin;
  // console.log("url111111111111111111111111111111",url);
  const user=req.user;
  const cart=await UserCart.findOne({user_id:user});
  console.log(cart.id,"cart .id");
  console.log(cart._id,"cart .id");
  if (!products) {
    return res.status(404).send({ message: "No products found" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      client_reference_id:cart.id,
      payment_method_types: ["card"],
      line_items: products.map((itm) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: itm?.product_name,
            description: itm?.description,
            images: [itm?.thumbnil],
          },
          unit_amount: itm?.price * 100,
        },
        quantity: itm?.quantity,
      })),
      billing_address_collection: "required",
      mode: "payment",
      success_url:`http://127.0.0.53:9080/api/v1/checkout-order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:`http://127.0.0.53:9080/api/v1/checkout-order-failure?session_id={CHECKOUT_SESSION_ID}`,
    });

// console.log("ghytgjhtjh",session);
return res.status(200).send({session:session?.id});
  } catch (error) {
    console.log("stripe api error", error.toString());
    return res.status(403).send({ message: error });
  }
};

const checkoutOrderSuccess=async(req,res)=>{
  const sessionId=req.query.session_id;
  const session=await stripe.checkout.sessions.retrieve(sessionId)
console.log("session",sessionId,session);
return res.status(200).redirect("http://localhost:5173").send({message:sessionId});
}

const checkoutOrderFailure=async(req,res)=>{
  const sessionId=req.query.session_id;
  const session=await stripe.checkout.sessions.retrieve(sessionId)
  console.log("sessionfail",sessionId,session);
  return res.status(200).send({message:sessionId});
}

module.exports = {
  addToCart,
  getCartItems,
  removeProductFromCart,
  updateToCart,
  checkoutSession,
  checkoutOrderSuccess,
  checkoutOrderFailure
};
