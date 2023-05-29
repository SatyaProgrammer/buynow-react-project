import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ProductsProvider } from "./context/products_context";
import { FilterProvider } from "./context/filter_context";
import "./index.css";
import { CartProvider } from "./context/cart_context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ProductsProvider>
    <FilterProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </FilterProvider>
  </ProductsProvider>
);
