import React, { useEffect, useReducer, useRef, useState } from "react";
import {
  signupReducer,
  INITIAL_STATE,
  ACTION_TYPES,
} from "../reducers/signup_reducer";
import axios from "axios";
import { API_CALL } from "./Shop/utils/Constant";
import { Link } from "react-router-dom";
import { IconAlert, IconCheck } from "./Shop/utils/Icons";
import Cookies from "universal-cookie";

const USERNAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const Signup = (props) => {
  const [state, dispatch] = useReducer(signupReducer, INITIAL_STATE);
  const usernameRef = useRef();
  const emailRed = useRef();
  const [windowSize, setWindowSize] = useState(window.innerHeight);
  const [isFull, setIsFull] = useState(true);
  const [mainHeight, setMainHeight] = useState();
  const mainRef = useRef();
  const [nextPage, setNextPage] = useState(false);
  const [profile, setProfile] = useState();
  const [submitting, setSubmitting] = useState(false);
  const cookies = new Cookies();

  useEffect(() => {
    document.title = props.title;
    usernameRef.current.focus();
    setMainHeight(mainRef.current.clientHeight);
    if (windowSize < 587) {
      setIsFull(false);
    } else {
      setIsFull(true);
    }
    window.addEventListener("resize", handleResize, false);
  }, []);

  useEffect(() => {
    setMainHeight(mainRef.current.clientHeight);
  });

  const handleResize = () => {
    setWindowSize(window.innerHeight);
  };

  React.useEffect(() => {
    if (mainHeight) {
      if (windowSize > mainHeight + 20) {
        setIsFull(true);
      } else {
        setIsFull(false);
      }
    }
  }, [windowSize]);

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
    setSubmitting(true);
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
        `${process.env.REACT_APP_BACKEND_URL}/auth/register`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      let pUrl = "";
      try {
        const preset_key = "c003351q";
        const cloud_name = "dlplvjf9l";
        const token = cookies.get("jwt_authorization");

        if (profile) {
          const file = profile;
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", preset_key);
          await axios
            .post(
              `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
              formData
            )
            .then((res) => {
              console.log("resdataurl", res.data.secure_url);
              pUrl = res.data.secure_url;
            });
        } else {
          pUrl =
            "https://res.cloudinary.com/dlplvjf9l/image/upload/v1687078004/lwum3hs5emhzjm9rrfha.jpg";
        }

        try {
          console.log("TOKEN: ", response.data.token);
          let pData = JSON.stringify({
            theme: "light",
            image: pUrl,
            phone: null,
            contactInfo: {},
          });
          console.log("Data: ", pData);
          await axios.put(
            `${process.env.REACT_APP_BACKEND_URL}/customization`,
            pData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${response.data.token}`,
              },
            }
          );
        } catch (e) {
          console.log(e);
        }
      } catch (error) {
        console.log(error);
        dispatch({
          type: ACTION_TYPES.SET_ERROR,
          payload: "Image upload fail",
        });
      }

      console.log(response);
      setProfile("");
      dispatch({ type: ACTION_TYPES.SET_SUCCESS, payload: true });
      dispatch({ type: ACTION_TYPES.SET_USERNAME, payload: "" });
      dispatch({ type: ACTION_TYPES.SET_PASSWORD, payload: "" });
      dispatch({ type: ACTION_TYPES.SET_EMAIL, payload: "" });
      dispatch({ type: ACTION_TYPES.SET_CONFIRM_PASSWORD, payload: "" });
      setNextPage(!nextPage);
      setIsFull(!isFull);
      window.scrollTo(0, 0);
      dispatch({
        type: ACTION_TYPES.SET_SUCCESS,
        payload: "Signup successful",
      });
      setSubmitting(false);
    } catch (err) {
      setNextPage(!nextPage);
      setIsFull(!isFull);
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: err?.response.data.error,
      });
      window.scrollTo(0, 0);
      setSubmitting(false);
    }
  };

  const handleNextPage = (e) => {
    e.preventDefault();
    if (
      state.validUsername &&
      state.validEmail &&
      state.validPassword &&
      state.validConfirmPassword
    ) {
      setNextPage(!nextPage);
      setIsFull(!isFull);
    } else {
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: "Please fill in correct information",
      });
      window.scrollTo(0, 0);
    }
  };

  return (
    <div
      className={
        isFull
          ? "bg-gray-100 h-screen grid place-items-center"
          : "bg-gray-100 grid place-items-center p-8"
      }
    >
      <div className={nextPage ? "w-96 h-96 relative" : "w-fit h-fit relative"}>
        <div
          ref={mainRef}
          className={
            nextPage
              ? "hidden"
              : " w-80 sm:w-96 bg-white shadow-lg flex flex-col gap-6 rounded-md"
          }
        >
          <div className="text-3xl font-semibold text-primary4 underline px-8 mt-6">
            Sign up
          </div>
          <form>
            <div className="px-8 pb-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  {state.success ? (
                    <div className="p-3 px-2 grid gap-1 grid-cols-12 bg-green-50 text-clgreen font-semibold rounded-lg border-2 border-green-200">
                      <div className=" col-span-1 grid justify-center pt-1">
                        <div className="w-4 h-4">
                          <IconCheck fill="#25bb32" />
                        </div>
                      </div>
                      <div className="col-span-11">
                        {state.success}, verify your account with gmail
                      </div>
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
                        !state.validUsername &&
                        state.username &&
                        !state.usernameFocus
                          ? "text-cldanger font-semibold"
                          : "text-cldark font-semibold"
                      }
                    >
                      <div className="flex items-center gap-1">
                        {!state.validUsername &&
                        state.username &&
                        !state.usernameFocus ? (
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
                      onFocus={() => {
                        dispatch({
                          type: ACTION_TYPES.SET_USERNAME_FOCUS,
                          payload: true,
                        });
                        dispatch({
                          type: ACTION_TYPES.SET_SUCCESS,
                          payload: "",
                        });
                      }}
                      onBlur={() =>
                        dispatch({
                          type: ACTION_TYPES.SET_USERNAME_FOCUS,
                          payload: false,
                        })
                      }
                      className={
                        !state.validUsername &&
                        state.username &&
                        !state.usernameFocus
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
                        !state.validEmail && state.email && !state.emailFocus
                          ? "text-cldanger font-semibold"
                          : "text-cldark font-semibold"
                      }
                    >
                      <div className="flex items-center gap-1">
                        {!state.validEmail &&
                        state.email &&
                        !state.emailFocus ? (
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
                      onFocus={() => {
                        dispatch({
                          type: ACTION_TYPES.SET_EMAIL_FOCUS,
                          payload: true,
                        });
                        dispatch({
                          type: ACTION_TYPES.SET_SUCCESS,
                          payload: "",
                        });
                      }}
                      onBlur={() =>
                        dispatch({
                          type: ACTION_TYPES.SET_EMAIL_FOCUS,
                          payload: false,
                        })
                      }
                      className={
                        !state.validEmail && state.email && !state.emailFocus
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
                        !state.validPassword &&
                        state.password &&
                        !state.passwordFocus
                          ? "text-cldanger font-semibold"
                          : "text-cldark font-semibold"
                      }
                    >
                      <div className="flex items-center gap-1">
                        {!state.validPassword &&
                        state.password &&
                        !state.passwordFocus ? (
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
                      onFocus={() => {
                        dispatch({
                          type: ACTION_TYPES.SET_PASSWORD_FOCUS,
                          payload: true,
                        });
                        dispatch({
                          type: ACTION_TYPES.SET_SUCCESS,
                          payload: "",
                        });
                      }}
                      onBlur={() =>
                        dispatch({
                          type: ACTION_TYPES.SET_PASSWORD_FOCUS,
                          payload: false,
                        })
                      }
                      className={
                        !state.validPassword &&
                        state.password &&
                        !state.passwordFocus
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
                        Must include uppercase and lowercase letters, a number
                        and a special character.
                        <br />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="confirmPassword"
                      className={
                        !state.validConfirmPassword &&
                        state.confirmPassword &&
                        !state.confirmPasswordFocus
                          ? "text-cldanger font-semibold"
                          : "text-cldark font-semibold"
                      }
                    >
                      <div className="flex items-center gap-1">
                        {!state.validConfirmPassword &&
                        state.confirmPassword &&
                        !state.confirmPasswordFocus ? (
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
                      onFocus={() => {
                        dispatch({
                          type: ACTION_TYPES.SET_CONFIRM_PASSWORD_FOCUS,
                          payload: true,
                        });
                        dispatch({
                          type: ACTION_TYPES.SET_SUCCESS,
                          payload: "",
                        });
                      }}
                      onBlur={() =>
                        dispatch({
                          type: ACTION_TYPES.SET_CONFIRM_PASSWORD_FOCUS,
                          payload: false,
                        })
                      }
                      className={
                        !state.validConfirmPassword &&
                        state.confirmPassword &&
                        !state.confirmPasswordFocus
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
                <button
                  // onClick={handleSubmit}
                  onClick={(e) => handleNextPage(e)}
                  className="w-full bg-primary4 text-white font-semibold py-2 text-center border border-primary4 hover:bg-white hover:text-primary4 rounded-md transition-all duration-300"
                >
                  Next
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
        <div
          className={
            nextPage
              ? "w-80 sm:w-96 bg-white shadow-lg flex flex-col gap-6 rounded-md h-96 absolute  top-0 translate-x-none opacity-100 transition-all duration-200"
              : "w-80 sm:w-96 bg-white shadow-lg flex flex-col gap-6 rounded-md h-96 absolute  top-0 translate-x-48 opacity-0 transition-all duration-200"
          }
        >
          <div className="p-4 flex flex-col gap-4">
            <div onClick={handleNextPage} className="btn w-fit">
              Back
            </div>
            <div className="flex flex-col justify-center items-center">
              <div className="w-36 h-36 rounded-full bg-gray-200 border">
                {profile ? (
                  <img
                    className="w-full h-full rounded-full object-cover"
                    alt="preview image"
                    src={URL.createObjectURL(profile)}
                  />
                ) : (
                  <img
                    className="w-full h-full rounded-full object-cover"
                    src="assets/images/emptyProfile.jpg"
                    alt="Image"
                  />
                )}
              </div>
              <label
                htmlFor="profile"
                className="text-blue-500 text-sm underline cursor-pointer"
              >
                <input
                  id="profile"
                  type="file"
                  onChange={(event) => setProfile(event.target.files[0])}
                  className="hidden"
                />
                Add profile image
              </label>
            </div>
            {submitting ? (
              <div className="w-full bg-primary4 text-white font-semibold py-2 text-center border border-primary4 hover:bg-white hover:text-primary4 rounded-md transition-all duration-300">
                Submitting...
              </div>
            ) : (
              <button
                onClick={handleSubmit}
                // onClick={(e) => handleNextPage(e)}
                className="w-full bg-primary4 text-white font-semibold py-2 text-center border border-primary4 hover:bg-white hover:text-primary4 rounded-md transition-all duration-300"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
