import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import {
  Login,
  NotFoundPage,
  RegisterPage,
  DisplayUser,
  ShowProducts,
  CreateProduct,
  MyCart,
  Failure,
  Success,
  SuccessfullOrders
} from "pages";
import Protected from "../Layout";
import SingleProduct from "pages/ShowProduct/singleProduct";
import Profile from "pages/UserProfile";
import { AccessDenied } from "src/pages/ErrorPage";


// import { AccessDenied } from "../../pages/Error";

const token = localStorage.getItem("loginToken");
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        exact
        path="/"
        element={
          token ? <Protected Component={ShowProducts} /> : <ShowProducts />
        }
        errorElement={<AccessDenied />}
      />
      <Route
        exact
        path="/products"
        element={
          token ? <Protected Component={ShowProducts} /> : <ShowProducts />
        }
        errorElement={<AccessDenied />}
      />
      <Route exact path="/product/details" element={<SingleProduct />} errorElement={<AccessDenied />} />
      <Route exact path="/profile"
       element={<Protected Component={Profile} />}
       errorElement={<AccessDenied />} />

      <Route
        path="/login"
        element={token ? <Protected Component={Login} /> : <Login />}
        errorElement={<AccessDenied />}
      />
      <Route
        path="/signup"
        element={
          token ? <Protected Component={RegisterPage} /> : <RegisterPage />
        }
        errorElement={<AccessDenied />}
      />
      <Route
        path="/homepage"
        element={<Protected Component={ShowProducts} />}
        errorElement={<AccessDenied />}
      />
      <Route
        path="/users"
        element={<Protected Component={DisplayUser} />}
       

        errorElement={<AccessDenied />}
      />
      <Route
        path="/create-product"
        element={<Protected Component={CreateProduct} />}
        errorElement={<AccessDenied />}
      />
      <Route
        path="/cart"
        element={<Protected Component={MyCart} />}
        errorElement={<AccessDenied />}
      />
       <Route
        path="/orders"
        element={<Protected Component={SuccessfullOrders} />}
        errorElement={<NotFoundPage />}
      />
      <Route path="/*" element={<NotFoundPage />} />
      <Route path="/success" element={<Success />} />
      <Route path="/failure" element={<Failure />} />


    </>
  )
);

export default router;
