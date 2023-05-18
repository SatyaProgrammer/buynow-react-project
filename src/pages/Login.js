import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IconAlert } from "./Shop/utils/Icons";
import axios from "axios";
import Cookies from "universal-cookie";

const LOGIN_URL = "http://api.localhost/auth/login";

const Login = () => {
  // Initialize cookies
  const cookies = new Cookies();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  let data = {
    username: user,
    password: pwd,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(LOGIN_URL, data, {
        headers: { "Content-Type": "application/json" },
      });
      // Set Cookies
      cookies.set("jwt_authorization", response.data.token);
      setUser("");
      setPwd("");
      navigate(from, { replace: true });
    } catch (error) {
      setErrMsg(error?.response.data.error)
    }
  };

  return (
    <div className="h-screen bg-gray-100 grid place-items-center">
      <div className="w-96 bg-white text-primary4 rounded-md shadow-lg flex flex-col gap-8">
        <div className="text-2xl font-semibold underline border-gray-100 mt-8 px-8">
          Sign In
        </div>
        <form onSubmit={handleSubmit}>
          <div className="px-8 pb-8">
            <div className="flex flex-col gap-6">
              {errMsg ? (
                <div className="p-3 px-2 flex gap-1 items-center bg-red-50 text-cldanger font-semibold rounded-lg border-2 border-red-200">
                  <div className="w-4 h-4">
                    <IconAlert fill="#bb2525" />
                  </div>
                  <div>{errMsg}</div>
                </div>
              ) : (
                ""
              )}
              <div className="flex flex-col gap-2">
                <label htmlFor="username" className="text-cldark font-semibold">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  ref={userRef}
                  autoComplete="off"
                  onChange={(e) => setUser(e.target.value)}
                  value={user}
                  required
                  placeholder="Username"
                  className="border border-gray-300 w-full p-3 rounded-lg outline-cldark caret-cldark text-cldark focus:outline focus:outline-1 focus-border-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-cldark font-semibold">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
                  placeholder="Password"
                  className="border border-gray-300 w-full p-3 rounded-lg outline-cldark caret-cldark text-cldark focus:outline focus:outline-1 focus-border-none"
                />
              </div>
              <button className="w-full bg-primary4 text-white font-semibold py-2 text-center border border-primary4 hover:bg-white hover:text-primary4 rounded-md transition-all duration-300">
                Sign In
              </button>
            </div>
            <div className="mt-2">
              <span className="text-sm text-cldark">Need an account?</span>
              <span className="text-sm underline ml-2 font-semibold">
                <Link to={"/signup"}>Sign up</Link>
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
