import CryptoJS from "crypto-js";
const secretKey = import.meta.env.VITE_CRYPTO_KEY;
const Encrypt = (key) => {
  try{
  return CryptoJS.AES.encrypt(key, secretKey).toString();
  }catch(e){
    return null;
  }
};

const Decrypt = (value) => {
  try {
    return CryptoJS.AES.decrypt(value, secretKey).toString(CryptoJS.enc.Utf8);
  } catch (e) {
    return null;
  }
};

export {Encrypt, Decrypt};
