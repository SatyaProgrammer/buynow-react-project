import React from "react";
import { useReducer, useEffect, useRef } from "react";
import { IconPlus, IconBin, IconAlert, IconCheck } from "../utils/Icons";
import axios from "axios";
import Cookies from "universal-cookie";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import logo from "../../../assets/hero-bcg.jpeg";
import { useState } from "react";
import { profileReducer, INITIAL_STATE, ACTION_TYPES } from "./ProfileReducer";

const ProfilePage = () => {
  const [state, dispatch] = useReducer(profileReducer, INITIAL_STATE);
  const [profile, setProfile] = useState();
  const [submitting, setSubmitting] = useState(false);
  const cookies = new Cookies();
  const token = cookies.get("jwt_authorization");

  const getProfile = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/customization`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${token}`,
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
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
          console.log("TOKEN: ", token);
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
                Authorization: `Basic ${token}`,
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
      setProfile("");
      dispatch({ type: ACTION_TYPES.SET_SUCCESS, payload: true });
      dispatch({ type: ACTION_TYPES.SET_USERNAME, payload: "" });
      dispatch({
        type: ACTION_TYPES.SET_SUCCESS,
        payload: "Signup successful",
      });
      setSubmitting(false);
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: err?.response.data.error,
      });
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="p-4 sm:ml-16 bg-gray-100 flex flex-col gap-4 transition-full duration-300">
        <div className=" bg-white shadow-lg flex flex-col gap-6 rounded-md">
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

                  {submitting ? (
                    <div className="w-full bg-primary4 text-white font-semibold py-2 text-center border border-primary4 hover:bg-white hover:text-primary4 rounded-md transition-all duration-300 mt-2">
                      Submitting...
                    </div>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      // onClick={(e) => handleNextPage(e)}
                      className="w-full bg-primary4 text-white font-semibold py-2 text-center border border-primary4 hover:bg-white hover:text-primary4 rounded-md transition-all duration-300 mt-2"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
