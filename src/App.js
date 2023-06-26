import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainLayout from "./MainLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Verify from "./pages/Verify";
import { LoggedRoute } from "./utils/ManageRoute";
import Redirecter from "./components/Redirecter";
import SingleProductPage from "./pages/SingleProductPage";
import { AdminRoutes } from "./utils/ManageRoute";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminNavbar from "./components/AdminNavbar";
import User_detail from "./pages/Admin/User_detail";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Product_detail from "./pages/Admin/Product_detail";
import { NormalRoutes } from "./utils/ManageRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<AdminRoutes />}>
          <Route
            path="/admin"
            element={
              <>
                <AdminNavbar />
                <AdminDashboard />
              </>
            }
          />
          <Route
            path="/admin/user/:id"
            element={
              <>
                <AdminNavbar />
                <User_detail />
              </>
            }
          />
          <Route
            path="/admin/user_product/:uid/:pid"
            element={
              <>
                <AdminNavbar />
                <Product_detail />
              </>
            }
          />
        </Route>
        <Route path="*" element={<MainLayout />} />
        <Route path="/redirect" element={<Redirecter />} />
        <Route element={<NormalRoutes />}>
          <Route path="/products/:id" element={<SingleProductPage />} />
        </Route>
        <Route path="/verify" element={<Verify />} />
        <Route element={<LoggedRoute />}>
          <Route path="/login" element={<Login title="BuyNow - Login" />} />
          <Route path="/signup" element={<Signup title="BuyNow - Signup" />} />
          <Route
            path="/forget-password"
            element={<ForgetPasswordPage title="BuyNow - Forget passoword" />}
          />
        </Route>
        <Route
          path="/reset"
          element={<ResetPasswordPage title="BuyNow - Reset password" />}
        />
      </Routes>
    </Router>
  );
};
export default App;
