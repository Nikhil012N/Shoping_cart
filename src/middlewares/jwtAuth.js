const jwt = require("jsonwebtoken");
const { unAuthorizedRoutes } = require("../utils/permissions");

const generateToken = (data) => {
  return jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: "24hr" });
};
const jwtProtected = async (req, res, next) => {
  if (unAuthorizedRoutes.includes(req.path)) {
    return next();
  }
  const token = await req.headers["authorization"];
  let Token;
  if(token?.startsWith("Bearer ")) {
    Token = token.substring(7, token.length);
  } else {
    Token = token;
  }
  if (!Token) {
    return res.status(404).json({ message: "Token not found" });
  }
  try {
    const verifiedUser = jwt.verify(Token, process.env.JWT_SECRET_KEY);
    if (verifiedUser) {
      req.user = verifiedUser?.id;
      req.userRole = verifiedUser?.role;
      return next();
    } else {
      return res.status(403).json({ message: "Invalid token" });
    }
  } catch (error) {
    console.log("JWT", error.toString());
    return res.status(500).json({
      message: error,
    });
  }
};

module.exports = { generateToken, jwtProtected };
