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
    try {
      const response = await axios.post(
        "http://api.localhost/auth/verify",
        verifyToken,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      navigate("/");
    } catch (err) {
      if (!err?.response) {
        //     dispatch({
        //       type: ACTION_TYPES.SET_ERROR_MSG,
        //       payload: "No Server Response",
        //     });
        //   } else if (err.response?.status === 409) {
        //     dispatch({
        //       type: ACTION_TYPES.SET_ERROR_MSG,
        //       payload: "Username Taken",
        //     });
        //   } else {
        //     dispatch({
        //       type: ACTION_TYPES.SET_ERROR_MSG,
        //       payload: "Regitration Failed",
        //     });
      }
      // errRef.current.focus();
    }
  };

  useEffect(() => {
    handleVerify();
  }, []);

  return <></>;
};

export default Verify;
