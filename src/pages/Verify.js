import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Verify = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    let verifyToken = { token: searchParams.get("token") };

    if (verifyToken) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/auth/verify`,
          verifyToken,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response) {
          navigate("/login");
        }
      } catch (error) {}
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    handleVerify();
  }, []);

  return <></>;
};

export default Verify;
