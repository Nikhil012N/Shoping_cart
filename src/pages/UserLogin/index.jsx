import { useState } from "react";
import LoginPage from "./login";
import LoginWithOtp from "./loginWithOtp";


const loginBroadcast= new BroadcastChannel("login");



const Login = () => {
  const [login,setLogin] = useState(true);

  return (login ? (
    <LoginPage setLogin={setLogin} broadcast={loginBroadcast} />
  ) : (
    <LoginWithOtp setLogin={setLogin} broadcast={loginBroadcast}  />
  ));
};

export default Login;
