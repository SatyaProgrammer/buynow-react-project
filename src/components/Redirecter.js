import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Redirecter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    navigate(-1);
  }, []);
};

export default Redirecter;
