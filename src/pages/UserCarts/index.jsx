import { useState, useEffect, memo } from "react";
import Cart from "./cartPay";
import { AxiosConfig, apiUrls } from "utils";
import EmptyCart from "./emptyCart";
import Toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
const stripe = loadStripe(import.meta.env.VITE_STRIPE_KEY);
const MyCart = () => {
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await AxiosConfig.get(apiUrls?.getCartItems);
        return setProducts(response?.cartData);
      } catch (error) {
        return Toast.error(error?.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [reload]);

  const removeFromCart = async (id) => {
    try {
      await AxiosConfig.delete(`${apiUrls.removeProductFromCart}/${id}`);
      Toast.success("Product remove successfully");
      setReload(!reload);
    } catch (e) {
      Toast.error("Something went wrong");
    }
  };
  const checks = (event, id) => {
    console.log(id);
    //  const checked=event.target.checked;
    //  console.log(checkedItems);
    //  const index=checkedItems.findIndex((val)=>val?._id===id);
    //  console.log(index);
    // if(checked){

    // }

  }
  const checkoutNow = async () => {
    try {
      const response = await AxiosConfig.post( apiUrls?.checkoutSession, products);
      console.log(response);
      const Stripe= await stripe;
      await Stripe.redirectToCheckout({sessionId:response?.session});
    } catch (error) {
      console.log(error);
      error?.message && Toast.error(error?.message?.code);

    }
  };
  if (loading) return;
  if (products?.length === 0 && loading===false) {
    return <EmptyCart />;
  }

  return (
    <Cart
      products={products}
      removeFromCart={removeFromCart}
      setReload={setReload}
      checkout={checkoutNow}
      checks={checks}
    />
  );
};

export default memo(MyCart);
