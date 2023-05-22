import { Outlet, Navigate, useLocation, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

export const PrivateRoutes = () => {
  const cookies = new Cookies();
  const location = useLocation();
  const token = cookies.get("jwt_authorization");
  return token ? <Outlet /> : <Navigate to="/login" state={{from: location}} replace/>;
};

export const LoggedRoute = () => {
  const cookies = new Cookies();
  const token = cookies.get("jwt_authorization");
  return token ? <Navigate to={"/"} /> : <Outlet />;
};
