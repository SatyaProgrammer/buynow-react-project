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

const App = () => {
  return (
    <Router>
      <Navbar />
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<SingleProduct />} />

        {/* Shop Routes */}
        <Route
          path="/shop"
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

        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
    </Router>
  );
};
export default App;
