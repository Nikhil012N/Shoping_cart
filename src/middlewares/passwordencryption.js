const bcrypt = require("bcrypt");
const CryptoJS = require("crypto-js");
require("dotenv").config();
const secretKey = process.env.CRYPTO_KEY;
const saltRounds = 15;

const hashPassword = async (password) => {
  const hashed = await bcrypt.hash(password, saltRounds);
  return hashed;
};
const comparePassword = async (password, hashedPassword) => {
  const compared = await bcrypt.compare(password, hashedPassword);
  return compared;
};

const Decrypt = (password) => {
  try{
  return CryptoJS.AES.decrypt(password, secretKey).toString(CryptoJS.enc.Utf8);
}catch(e){
  return null
}

};
const Encrypt = (data) => {
  try{
  return CryptoJS.AES.encrypt(data, secretKey).toString();
}catch(e){
  return null
}
};

module.exports = { hashPassword, comparePassword, Decrypt, Encrypt };
