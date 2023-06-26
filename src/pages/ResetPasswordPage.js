import React, { useEffect, useReducer, useRef, useState } from "react";
import {
  resetReducer,
  INITIAL_STATE,
  ACTION_TYPES,
} from "../reducers/reset_reducer";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { IconAlert, IconCheck } from "./Shop/utils/Icons";
import { Link } from "react-router-dom";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const ResetPassword = (props) => {
  const [state, dispatch] = useReducer(resetReducer, INITIAL_STATE);
  const [windowSize, setWindowSize] = useState(window.innerHeight);
  const [isFull, setIsFull] = useState(true);
  const [mainHeight, setMainHeight] = useState();
  const mainRef = useRef();
  const [nextPage, setNextPage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    document.title = props.title;
    if (windowSize < 587) {
      setIsFull(false);
    } else {
      setIsFull(true);
    }
    window.addEventListener("resize", handleResize, false);
  }, []);

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
  }, [state.password, state.confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // if button enabled with JS hack
    const v2 = PASSWORD_REGEX.test(state.password);
    if (!v2) {
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: "Invalid Entry",
      });
      return;
    }
    let data = JSON.stringify({
      password: state.password,
      token: token,
    });
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/forgot`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response);
      dispatch({ type: ACTION_TYPES.SET_SUCCESS, payload: true });
      dispatch({ type: ACTION_TYPES.SET_PASSWORD, payload: "" });
      dispatch({ type: ACTION_TYPES.SET_CONFIRM_PASSWORD, payload: "" });
      setIsFull(!isFull);
      window.scrollTo(0, 0);
      dispatch({
        type: ACTION_TYPES.SET_SUCCESS,
        payload: "Change password successful",
      });
      setSubmitting(false);
    } catch (err) {
      setIsFull(!isFull);
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: err?.response.data.error,
      });
      window.scrollTo(0, 0);
      setSubmitting(false);
    }
  };

  return (
    <>
      <div
        // className={
        //   isFull
        //     ? "bg-gray-100 h-screen grid place-items-center"
        //     : "bg-gray-100 grid place-items-center p-8"
        // }
        className="min-h-screen max-h-full grid place-items-center bg-gray-100"
      >
        <div
          className={nextPage ? "w-96 h-full relative" : "w-fit h-fit relative"}
        >
          <div
            ref={mainRef}
            className={
              nextPage
                ? "hidden"
                : " w-80 sm:w-96 bg-white shadow-lg flex flex-col gap-6 rounded-md my-4"
            }
          >
            <div className="text-3xl font-semibold text-primary4 underline px-8 mt-6">
              New password
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
                        <div className="col-span-11">{state.success}</div>
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
                          <div>New password</div>
                        </div>
                      </label>
                      <input
                        type="password"
                        placeholder="New password"
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
      </div>
    </>
  );
};

export default ResetPassword;
