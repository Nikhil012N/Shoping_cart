import {memo, useState } from "react";
import { apiUrls, AxiosConfig } from "utils";
import toast from "react-hot-toast";
import Styles from "./product.module.css";
import {useNavigate} from 'react-router-dom'

const Products = ({ allProducts }) => {
  const [selectedItems, setSelectedItems] = useState({});
  console.log(selectedItems);
  const navigate=useNavigate();
  const cartHandler = (id) => {
    
    console.log(id);
    const values = {
      productId: id,
      quantity: selectedItems[id]||1,
    };
    AxiosConfig.post(apiUrls?.addToCart, values)
      .then((res) => {
        toast.success(res?.message);
      navigate("/cart");
      })
      .catch((e) =>
      {
      toast.error(e?.message)});
  };
    const buyHandler = (id) => {
      console.log(id);
 toast.error("Currently disabled")
    };
  const selectHandler = (event, id) => {
    const value = event?.target?.value;
    setSelectedItems({ ...selectedItems, [id]: value });
  };

  return (
    <div  className={Styles?.container}>
      {allProducts?.map((product,i) => {
        return (
          <div className={Styles?.card} key={product?.product_name} >
            <div className={Styles?.imgContainer}>
            <img src={product?.thumbnail} alt={product?.product_name} onClick={()=>navigate("/product/details",{state:allProducts[i]})} />
            </div>
           
              <h1 className={Styles?.title}>{product?.product_name}</h1>

             { product?.stock == 0 && <p className={Styles.unavailable}>Currently unavilable
              </p>}

              <p className={Styles.priceSelect}>
                {" "}
                <span className={Styles?.price}>
                  {product?.price?.toFixed(2)}
                </span>
                <select
                  name={product?.title}
                  className={Styles.select}
                  disabled={product.stock == 0 && true}
                  onChange={(e) => selectHandler(e, product?._id)}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </p>
           
            <div style={{ display: "grid", gridGap: "5px",alignSelf:"center" }}>
              <button
                className={Styles?.addToCart}
                disabled={product.stock == 0 && true}
                onClick={(e) =>{e.stopPropagation(); cartHandler(product?._id)}}
              >
                <img
                  src="/add-to-cart.svg"
                  alt="add to cart"
                  height={24}
                  width={24}
                />
                Add to cart
              </button>
              <button
            className={Styles?.buyNow}
            onClick={() => buyHandler(product?.id)}
          >
            <img src="/buy-icon.svg" alt="add to cart" height={24} width={24} />
            Buy Now
          </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default memo(Products);
