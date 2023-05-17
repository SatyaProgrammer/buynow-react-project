import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
      if (!error?.response) {
        setErrMsg("No Server Response");
      } else if (error.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (error.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
    }
  };

  return (
    <div className="h-screen bg-gray-100 grid place-items-center">
      <div className="w-80 bg-primary4 text-white shadow-lg flex flex-col gap-8">
        <div className="text-2xl font-semibold border-gray-100 mt-8 px-8">
          Sign In
        </div>
        <form onSubmit={handleSubmit}>
          <div className="px-8 pb-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  id="username"
                  ref={userRef}
                  autoComplete="off"
                  onChange={(e) => setUser(e.target.value)}
                  value={user}
                  required
                  placeholder="Username"
                  className="border-b border-gray-300 w-full py-2 placeholder-white bg-primary4 outline-none text-white caret-white focus:outline focus:outline-1"
                />
              </div>
              <div className="flex flex-col gap-2">
                <input
                  type="password"
                  id="password"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
                  placeholder="Password"
                  className="border-b border-gray-300 w-full py-2 placeholder-white bg-primary4 outline-none text-white caret-white focus:outline focus:outline-1"
                />
              </div>
              <button className="w-full bg-white text-primary4 font-semibold py-2 text-center border-2 border-white hover:bg-primary4 hover:text-white transition-all duration-300">
                Sign In
              </button>
            </div>
            <div className="mt-2">
              <span className="text-sm">Need an account?</span>
              <span className="text-sm underline ml-2">
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
