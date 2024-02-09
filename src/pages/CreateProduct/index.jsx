import CreateProduct from "./createproduct";
import React,{useState,useEffect} from 'react'
import ShowProducts from "./showallcreatorproducts";
import styles from "./product.module.css";
import { AxiosConfig, apiUrls } from "utils";
import toast from 'react-hot-toast'
import ProductsNotFound from "../ErrorPage/noProducts";

const CreateProducts = () => {
  const[allProducts,setAllProducts]=useState([]);
  useEffect(() => {
    AxiosConfig.get(apiUrls?.showProduct)
      .then((res) => {
        setAllProducts(res?.product)})
      .catch((e) => {
        e?.message &&  toast.error(e?.message);
      });
  }, []);
console.log(allProducts);

  return (
    // <ProductsNotFound/>
    <div className={styles?.main}>
    <CreateProduct/>
   <ShowProducts allProducts={allProducts}/>
    </div>
  )
}
export default CreateProducts;