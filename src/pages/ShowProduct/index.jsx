import { AxiosConfig, apiUrls } from "utils";
import { MaintenanceMode } from "../ErrorPage";
import Products from "./allProducts";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const ShowProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    AxiosConfig.get(apiUrls?.showProduct)
      .then((res) => {
        setError("");
        setAllProducts(res?.product)})
      .catch((e) => {
        console.log(e);
        setError(e?.message);
        e?.message &&  toast.error(e?.message);
      });
  }, []);
console.log(allProducts);
  if (error === "Network Error") {
    return <MaintenanceMode />;
  }
  return <Products allProducts={allProducts} />;
};

export default ShowProducts;
