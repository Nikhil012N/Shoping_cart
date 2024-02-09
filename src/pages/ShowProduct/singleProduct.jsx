
import {useLocation} from 'react-router-dom'
import styles from "./product.module.css";
const SingleProduct = () => {
    const {state}=useLocation()
    console.log("data",state);

  return (
  <>
        <div key={state?.product_name} className={styles.singleCard}>
          <div className={styles.singleFirstSection}>
            <img
              src={state?.thumbnail}
              alt={state?.product_name}
              className={styles?.image}
            />

<div className={styles?.imagesContainer}>
    {state?.images?.map((img,i)=><img
              src={img}
              key={state?.product_id +i}
              alt={img}
              className={styles?.image}
            />)}
</div>
</div>
<div className={styles?.singleSecondSection}>
            <p className={styles?.name}>{state?.product_name}</p>
            <p className={styles?.category}>{state?.product_category}</p>
            <p className={styles?.description}>{state?.description}</p>
            <p>{state?.description}</p>
            <p>
              {state?.stock === 0 ? (
                <span className="text-red-700">Unavilable</span>
              ) : (
                `₹${Number(state?.price)?.toFixed(2)}`
              )}
            </p>

<div>
<div className={styles.inputUpdate}>
              <input
                type="text"
                defaultValue={state?.quantity}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
                className={styles?.input}
                onChange={(e) => {
                }}
              />


</div>

</div>

          </div>
        </div>
    </>
  )
}

export default SingleProduct;