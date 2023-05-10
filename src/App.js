import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import MainLayout from "./MainLayout";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="*" element={<MainLayout />}/>
      </Routes>
    </Router>
  );
};
export default App;
