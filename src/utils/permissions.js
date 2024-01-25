const commonAuthRoutes = ["/user/:id", "/update-user/:id", "/get-profile"];

const userPermissions = [
  "/add-to-cart",
  "/get-cart-items",
  "/remove-from-cart/:id",
  "/update-to-cart",
  "/start-checkout-session",
];
const clientPermissions = ["/products/new-products"];
const unAuthorizedRoutes = [
  "/user-login",
  "/create-user",
  "/forgetpassword",
  "/products",
  "/login-with-otp",
];

module.exports = {
  userPermissions,
  clientPermissions,
  unAuthorizedRoutes,
  commonAuthRoutes,
};
