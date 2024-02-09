import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import { memo, useState } from "react";
import styles from "./cart.module.css";
import toast from "react-hot-toast";
import { AxiosConfig, apiUrls } from "utils";
const Cart = (props) => {
  const { products, removeFromCart, setReload ,checkout,checks} = props;

  const [quantityChange, setQuantityChange] = useState({});
  const [showButton, setShowButton] = useState(false);
  const cartHandler = (id) => {
    console.log(id);
    const values = {
      productId: id,
      quantity: quantityChange[id],
    };
    AxiosConfig.put(apiUrls?.updateToCart, values)
      .then((res) => {
        toast.success(res?.message);
        setReload((prev) => (prev = !prev));
      })
      .catch((e) => {
        toast.error(e?.message);
      });
  };
  console.log(products)
  const totalPrice=products?.reduce((sum,current)=>sum + current?.quantity *current?.price,0);
  const totalQuantity=products?.reduce((sum,current)=>sum + current?.quantity ,0);

  return (
    <>
      <h1 className="text-center font-bold py-4 text-rose-500">
        <LocalMallOutlinedIcon fontSize="inherit" /> My Cart
      </h1>
      
      <div className={styles?.container}>
        {products?.map((product, i) => (
          <div key={product?.product_name} className={styles.card}>
            {/* <input type="checkbox" defaultChecked={true} onChange={(e)=>checks(e,product?._id)}/> */}
            <div className={styles.firstSection}>
              <img
                src={product?.thumbnail}
                alt={product?.product_name}
                className={styles?.image}
              />
              <div className={styles.inputUpdate}>
                <input
                  type="text"
                  defaultValue={product?.quantity}
                  onInput={(e) => { 
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                  className={styles?.input}
                  onChange={(e) => {
                    setShowButton((prev) => ({ ...prev, [i]: true }));
                    setQuantityChange((prev) => ({
                      ...prev,
                      [product?.product_id]: e.target.value,
                    }));
                  }}
                />
                <button
                  className={styles?.updateButton }
                  style={{ display: showButton[i] ? "block" : "none" }}
                  onClick={() => {
                    setShowButton((prev) => ({ ...prev, [i]: false }));
                    cartHandler(product?.product_id);
                  }}
                  
                >
                  Update
                </button>
              </div>
            </div>
            <div className={styles?.secondSection}>
              <p className={styles?.name}>{product?.product_name}</p>
              <p className={styles?.category}>{product?.product_category}</p>
              <p className={styles?.description}>{product?.description}</p>
              <p>
                {product?.stock === 0 ? (
                  <span className="text-red-700">Unavilable</span>
                ) : (
                  `₹${Number(product?.price)?.toFixed(2)}`
                )}
              </p>
              <button
                type="button"
                className={styles?.deleteButton}
                onClick={() => removeFromCart(product?.product_id)}
              >
                delete
              </button>
            </div>
          </div>
        ))}
        <div style={{display:"flex",gap:"1vw",flexDirection: 'row-reverse'}}>
         
        <button className={styles?.checkoutButton} onClick={checkout}  >Checkout</button>
        <p className={styles?.price}>Total price : <span>₹{totalPrice.toFixed(2)}</span> </p>
        <p className={styles?.price}>Total quantity :<span> {totalQuantity}</span> </p>

        </div>
      </div>
    </>
  );
};

export default memo(Cart);
