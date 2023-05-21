import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainLayout from "./MainLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Verify from "./pages/Verify";
import { LoggedRoute } from "./utils/ManageRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<MainLayout />} />
        <Route element={<LoggedRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify" element={<Verify />} />
        </Route>
      </Routes>
    </Router>
  );
};
export default App;
