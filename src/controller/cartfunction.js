const UserCart = require("../models/usercartschema");
const Product = require("../models/productSchema");
const CartItem = require("../models/cartitemSchema");

const addToCart = async (req, res, next) => {
  const { productId, quantity } = req.body;
  const product= await Product.findById(productId);
  console.log(product);
 
  const id = req?.user;
  const foundUserInCart = await UserCart.findOne({ user_id: id });
  try{
    if(quantity> product?.stock){
      return res.status(403).send({message:"Your qunanity is greater the available stocks"});
     
    };
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

    }else{
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
  }
  catch(error){
    console.log("addtoCart",error.toString());
    return res.status(403).send({ message: error});
  }
};

const getCartItems = async (req, res, next) => {
  const id = req.user;
  console.log(id);
  const foundUserInCart = await UserCart.findOne({ user_id: id });
  if (!foundUserInCart) {
    return res.status(404).send({ message: "Sorry your cart is empty" });
  }
  console.log('foundUserInCart?._id',foundUserInCart)
  try{
    const cartData = await CartItem.aggregate([
      {
        $match: {cart_id: foundUserInCart?._id }
      },
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "cartProducts",
        },
      },
      {$unwind:"$cartProducts"},
      {$project:{
      _id: "$_id",
      cart_id: "$cart_id",
      product_id: "$product_id",
      product_name:"$cartProducts.product_name",
      quantity:"$quantity",
      product_category:"$cartProducts.product_category",
      product_name:"$cartProducts.product_name",
      thumbnail:"$cartProducts.thumbnail",
      images:"$cartProducts.images",
      description:"$cartProducts.description",
      price:"$cartProducts.price",
      stock:"$cartProducts.stock",
      }}
      
    ])
    res.status(200).send({cartData:cartData});
  }
  catch(error){
    console.log("getCartItem",error.toString());
    res.status(403).send({message:error})
  }

 
};

const removeProductFromCart=async(req,res)=>{
  const userId=req.user;
const productId=req.params.id ||req.body.productId;
const cartUser=await UserCart.findOne({user_id:userId});

try{
const foundProduct=await CartItem.findOneAndDelete({cart_id:cartUser._id,product_id:productId})
if(!foundProduct){
return res.status(404).send({message:"Product does not exist in cart"})
}
return res.status(200).send({message:"Product remove successfully"});
}
catch(error){
  console.log("removeformcart",error.toString());
  return res.status(403).send({message:error});
}

}

const updateToCart=async(req,res)=>{
  const userId=req.user;
  const {productId,quantity}=req.body;
  console.log(userId,productId,quantity);
  if(quantity==0){
    return removeProductFromCart(req,res);
  }
  const cartUser=await UserCart.findOne({user_id:userId});
  try{
    const filter={cart_id:cartUser._id,product_id:productId};
    const update={quantity:+quantity};
    await CartItem.findOneAndUpdate(filter,update,{new:true});
return res.status(200).send({message:`Product updated successfully`});

  }
  catch(error){
    console.log("updateToCart",error.toString());
    return res.status(403).send({message:error})
  }
}





module.exports = { addToCart, getCartItems,removeProductFromCart,updateToCart};
