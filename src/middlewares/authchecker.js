const User = require("../models/user.Schema");
const { userRoles } = require("../utils/constant");
const {
  commonAuthRoutes,
  userPermissions,
  clientPermissions,
  unAuthorizedRoutes,
} = require("../utils/permissions");
const authCheker = async (req, res, next) => {
  if (unAuthorizedRoutes.includes(req.path)) {
    return next();
  }
  const user = await req.user;
  const findUser = await User?.findById(user);
  try {
    if (!findUser) {
      return res.status(404).send({ message: "User not found !" });
    }

    if (!userRoles.includes(findUser?.role)) {
      return res.status(403).send({ message: "Your role is undefined" });
    }

    if (findUser?.role === "admin") {
      return next();
    }
    if (findUser?.role === "client") {
      if (
        commonAuthRoutes.includes(req.path) ||
        clientPermissions.includes(req.path)
      ) {
        return next();
      }
      return res.status(403).send({ message: "Access denied" });
    }
    if (findUser?.role === "user") {
      if (
        commonAuthRoutes.includes(req.path) ||
        userPermissions.includes(req.path)
      ) {
        return next();
      }
      return res.status(403).send({ message: "Access denied" });
    }
  } catch (error) {
    console.error("authchecker", error.toString());
    res.status(403), send({ message: error });
  }
};
module.exports = authCheker;
