import React, { useEffect } from "react";
import "./Shop.css";
import { useNavigate } from "react-router";
import Cookies from "universal-cookie";
import { Link } from "react-router-dom";

const Shop = () => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const token = cookies.get("jwt_authorization");

  const logged = () => {
    navigate("/shop/dashboard");
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
