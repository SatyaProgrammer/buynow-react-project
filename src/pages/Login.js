import { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";

const LOGIN_URL = "/auth";

const Login = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const response = await axios.post(
      //   LOGIN_URL,
      //   JSON.stringify({ user, pwd }),
      //   {
      //     headers: { "Content-Type": "application/json" },
      //     withCredentials: true,
      //   }
      // );
      // const accessToken = response?.data?.accessToken;
      // const roles = response?.data?.roles;
      // setAuth({ user, pwd, roles, accessToken });
      setAuth(true);
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
      errRef.current.focus();
    }
  };

  return (
    <div className="h-screen bg-white grid place-items-center">
      <div className="w-80 bg-primary4 text-white shadow-lg flex flex-col">
        <div className="text-2xl font-semibold border-gray-100 mt-8 mb-6 ml-6">
          Sign In
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6 px-8 pb-8">
            <div className="flex flex-col gap-4">
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
            </div>
            <button className="w-full bg-white text-primary4 font-semibold py-2 text-center border-2 border-white hover:bg-primary4 hover:text-white transition-all duration-300">
              Sign In
            </button>
          </div>
        </form>
        <p className="text-white ml-8">
          Need an Account?
          <br />
          <span className="line">
            <Link to={`/signup`}>Sign up</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
