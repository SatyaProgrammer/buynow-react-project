import React, { useEffect, useReducer, useRef } from "react";
import {
  signupReducer,
  INITIAL_STATE,
  ACTION_TYPES,
} from "../reducers/signup_reducer";
import axios from "axios";
import { API_CALL } from "./Shop/utils/Constant";
import { Link } from "react-router-dom";
import { IconAlert, IconCheck } from "./Shop/utils/Icons";

const USERNAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const Signup = () => {
  const [state, dispatch] = useReducer(signupReducer, INITIAL_STATE);
  const usernameRef = useRef();
  const emailRed = useRef();

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  useEffect(() => {
    dispatch({
      type: ACTION_TYPES.SET_VALID_USERNAME,
      payload: USERNAME_REGEX.test(state.username),
    });
  }, [state.username]);

  useEffect(() => {
    dispatch({
      type: ACTION_TYPES.SET_VALID_EMAIL,
      payload: EMAIL_REGEX.test(state.email),
    });
  }, [state.email]);

  useEffect(() => {
    dispatch({
      type: ACTION_TYPES.SET_VALID_PASSWORD,
      payload: PASSWORD_REGEX.test(state.password),
    });
    dispatch({
      type: ACTION_TYPES.SET_VALID_CONFIRM_PASSWORD,
      payload: state.password === state.confirmPassword,
    });
  }, [state.password, state.confirmPassword]);

  useEffect(() => {
    dispatch({ type: ACTION_TYPES.SET_ERROR, payload: "" });
  }, [state.username, state.email, state.password, state.confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = USERNAME_REGEX.test(state.username);
    const v2 = PASSWORD_REGEX.test(state.password);
    const v3 = EMAIL_REGEX.test(state.email);
    if (!v1 || !v2 || !v3) {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: "Invalid Entry" });
      return;
    }
    let data = JSON.stringify({
      username: state.username,
      password: state.password,
      email: state.email,
    });
    try {
      const response = await axios.post(
        "http://api.localhost/auth/register",
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      dispatch({ type: ACTION_TYPES.SET_SUCCESS, payload: true });
      dispatch({ type: ACTION_TYPES.SET_USERNAME, payload: "" });
      dispatch({ type: ACTION_TYPES.SET_PASSWORD, payload: "" });
      dispatch({ type: ACTION_TYPES.SET_EMAIL, payload: "" });
      dispatch({ type: ACTION_TYPES.SET_CONFIRM_PASSWORD, payload: "" });
      window.scrollTo(0, 0);
      dispatch({type:ACTION_TYPES.SET_SUCCESS, payload: "Signup successful"})
    } catch (err) {
      dispatch({type:ACTION_TYPES.SET_ERROR, payload: err?.response.data.error})
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className=" p-8 bg-gray-100 grid place-items-center">
      <div className="w-96 bg-white shadow-lg flex flex-col gap-6 rounded-md">
        <div className="text-3xl font-semibold text-primary4 underline px-8 mt-6">
          Sign up
        </div>
        <form onSubmit={handleSubmit}>
          <div className="px-8 pb-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                {state.success ? (
                  <div className="p-3 px-2 flex gap-1 items-center bg-green-50 text-clgreen font-semibold rounded-lg border-2 border-green-200">
                    <div className="w-4 h-4">
                      <IconCheck fill="#25bb32" />
                    </div>
                    <div>{state.success}</div>
                  </div>
                ) : (
                  ""
                )}
                {state.errorMsg ? (
                  <div className="p-3 px-2 flex gap-1 items-center bg-red-50 text-cldanger font-semibold rounded-lg border-2 border-red-200">
                    <div className="w-4 h-4">
                      <IconAlert fill="#bb2525" />
                    </div>
                    <div>{state.errorMsg}</div>
                  </div>
                ) : (
                  ""
                )}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="username"
                    className={
                      !state.validUsername && state.username
                        ? "text-cldanger font-semibold"
                        : "text-cldark font-semibold"
                    }
                  >
                    <div className="flex items-center gap-1">
                      {!state.validUsername && state.username ? (
                        <div className="h-4 w-4">
                          <IconAlert fill="#bb2525" />
                        </div>
                      ) : (
                        ""
                      )}
                      <div>Username</div>
                    </div>
                  </label>
                  <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    id="username"
                    value={state.username}
                    required
                    autoComplete="off"
                    ref={usernameRef}
                    onChange={(e) =>
                      dispatch({
                        type: ACTION_TYPES.SET_USERNAME,
                        payload: e.target.value,
                      })
                    }
                    onFocus={() =>
                      dispatch({
                        type: ACTION_TYPES.SET_USERNAME_FOCUS,
                        payload: true,
                      })
                    }
                    onBlur={() =>
                      dispatch({
                        type: ACTION_TYPES.SET_USERNAME_FOCUS,
                        payload: false,
                      })
                    }
                    className={
                      !state.validUsername && state.username
                        ? "border border-cldanger w-full p-3 rounded-lg outline-cldanger caret-cldark text-cldanger focus:outline focus:outline-1 focus:border-none"
                        : "border border-gray-300 w-full p-3 rounded-lg outline-cldark caret-cldark text-cldark focus:outline focus:outline-1 focus-border-none"
                    }
                  />
                  <div
                    className={
                      state.usernameFocus &&
                      !state.validUsername &&
                      state.username
                        ? ""
                        : "hidden"
                    }
                  >
                    <div className="text-xs font-normal text-cldanger">
                      4 to 24 characters.
                      <br />
                      Must begin with a letter.
                      <br />
                      Letters, numbers, underscores, hyphens allowed.
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className={
                      !state.validEmail && state.email
                        ? "text-cldanger font-semibold"
                        : "text-cldark font-semibold"
                    }
                  >
                    <div className="flex items-center gap-1">
                      {!state.validEmail && state.email ? (
                        <div className="h-4 w-4">
                          <IconAlert fill="#bb2525" />
                        </div>
                      ) : (
                        ""
                      )}
                      <div>Email</div>
                    </div>
                  </label>
                  <input
                    type="text"
                    placeholder="Email"
                    name="email"
                    id="email"
                    required
                    autoComplete="off"
                    value={state.email}
                    onChange={(e) =>
                      dispatch({
                        type: ACTION_TYPES.SET_EMAIL,
                        payload: e.target.value,
                      })
                    }
                    onFocus={() =>
                      dispatch({
                        type: ACTION_TYPES.SET_EMAIL_FOCUS,
                        payload: true,
                      })
                    }
                    onBlur={() =>
                      dispatch({
                        type: ACTION_TYPES.SET_EMAIL_FOCUS,
                        payload: false,
                      })
                    }
                    className={
                      !state.validEmail && state.email
                        ? "border border-cldanger w-full p-3 rounded-lg outline-cldanger caret-cldark text-cldanger focus:outline focus:outline-1 focus:border-none"
                        : "border border-gray-300 w-full p-3 rounded-lg outline-cldark caret-cldark text-cldark focus:outline focus:outline-1 focus-border-none"
                    }
                  />
                  <div
                    className={
                      state.emailFocus && !state.validEmail && state.email
                        ? ""
                        : "hidden"
                    }
                  >
                    <div className="text-xs font-normal text-cldanger">
                      Must input valid email for this field
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="password"
                    className={
                      !state.validPassword && state.password
                        ? "text-cldanger font-semibold"
                        : "text-cldark font-semibold"
                    }
                  >
                    <div className="flex items-center gap-1">
                      {!state.validPassword && state.password ? (
                        <div className="h-4 w-4">
                          <IconAlert fill="#bb2525" />
                        </div>
                      ) : (
                        ""
                      )}
                      <div>Password</div>
                    </div>
                  </label>
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    id="password"
                    required
                    autoComplete="off"
                    value={state.password}
                    onChange={(e) =>
                      dispatch({
                        type: ACTION_TYPES.SET_PASSWORD,
                        payload: e.target.value,
                      })
                    }
                    onFocus={() =>
                      dispatch({
                        type: ACTION_TYPES.SET_PASSWORD_FOCUS,
                        payload: true,
                      })
                    }
                    onBlur={() =>
                      dispatch({
                        type: ACTION_TYPES.SET_PASSWORD_FOCUS,
                        payload: false,
                      })
                    }
                    className={
                      !state.validPassword && state.password
                        ? "border border-cldanger w-full p-3 rounded-lg outline-cldanger caret-cldark text-cldanger focus:outline focus:outline-1 focus:border-none"
                        : "border border-gray-300 w-full p-3 rounded-lg outline-cldark caret-cldark text-cldark focus:outline focus:outline-1 focus-border-none"
                    }
                  />
                  <div
                    className={
                      state.passwordFocus &&
                      !state.validPassword &&
                      state.password
                        ? ""
                        : "hidden"
                    }
                  >
                    <div className="text-xs font-normal text-cldanger">
                      8 to 24 characters.
                      <br />
                      Must include uppercase and lowercase letters, a number and
                      a special character.
                      <br />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="confirmPassword"
                    className={
                      !state.validConfirmPassword && state.confirmPassword
                        ? "text-cldanger font-semibold"
                        : "text-cldark font-semibold"
                    }
                  >
                    <div className="flex items-center gap-1">
                      {!state.validConfirmPassword && state.confirmPassword ? (
                        <div className="h-4 w-4">
                          <IconAlert fill="#bb2525" />
                        </div>
                      ) : (
                        ""
                      )}
                      <div>Confrim Password</div>
                    </div>
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm password"
                    name="confirmPassword"
                    id="confirmPassword"
                    required
                    autoComplete="off"
                    value={state.confirmPassword}
                    onChange={(e) =>
                      dispatch({
                        type: ACTION_TYPES.SET_CONFIRM_PASSWORD,
                        payload: e.target.value,
                      })
                    }
                    onFocus={() =>
                      dispatch({
                        type: ACTION_TYPES.SET_CONFIRM_PASSWORD_FOCUS,
                        payload: true,
                      })
                    }
                    onBlur={() =>
                      dispatch({
                        type: ACTION_TYPES.SET_CONFIRM_PASSWORD_FOCUS,
                        payload: false,
                      })
                    }
                    className={
                      !state.validConfirmPassword && state.confirmPassword
                        ? "border border-cldanger w-full p-3 rounded-lg outline-cldanger caret-cldark text-cldanger focus:outline focus:outline-1 focus:border-none"
                        : "border border-gray-300 w-full p-3 rounded-lg outline-cldark caret-cldark text-cldark focus:outline focus:outline-1 focus-border-none"
                    }
                  />
                  <div
                    className={
                      state.confirmPasswordFocus &&
                      !state.validConfirmPassword &&
                      state.confirmPassword
                        ? ""
                        : "hidden"
                    }
                  >
                    <div className="text-xs font-normal text-cldanger">
                      Must match the first password input field.
                    </div>
                  </div>
                </div>
              </div>
              <button className="w-full bg-primary4 text-white font-semibold py-2 text-center border border-primary4 hover:bg-white hover:text-primary4 rounded-md transition-all duration-300">
                Submit
              </button>
            </div>
            <div className="mt-2">
              <span className="text-sm">Already have an account?</span>
              <span className="text-primary4 font-semibold text-sm underline ml-2">
                <Link to="/login">Sign in</Link>
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
