import React from "react";
import { Link } from "react-router-dom";

const ShopInfo = () => {
    return (
      <>
        <div className="container">
          <div className="flex flex-col gap-8 py-8">
            <div className="text-3xl font-bold text-primary4">
              Start Selling and Spark Your Business Success!
            </div>
            <div>
              Join our platform as a seller and unlock unlimited growth
              potential. Whether you're an experienced entrepreneur or just
              starting out, our community offers the perfect platform to
              showcase your products and reach a wider audience. Sign up now to
              ignite your entrepreneurial journey and seize incredible
              opportunities!
            </div>
            <div>
              <Link to="/login" className="btn">Sign up</Link>
            </div>
          </div>
        </div>
      </>
    );
}

export default ShopInfo