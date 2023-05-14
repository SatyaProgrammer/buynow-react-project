import React, { useEffect, useReducer, useRef } from "react";
import {
  signupReducer,
  INITIAL_STATE,
  ACTION_TYPES,
} from "../reducers/signup_reducer";
import axios from "axios";
import { API_CALL } from "./Shop/utils/Constant";

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
    dispatch({ type: ACTION_TYPES.SET_ERROR_MSG, payload: "" });
  }, [state.username, state.email, state.password, state.confirmPassword]);

  const handleSubmit = async (e) => {
    console.log("work");
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = USERNAME_REGEX.test(state.username);
    const v2 = PASSWORD_REGEX.test(state.password);
    const v3 = EMAIL_REGEX.test(state.email);
    let data = JSON.stringify({
      username: state.username,
      password: state.password,
      email: state.email,
    });
    if (!v1 || !v2 || !v3) {
      dispatch({ type: ACTION_TYPES.SET_ERROR_MSG, payload: "Invalid Entry" });
      return;
    }
    try {
      const response = await axios.post(
        "http://api.localhost/auth/register",
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response?.data);
      console.log(response?.accessToken);
      console.log(JSON.stringify(response));
      dispatch({ type: ACTION_TYPES.SET_SUCCESS, payload: true });
      //clear state and controlled inputs
      //need value attrib on inputs for this
      dispatch({ type: ACTION_TYPES.SET_USERNAME, payload: "" });
      dispatch({ type: ACTION_TYPES.SET_PASSWORD, payload: "" });
      dispatch({ type: ACTION_TYPES.SET_EMAIL, payload: "" });
      dispatch({ type: ACTION_TYPES.SET_CONFIRM_PASSWORD, payload: "" });
    } catch (err) {
      if (!err?.response) {
        dispatch({
          type: ACTION_TYPES.SET_ERROR_MSG,
          payload: "No Server Response",
        });
      } else if (err.response?.status === 409) {
        dispatch({
          type: ACTION_TYPES.SET_ERROR_MSG,
          payload: "Username Taken",
        });
      } else {
        dispatch({
          type: ACTION_TYPES.SET_ERROR_MSG,
          payload: "Regitration Failed",
        });
      }
      // errRef.current.focus();
    }
  };

  return (
    <div className="h-screen bg-white grid place-items-center">
      <div className="w-80 bg-primary4 text-white shadow-lg flex flex-col gap-4">
        <div className="text-2xl font-semibold px-8 border-l-4 border-gray-100 mt-8">
          Sign up
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6 px-8 pb-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={state.username}
                  required
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
                  className="border-b border-gray-300 w-full py-2 placeholder-white bg-primary4 outline-none text-white caret-white focus:outline focus:outline-1"
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
                  <div className="text-xs font-normal">
                    4 to 24 characters.
                    <br />
                    Must begin with a letter.
                    <br />
                    Letters, numbers, underscores, hyphens allowed.
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Email"
                  name="email"
                  required
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
                  className="border-b border-gray-300 w-full py-2 placeholder-white bg-primary4 outline-none text-white caret-white focus:outline focus:outline-1"
                />
                <div
                  className={
                    state.emailFocus && !state.validEmail && state.email
                      ? ""
                      : "hidden"
                  }
                >
                  <div className="text-xs font-normal">
                    Must input valid email for this field
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  required
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
                  className="border-b border-gray-300 w-full py-2 placeholder-white bg-primary4 outline-none text-white caret-white focus:outline focus:outline-1"
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
                  <div className="text-xs font-normal">
                    8 to 24 characters.
                    <br />
                    Must include uppercase and lowercase letters, a number and a
                    special character.
                    <br />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <input
                  type="password"
                  placeholder="Confirm password"
                  name="confirmPassword"
                  required
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
                  className="border-b border-gray-300 w-full py-2 placeholder-white bg-primary4 outline-none text-white caret-white focus:outline focus:outline-1"
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
                  <div className="text-xs font-normal">
                    Must match the first password input field.
                  </div>
                </div>
              </div>
            </div>
            <button className="w-full bg-white text-primary4 font-semibold py-2 text-center border-2 border-white hover:bg-primary4 hover:text-white transition-all duration-300">
              NEXT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
