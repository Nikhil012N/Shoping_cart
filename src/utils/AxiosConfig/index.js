import axios from "axios";
import { Decrypt } from "utils";
const baseUrl = import.meta.env.VITE_API_URL;
const Encryptedtoken = localStorage.getItem("loginToken");

const JWTErrors=["Token not found","jwt expired","Invalid token"]


const Gettoken = async () => {
  const Token = await Decrypt(Encryptedtoken);
   return Token;
 
 
};

const AxiosConfig = axios.create({
  baseURL: baseUrl,
});
AxiosConfig.interceptors.request.use(
  async (config) => {
    const token =Encryptedtoken && await Gettoken("loginToken");
    if (token) {
      config.headers.Authorization =`Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
AxiosConfig.interceptors.response.use(function (response) {
  return response.data;
}, function (error) {


if(JWTErrors.includes(error?.response?.data?.message)){
  localStorage.clear()
  window.location.assign("/login")
}
  return Promise.reject(error.response.data);
});
export default AxiosConfig;
