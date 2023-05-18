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
    if (token) {
      logged();
    }
  }, []);

  return (
    <>
      <div className="bg-gray-100 h-screen p-8">
        <div>
          <div className="flex flex-col gap-8">
            <div className="text-3xl font-bold text-primary4">Start Selling and Spark Your Business Success!</div>
            <div>
              Join our platform as a seller and unlock unlimited growth
              potential. Whether you're an experienced entrepreneur or just
              starting out, our community offers the perfect platform to
              showcase your products and reach a wider audience. Sign up now to
              ignite your entrepreneurial journey and seize incredible
              opportunities!
            </div>
            <div>
              <Link className="btn">Sign up</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
