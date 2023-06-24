import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainLayout from "./MainLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Verify from "./pages/Verify";
import { LoggedRoute } from "./utils/ManageRoute";
import Redirecter from "./components/Redirecter";
import SingleProductPage from "./pages/SingleProductPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<MainLayout />} />
        <Route path="/redirect" element={<Redirecter />} />
        <Route path="/products/:id" element={<SingleProductPage />} />
        <Route path="/verify" element={<Verify />} />
        <Route element={<LoggedRoute />}>
          <Route path="/login" element={<Login title="BuyNow - Login" />} />
          <Route path="/signup" element={<Signup title="BuyNow - Signup" />} />
        </Route>
      </Routes>
    </Router>
  );
};
export default App;
