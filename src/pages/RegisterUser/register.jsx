import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { apiUrls, AxiosConfig, Encrypt } from "utils";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import styles from "./register.module.css";
const RegisterSchema = yup.object().shape({
  name: yup.string().required("Name is required").trim().lowercase(),
  username: yup.string().required("Username is required").trim().lowercase(),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required")
    .trim()
    .lowercase(),
  password: yup.string().required("Password is required").trim(),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .trim(),
  age: yup.number("Must be a number").required("Age is required"),
  gender: yup.string().required("Gender is required"),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const submitHandler = async (values, { setSubmitting, resetForm }) => {
    console.log(values);
    // eslint-disable-next-line no-unused-vars
    const { password,confirmPassword, ...rest } = values;
    const hashedPassword = Encrypt(password);
    rest.password = hashedPassword;
    AxiosConfig.post(apiUrls?.registerUser, rest)
      .then(() => {
        toast("Registeration successfull");
        navigate("/login");
        resetForm();
      })
      .catch((error) => {
        toast.error(error?.message);
      })
      .finally(setSubmitting(false));
  };

  return (
    <div className={styles?.parentContainer}>
      <div className={styles?.childContainer}>

            <h1 className={styles?.head}>SignUp</h1>
          <Formik
            initialValues={{
              name: "",
              username: "",
              email: "",
              password: "",
              confirmPassword: "",
              age: "",
              gender: "",
            }}
            validationSchema={RegisterSchema}
            onSubmit={submitHandler}
          >
            {({ values, errors, touched, isSubmitting }) => (
              <Form>
                <div className={styles?.form}>
                  <div className={styles?.gridGroup}>
                    <label htmlFor="name">Name</label>
                    <Field type="text" name="name" value={values?.name} />
                    <ErrorMessage
                      name="name"
                      component="div"
               
                    />
                  </div>
                  <div className={styles?.gridGroup}>
                    <label htmlFor="username">Username</label>
                    <Field
                      type="text"
                      name="username"
                      value={values?.username}
                      autoComplete="username"
                    />
                    {errors.username && touched.username && (
                      <ErrorMessage
                        name="username"
                        component="span"
                 
                      />
                    )}
                  </div>
                  <div className={styles?.gridGroup}>
                    <label htmlFor="email">Email</label>
                    <Field
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={values?.email}
                    />
                    {errors.email && touched.email && (
                      <ErrorMessage
                        name="email"
                        component="span"
                 
                      />
                    )}
                  </div>
                  <div className={styles?.gridGroup}>
                    <label htmlFor="password">Password</label>
                    <Field
                      type="password"
                      name="password"
                      value={values?.password}
                      autoComplete="new-password"
                    />
                    {errors.password && touched.password && (
                      <ErrorMessage
                        name="password"
                        component="span"
                 
                      />
                    )}
                  </div>
                  <div className={styles?.gridGroup}>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <Field
                      type="password"
                      name="confirmPassword"
                      value={values?.confirmPassword}
                      autoComplete="new-password"
                    />
                    {errors.confirmPassword && touched.confirmPassword && (
                      <ErrorMessage
                        name="confirmPassword"
                        component="span"
                 
                      />
                    )}
                  </div>
                  <div className={styles?.gridGroup}>
                    <label htmlFor="age">Age</label>
                    <Field type="text" name="age" value={values?.age} />
                    {errors.age && touched.age && (
                      <ErrorMessage name="age" component="span" />
                    )}
                  </div>
                  <div className={styles?.gridGroup}>
                    <label htmlFor="gender">Gender</label>
                    <Field as="select" name="gender" value={values?.gender}>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Field>
                    {errors.gender && touched.gender && (
                      <ErrorMessage
                        name="gender"
                        component="span"
                 
                      />
                    )}
                  </div>
                </div>
                <div>
                  <button
                    type="submit"   
                    className={styles.signup}        
                    disabled={isSubmitting}
                  >
                    Register
                  </button>
                  <button
                    type="button"
                    className={styles?.login}
                    disabled={isSubmitting}
                  >
                    Login
                  </button>
                </div>
              </Form>
            )}
          </Formik>
      
      </div>
    </div>
  );
};

export default RegisterPage;
