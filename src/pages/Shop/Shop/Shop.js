import React, { useEffect } from "react";
import "./Shop.css";
import { useNavigate } from "react-router";

const Shop = () => {
  const navigate = useNavigate();

  const logged = () => {
    navigate("/sell/dashboard");
  };

  useEffect(() => {
    logged();
  }, []);

  return (
    <>
      <div className="bg-gray-100 h-screen p-8"></div>
    </>
  );
};

export default Shop;
