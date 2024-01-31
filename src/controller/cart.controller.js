const UserCart = require("../models/usercart.Schema");
const Product = require("../models/product.Schema");
const CartItem = require("../models/cartitem.Schema");
const OrderItem = require("../models/ordereditem.Schema");
const Address = require("../models/userAddress.Schema");
const  mongoose=require("mongoose");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
Object.prototype.unflatten = function () {
  let k = 15;
  let data = [];
  for (let i = 0; i < this.length; i++) {
    const slice = this.slice(i, k);
    data.push(slice);
    i = k - 1;
    k = k + 15;
  }
  const reducer = data.reduce((acc, val, index) => {
    acc[index] = JSON.stringify(val);
    return acc;
  }, {});

  return reducer;
};

const addToCart = async (req, res, next) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
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
    console.error("addtoCart", error.toString());
    return res.status(403).send({ message: error });
  }
};

const getCartItems = async (req, res, next) => {
  const id = req.user;
  const foundUserInCart = await UserCart.findOne({ user_id: id });
  if (!foundUserInCart) {
    return res.status(404).send({ message: "Sorry your cart is empty" });
  }
  console.error("foundUserInCart?._id", foundUserInCart);
  try {
    const cartData = await CartItem.aggregate([
      {
        $match: { cart_id:  foundUserInCart?._id },
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
    console.error("getCartItem", error.toString());
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
    console.error("removeformcart", error.toString());
    return res.status(403).send({ message: error });
  }
};

const updateToCart = async (req, res) => {
  const userId = req.user;
  const { productId, quantity } = req.body;
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
    console.error("updateToCart", error.toString());
    return res.status(403).send({ message: error });
  }
};

const checkoutSession = async (req, res) => {
  const products = await req?.body;
  console.log(products);
  const url = req?.headers?.origin;
  const user = req.user;
  const cart = await UserCart.findOne({ user_id: user });
  if (!cart) {
    return res.status(404).send({ message: "Cart not found" });
  }
  if (!products) {
    return res.status(404).send({ message: "No products found" });
  }
  const metaData = await products.map((meta) => meta?.product_id).unflatten();

  console.log(metaData);
  try {
    const session = await stripe.checkout.sessions.create({
      client_reference_id: cart.id,
      payment_method_types: ["card"],
      line_items: products.map((itm) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: itm?.product_name,
            description: itm?.description,
            images: [itm?.thumbnail],
          },
          unit_amount: itm?.price * 100,
        },
        quantity: itm?.quantity,
      })),
      billing_address_collection: "required",
      mode: "payment",
      metadata: metaData,
      success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${url}/failure?session_id={CHECKOUT_SESSION_ID}`,
    });
    return res.status(200).send({ session: session?.id });
  } catch (error) {
    console.error("stripe api error", error.toString());
    return res.status(403).send({ message: error });
  }
};

const checkoutOrderSuccess = async (req, res) => {
  const sessionId = req.query.session_id;
  if (!sessionId) {
    return res.status(404).send({ message: "session Id not found !" });
  }
  const userId = req.user;
  const cart = await UserCart.findOne({ user_id: userId });
  if (!cart) {
    return res.status(404).send({ message: "Cart not found" });
  }
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const {client_reference_id, customer_details, metadata } = await session;
  const { address, email, name, phone } = await customer_details;
  const findAddress = await Address.findOne({
    metadata: JSON.stringify(session),
  });
  const productIds = Object.keys(metadata)
    .map((index) => JSON.parse(metadata[index]))
    .flat(Infinity);
  if (!productIds) {
    return res.status(500).send({ message: "Something went wrong" });
  }
  if(findAddress?._id){
  return  res.status(200).send({message:"Your order is saved successfully"})
  }
  try {
    const myAddress = new Address({
      user_id: userId,
      customer_email: email,
      customer_contact: phone,
      customer_name: name,
      address: address,
      metadata: JSON.stringify(session),
    });
    console.log("addresss", findAddress?._id);

  
      await myAddress.save();
   


     const cartProducts=await CartItem.find({"product_id":{$in:productIds}}).where("cart_id").equals(client_reference_id);
     cartProducts.map(async(item)=>{
      const findProduct=await Product.findById(item.product_id);
      const myOrder= new OrderItem({
              product_id: findProduct?._id,
              user_id:userId,
              price: findProduct?.price,
              quantity:item?.quantity,
              order_id:myAddress?._id,
            });
            myOrder.save();
     });

    console.log("cartItems", cartProducts);

   
    console.log("address after shaved", myAddress);
  } catch (error) {
    console.error(error.toString());
  }
};

const checkoutOrderFailure = async (req, res) => {
  const userId = req.user;
  const sessionId = req.query.session_id;
  if (!sessionId) {
    return res.status(404).send({ message: "Id not found" });
  }
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  console.log("sessionfail", session);
};

module.exports = {
  addToCart,
  getCartItems,
  removeProductFromCart,
  updateToCart,
  checkoutSession,
  checkoutOrderSuccess,
  checkoutOrderFailure,
};
