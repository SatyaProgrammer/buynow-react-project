import React from "react";
import { useReducer, useEffect, useRef } from "react";
import { IconPlus, IconBin, IconAlert, IconCheck } from "./Shop/utils/Icons";
import axios from "axios";
import Cookies from "universal-cookie";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  changeReducer,
  INITIAL_STATE,
  ACTION_TYPES,
} from "../reducers/change_password_reducer";
import { Link } from "react-router-dom";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const ChangePassword = () => {
  const [state, dispatch] = useReducer(changeReducer, INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);
  const cookies = new Cookies();
  const token = cookies.get("jwt_authorization");
  const navigate = useNavigate();

  useEffect(() => {
    dispatch({
      type: ACTION_TYPES.SET_VALID_OLD_PASSWORD,
      payload: PASSWORD_REGEX.test(state.oldPassword),
    });
    dispatch({
      type: ACTION_TYPES.SET_VALID_PASSWORD,
      payload: PASSWORD_REGEX.test(state.password),
    });
    dispatch({
      type: ACTION_TYPES.SET_VALID_CONFIRM_PASSWORD,
      payload: state.password === state.confirmPassword,
    });
  }, [state.password, state.oldPassword, state.confirmPassword]);

  useEffect(() => {
    dispatch({ type: ACTION_TYPES.SET_ERROR, payload: "" });
  }, [state.password, state.oldPassword, state.confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // if button enabled with JS hack
    const v1 = PASSWORD_REGEX.test(state.oldPassword);
    const v2 = PASSWORD_REGEX.test(state.password);
    if (!v1 || !v2) {
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: "Invalid Entry",
      });
      return;
    }
    console.log(state.oldPassword);
    console.log(state.password);
    let data = JSON.stringify({
      old_password: state.oldPassword,
      new_password: state.password,
    });
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/change_password`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${token}`,
          },
        }
      );
      console.log(response);
      dispatch({ type: ACTION_TYPES.SET_SUCCESS, payload: true });
      dispatch({ type: ACTION_TYPES.SET_PASSWORD, payload: "" });
      dispatch({ type: ACTION_TYPES.SET_OLD_PASSWORD, payload: "" });
      dispatch({ type: ACTION_TYPES.SET_CONFIRM_PASSWORD, payload: "" });
      dispatch({
        type: ACTION_TYPES.SET_SUCCESS,
        payload: "Change password successful",
      });
      setSubmitting(false);
    } catch (err) {
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
      <div className="p-4 sm:ml-16 bg-gray-100 flex flex-col gap-4 transition-full duration-300">
        <p className="text-cldark text-4xl font-bold my-4 text-medium">
          Change password
        </p>
        <div className=" bg-white shadow-lg flex flex-col gap-6 rounded-md pt-4">
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
                      htmlFor="oldPassword"
                      className={
                        !state.validOldPassword &&
                        state.oldPassword &&
                        !state.oldPasswordFocus
                          ? "text-cldanger font-semibold"
                          : "text-cldark font-semibold"
                      }
                    >
                      <div className="flex items-center gap-1">
                        {!state.validOldPassword &&
                        state.oldPassword &&
                        !state.oldPasswordFocus ? (
                          <div className="h-4 w-4">
                            <IconAlert fill="#bb2525" />
                          </div>
                        ) : (
                          ""
                        )}
                        <div>Old password</div>
                      </div>
                    </label>
                    <input
                      type="password"
                      placeholder="Old password"
                      name="oldPassword"
                      id="oldPassword"
                      required
                      autoComplete="off"
                      value={state.oldPassword}
                      onChange={(e) =>
                        dispatch({
                          type: ACTION_TYPES.SET_OLD_PASSWORD,
                          payload: e.target.value,
                        })
                      }
                      onFocus={() => {
                        dispatch({
                          type: ACTION_TYPES.SET_OLD_PASSWORD_FOCUS,
                          payload: true,
                        });
                        dispatch({
                          type: ACTION_TYPES.SET_SUCCESS,
                          payload: "",
                        });
                      }}
                      onBlur={() =>
                        dispatch({
                          type: ACTION_TYPES.SET_OLD_PASSWORD_FOCUS,
                          payload: false,
                        })
                      }
                      className={
                        !state.validOldPassword &&
                        state.oldPassword &&
                        !state.oldPasswordFocus
                          ? "border border-cldanger w-full p-3 rounded-lg outline-cldanger caret-cldark text-cldanger focus:outline focus:outline-1 focus:border-none"
                          : "border border-gray-300 w-full p-3 rounded-lg outline-cldark caret-cldark text-cldark focus:outline focus:outline-1 focus-border-none"
                      }
                    />
                    <div
                      className={
                        state.oldPasswordFocus &&
                        !state.validOldPassword &&
                        state.oldPassword
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
                        <div>Confrim new password</div>
                      </div>
                    </label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
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
                        Must match the new password input field.
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
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
