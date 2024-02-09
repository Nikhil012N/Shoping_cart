/* eslint-disable react/prop-types */
import {  memo, useEffect, useState } from "react";
import { Modal, Box } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import {apiUrls,AxiosConfig} from "utils"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: "5px",
  boxShadow: 24,
};

const RegisterSchema = yup.object().shape({
  name: yup.string().required("Name is required").trim(),
  username: yup.string().required("Username is required").trim(),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required")
    .trim(),
  age: yup.number("Must be a number").required("Age is required"),
  gender: yup.string().required("Gender is required"),
});
const EditPopup = (props) => {
  const { open, setOpen } = props;

  const [initials, setInitials] = useState({
    name: "",
    username: "",
    email: "",
    age: "",
    gender: "",
  });
  useEffect(() => {
    AxiosConfig.get(`${apiUrls?.getUser}/${open}`).then((res) => setInitials(res?.user));
  }, [open]);
  const id = open;
  const submitHandler = async (values, { setSubmitting, resetForm }) => {
    const { age, ...rest } = values;
    rest.age = String(age);
    AxiosConfig
      .put(`${apiUrls?.updateUser}/${id}`, rest)
      .then(() => {
        toast("update successfull");
        resetForm();
        setOpen(false);
      })
      .catch((error) => toast.error(error?.message))
      .finally(setSubmitting(false));
  };

  return (
    <div>
      <Modal open={open && true} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <div className="bg-purple-600 flex justify-between border-b-2 border-solid">
            <h2 className="text-white">Edit User</h2>
            <button
              onClick={() => setOpen(false)}
              className="text-white bg-inherit focus:outline-purple-700"
            >
              {" "}
              &#10005;{" "}
            </button>
          </div>
          <div className="p-2">
            <Formik
              enableReinitialize
              initialValues={initials}
              validationSchema={RegisterSchema}
              onSubmit={submitHandler}
            >
              {({ values, errors, touched, isSubmitting }) => (
                <Form>
                  <div className="grid p-2 gap-2 grid-cols-1">
                    <div className="grid group">
                      <label
                        htmlFor="name"
                        className="group-focus-within:text-purple-800"
                      >
                        Name
                      </label>
                      <Field
                        type="text"
                        name="name"
                        value={values?.name}
                        className="border-2 my-2 lowercase rounded border-grey-300 p-2 caret-purple-500 outline-none focus:text-purple-800 w-[100%]"
                      />
                      <span
                        className={`${
                          errors.name ? "visible" : "invisible"
                        } text-red-500`}
                      >
                        {errors?.name}
                      </span>
                    </div>
                    <div className="grid group">
                      <label
                        htmlFor="username"
                        className="group-focus-within:text-purple-800"
                      >
                        Username
                      </label>
                      <Field
                        type="text"
                        name="username"
                        value={values?.username}
                        autoComplete="username"
                        className="border-2 my-2 lowercase rounded border-grey-300 p-2 caret-purple-500 outline-none focus:text-purple-800 w-[100%]"
                      />
                      {errors.username && touched.username && (
                        <ErrorMessage
                          name="username"
                          component="span"
                          className="text-red-500"
                        />
                      )}
                    </div>
                    <div className="grid group">
                      <label
                        htmlFor="email"
                        className="group-focus-within:text-purple-800"
                      >
                        Email
                      </label>
                      <Field
                        type="email"
                        name="email"
                        autoComplete="email"
                        value={values?.email}
                        className="border-2 my-2 lowercase rounded border-grey-300 p-2 caret-purple-500 outline-none focus:text-purple-800 w-[100%]"
                      />
                      {errors.email && touched.email && (
                        <ErrorMessage
                          name="email"
                          component="span"
                          className="text-red-500"
                        />
                      )}
                    </div>

                    <div className="grid group">
                      <label
                        htmlFor="age"
                        className="group-focus-within:text-purple-800"
                      >
                        Age
                      </label>
                      <Field
                        type="text"
                        name="age"
                        value={values?.age}
                        className="border-2 my-2 lowercase rounded border-grey-300 p-2 caret-purple-500 outline-none focus:text-purple-800 w-[100%]"
                      />
                      {errors.age && touched.age && (
                        <ErrorMessage
                          name="age"
                          component="span"
                          className="text-red-500"
                        />
                      )}
                    </div>
                    <div className="grid group">
                      <label
                        htmlFor="gender"
                        className="group-focus-within:text-purple-800"
                      >
                        Gender
                      </label>
                      <Field
                        as="select"
                        name="gender"
                        value={values?.gender}
                        className="border-2 my-2 lowercase rounded border-grey-300 p-2 caret-purple-500 outline-none focus:text-purple-800 w-[100%]"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </Field>
                      {errors.gender && touched.gender && (
                        <ErrorMessage
                          name="gender"
                          component="span"
                          className="text-red-500"
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="outline-purple-800"
                      disabled={isSubmitting}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="outline-sky-800"
                      disabled={isSubmitting}
                      onClick={() => setOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default memo(EditPopup);
