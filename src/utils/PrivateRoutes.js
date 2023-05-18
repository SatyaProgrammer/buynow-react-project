import { Outlet, Navigate } from "react-router-dom";
import Cookies from "universal-cookie";

const PrivateRoutes = () => {
  const cookies = new Cookies();
  const token = cookies.get("jwt_authorization");
  return token ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
