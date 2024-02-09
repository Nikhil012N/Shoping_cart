import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import { useEffect, useState } from "react";
import styles from "./orders.module.css";
import toast from "react-hot-toast";
import { AxiosConfig, apiUrls } from "src/utils";

const SuccessfullOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await AxiosConfig.get(apiUrls?.successfullOrders);
        setOrders(response?.orders);
      } catch (error) {
        toast.error(error?.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <>
      <h1 className={styles?.heading}>Orders History</h1>

      <div className={styles?.container}>
        {orders?.map((list) => {
          return (
            <div className={`${styles?.card} ${styles?.card_sl}`} key={list?._id}>
              <div className={styles?.firstSection}>
                <h3>Shipping Address</h3>
                <p>
                  {list.address.line1} {list.address.line2} ,{list.address.city}
                  ,{list.address.state},{list.address.country},
                  {list.address.postal_code}
                </p>
              </div>
              <div>
                {list.order_details?.map((product, i) => {
                  return (
                    <div
                      key={product?.products?.product_name}
                      className={`${styles?.card} ${styles?.card_sl}`}
                    >
                      <div className={styles.firstSection}>
                        <img
                          src={product?.products.thumbnail}
                          alt={product?.products?.product_name}
                          className={styles?.image}
                        />
                      </div>
                      <div className={styles?.secondSection}>
                        <p>
                          <span>Order </span>
                          #{product?.orders?._id}
                        </p>

                        <p>
                          <span>Product Name</span>
                          {product?.products?.product_name}
                        </p>
                        <p>
                          <span>Quantity</span>
                          {product?.orders?.ordered_items?.quantity}
                        </p>
                        <p>
                          <span>Price</span>
                          {`₹${Number(
                            product?.orders.ordered_items?.price
                          )?.toFixed(2)}`}
                        </p>
                        <p>
                          <span>Total Amount</span>
                          {`₹${Number(
                            product?.orders.ordered_items?.price *
                              product?.orders?.ordered_items?.quantity
                          )?.toFixed(2)}`}
                        </p>
                        <p>
                          <span>Date</span>
                          {Date(product?.orders?.createdAt).slice(0, -30)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SuccessfullOrders;
