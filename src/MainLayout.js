import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar, Sidebar, Footer } from "./components";
import {
  About,
  Cart,
  Checkout,
  Error,
  Home,
  Products,
  SingleProduct,
} from "./pages";

import Shop from "./pages/Shop/Shop/Shop";
import Dashboard from "./pages/Shop/Dashboard/Dashboard";
import ShopSidebar from "./pages/Shop/ShopSidebar/ShopSidebar";
import Product from "./pages/Shop/Product/Product";
import Order from "./pages/Shop/Order/Order";
import Customer from "./pages/Shop/Customer/Customer";
import AddProduct from "./pages/Shop/AddProduct/AddProduct";
import ProductDetail from "./pages/Shop/ProductDetail/ProductDetail";
import History from "./pages/HistoryPage";
import { PrivateRoutes } from "./utils/ManageRoute";

const MainLayout = () => {
  return (
    <React.Fragment>
      <Navbar />
      <Sidebar />
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/checkout" element={<Checkout />} />

          <Route
            path="/shop/dashboard"
            element={
              <>
                <ShopSidebar />
                <Dashboard />
              </>
            }
          />
          <Route
            path="/shop/product"
            element={
              <>
                <ShopSidebar />
                <Product />
              </>
            }
          />
          <Route
            path="/shop/order"
            element={
              <>
                <ShopSidebar />
                <Order />
              </>
            }
          />
          <Route
            path="/shop/customer"
            element={
              <>
                <ShopSidebar />
                <Customer />
              </>
            }
          />
          <Route
            path="/shop/add_product"
            element={
              <>
                <ShopSidebar />
                <AddProduct />
              </>
            }
          />
          <Route
            path="/shop/product/:id"
            element={
              <>
                <ShopSidebar />
                <ProductDetail />
              </>
            }
          />

          <Route
            path="/history"
            element={
              <>
                <History />
              </>
            }
          />

          <Route path="/shop" element={<Shop />} />
        </Route>

        <Route path="/" element={<Products />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        {/* <Route path="/products" element={<Products />} /> */}
        <Route path="/products/:id" element={<SingleProduct />} />
        <Route path="/shop" element={<Shop />} />

        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
    </React.Fragment>
  );
};
export default MainLayout;
