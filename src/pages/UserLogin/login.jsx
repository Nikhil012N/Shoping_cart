import { ErrorMessage, Field, Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { memo, useState } from "react";
import styles from "./login.module.css";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";



const LoginPage = ({loginHandler}) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required")
      .trim(),
    password: Yup.string()
      .required("Password is required")
      .min(5, "Must have 5 character")
      .trim(),
  });

  return (
    <div className={styles?.parentContainer}>
      <div className={styles?.firstInnerContainer}>
        <h1>Welcome to our website</h1>
        <p>
          Forget shopping sprees, ignite self-discovery! Dive into a boundless
          treasure trove of curated finds, where trends and treasures meet your
          unique flair. Dress your bold, express your playful, find outfits that
          whisper your story. We're not just a shopping site, we're your style
          playground, ready to unleash the vibrant you.
        </p>
      </div>
      <div className={styles?.secondInnerContainer}>
        <h1 className={styles?.head}>Login</h1>
        <div className="grid p-2">
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={loginHandler}
          >
            {({
              values,
              errors,
              touched,
              isSubmitting,
              handleChange,
              handleBlur,
            }) => (
              <Form>
                <div className={styles?.gridGroup}>
                  <label htmlFor="email">Email</label>
                  <Field
                    name="email"
                    type="email"
                    value={values?.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={styles?.formInput}
                    autoComplete={"email"}
                  />
                  {errors?.email && touched?.email && (
                    <ErrorMessage name="email" component="div" />
                  )}
                </div>
                <div className={styles?.gridGroup}>
                  <label htmlFor="password">Password</label>
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete={"new password"}
                  />
                  <span
                    className={styles?.showHide}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <VisibilityOutlinedIcon />
                    ) : (
                      <VisibilityOffOutlinedIcon />
                    )}
                  </span>
                  {errors.password && touched.password && (
                    <ErrorMessage name="password" component="div" />
                  )}
                </div>

                <div className={styles?.loginButtons}>
                  <button type="submit" className={styles?.login} disabled={isSubmitting}>
                    Login
                  </button>
                  <button type="button" className={styles?.signup} onClick={() => navigate("/signup")}>
                    Signup
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default memo(LoginPage);
