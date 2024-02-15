import { useEffect, useState } from "react";
import LoginPage from "./login";
import LoginWithOtp from "./loginWithOtp";
import toast from "react-hot-toast";
import { AxiosConfig, Encrypt, apiUrls } from "src/utils";
const loginBroadcast = new BroadcastChannel("login");
export const allLoginChannel = () => {
  loginBroadcast.onmessage = (e) => {
      window.location.assign(location.pathname);
      loginBroadcast.close();  
  };
};
const loginHandler = async (values, { setSubmitting, resetForm }) => {
  const submitValues = {
    email: values?.email.toLowerCase(),
    password: Encrypt(values?.password),
  };

  try {
    const response = await AxiosConfig.post(apiUrls?.loginUser, submitValues);
    const token = response?.token;
    const value = Encrypt(token);
    localStorage.setItem("loginToken", value);
    window.location.assign(location.pathname);
    toast.success("Login Successfull");
    resetForm();
  } catch (e) {
    toast.error(e?.message);
  } finally {
    setSubmitting(false);
  }
};

const Login = () => {
  const [login, setLogin] = useState(true);

  useEffect(() => {
    allLoginChannel();
  }, []);
  return login ? (
    <LoginPage setLogin={setLogin} loginHandler={loginHandler} />
  ) : (
    <LoginWithOtp setLogin={setLogin} loginHandler={loginHandler} />
  );
};

export default Login;
