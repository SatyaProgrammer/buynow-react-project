import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Verify = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  console.log(searchParams.get("token"));

  const handleVerify = async (e) => {
    let verifyToken = { token: searchParams.get("token") };

    const response = await axios.post(
      "http://api.localhost/auth/verify",
      verifyToken,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    navigate("/");
  };

  useEffect(() => {
    handleVerify();
  }, []);

  return <></>;
};

export default Verify;
