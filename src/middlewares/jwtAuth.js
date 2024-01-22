const jwt = require("jsonwebtoken");
const { Decrypt } = require("./passwordencryption");
require("dotenv").config();

const paths=["/user-login", "/create-user","/forgetpassword","/products","/checkout-order-success","/checkout-order-failure"]
const generateToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: "24hr" });
};
const jwtProtected = async (req, res, next) => {
  if (paths.includes(req.path))
  {
    return next();
  }
  const Token = req.headers["authorization"];
  console.log(Token);
  if (!Token) {
    return res.status(404).json({ error: "Token not found" });
  }
  try {
    const verifiedUser = jwt.verify(Token, process.env.JWT_SECRET_KEY);
   
    if (verifiedUser) {
      req.user=verifiedUser?.id;
      return next();
    } else {
      return res.status(403).json({ error: "Invalid token" });
    }
  } catch (error) {
    console.log("JWT",error.toString())
    return res.status(500).json({
      message:"Invalid Token" ,
    });
  }
};

module.exports = { generateToken, jwtProtected };
