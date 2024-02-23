import { useFormik } from "formik";
import * as Yup from "yup";
import Styles from "./product.module.css";

import { apiUrls, AxiosConfig } from "utils";
import { useState } from "react";
const CreateProduct = () => {
  const [preview, setPreview] = useState({
    thumbnail: "",
    images: [],
  });
  const initialValues = {
    name: "",
    category: "",
    quantity: 0,
    thumbnail: [],
    images: {},
    description: "",
  };

  const productValidationSchema = Yup.object().shape({
    name: Yup.string().min(3, "Too Short!").required().trim(),
    category: Yup.string().min(3, "Too Short!").required().trim(),
    price: Yup.number("Must be a number")
      .required()
      .min(1, "Minimum 1 value is required"),
    thumbnail: Yup.string().min(1, "Thumbnail required"),
    images: Yup.object().required("Images required"),
    quantity: Yup.number("Must be a number")
      .required()
      .min(1, "Minimum 1 value is required"),
    description: Yup.string()
      .min(50, "Minimum 50 characters required")
      .required(),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: productValidationSchema,
    onSubmit: async (values) => {
      const { images, ...rest } = values;
      const formdata = new FormData();
      for (let key in rest) {
        formdata.append(key, rest[key]);
      }
      for (let img of images) {
        formdata.append("images", img);
      }
      await AxiosConfig.post(apiUrls?.addProduct, formdata)
        .then((response) => console.log(response))
        .catch((e) => console.error(e));
    },
  });

  return (
    <div className={Styles?.parent}>
      <div className={Styles?.child}>
        <form onSubmit={formik.handleSubmit} className={Styles?.form}>
          <div className={Styles?.gridGroup}>
            <label htmlFor="name" className={Styles?.labels}>
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className={Styles?.input}
            />
            {formik.touched.name && formik.errors.name ? (
              <div className={Styles?.error}>{formik.errors.name}</div>
            ) : null}
          </div>
          <div className={Styles?.gridGroup}>
            {" "}
            <label htmlFor="category" className={Styles?.labels}>
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={Styles?.input}
              value={formik.values.category}
            />
            {formik.touched.category && formik.errors.category ? (
              <div className={Styles?.error}>{formik.errors.category}</div>
            ) : null}
          </div>
          <div className={Styles?.gridGroup}>
            <label htmlFor="quantity" className={Styles?.labels}>
              Quantity
            </label>
            <input
              type="text"
              id="quantity"
              name="quantity"          
              onChange={(e) => {
             const key=Number(e.nativeEvent.data);
             if(isNaN(key))
             {return;
             }
                formik.handleChange(e);
              }}
              onBlur={formik.handleBlur}
              value={formik.values.quantity}
              className={Styles?.input}
            />
            {formik.touched.quantity && formik.errors.quantity ? (
              <div className={Styles?.error}>{formik.errors.quantity}</div>
            ) : null}
          </div>
          <div className={Styles?.gridGroup}>
            <label htmlFor="price" className={Styles?.labels}>
              Price
            </label>
            <input
              type="text"
              id="price"
              name="price"
              onChange={(e) => {
                const key=Number(e.nativeEvent.data);
                if(isNaN(key))
                {return;
                }
                   formik.handleChange(e);
                 }}
              onBlur={formik.handleBlur}
              value={formik.values.price}
              className={Styles?.input}
            />
            {formik.touched.quantity && formik.errors.quantity ? (
              <div className={Styles?.error}>{formik.errors.price}</div>
            ) : null}
          </div>
          <div className={Styles?.gridGroup}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="thumbnail" className={Styles?.labels}>
                Thumbnail
              </label>
              <input
                type="file"
                id="thumbnail"
                name="thumbnail"
                onChange={(e) => {
                  const file = e.target.files[0];
                  formik?.setFieldValue("thumbnail", file);
                }}
                onBlur={formik.handleBlur}
              />
              {formik.touched.thumbnail && formik.errors.thumbnail ? (
                <div className={Styles?.error}>{formik.errors.thumbnail}</div>
              ) : null}
            </div>
          </div>
          <div className={Styles?.gridGroup}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="images" className={Styles?.labels}>
                Images
              </label>
              <input
                type="file"
                id="images"
                name="images"
                multiple
                onChange={(e) => {
                  const file = e.target.files;
                  formik?.setFieldValue("images", file);
                }}
                onBlur={formik.handleBlur}
              />
              {formik.touched.images && formik.errors.images ? (
                <div className={Styles?.error}>{formik.errors.images}</div>
              ) : null}
            </div>
          </div>
          <div
            className={Styles?.gridGroup}
            style={{ height: "160px", marginBottom: "10px" }}
          >
            <label
              htmlFor="description"
              className={Styles?.labels}
              style={{ display: "grid" }}
            >
              Description
              <textarea
                id="description"
                name="description"
                className={Styles?.input}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                rows={5}
              />
            </label>
            {formik.touched.description && formik.errors.description ? (
              <div className={Styles?.error}>{formik.errors.description}</div>
            ) : null}
          </div>

          <button type="submit" className={Styles?.button}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
