import React from "react";
import { useReducer, useEffect, useRef } from "react";
import { IconPlus, IconBin, IconAlert, IconCheck } from "../utils/Icons";
import axios from "axios";
import Cookies from "universal-cookie";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import logo from "../../../assets/hero-bcg.jpeg";
import { useState } from "react";
import { profileReducer, INITIAL_STATE, ACTION_TYPES } from "./ProfileReducer";
import Swal from "sweetalert2";

const ProfilePage = () => {
  const [state, dispatch] = useReducer(profileReducer, INITIAL_STATE);
  const [profile, setProfile] = useState();
  const [submitting, setSubmitting] = useState(false);
  const cookies = new Cookies();
  const token = cookies.get("jwt_authorization");
  const navigate = useNavigate();

  const handleFacebook = (e) => {
    let data = e.target.value;
    dispatch({ type: ACTION_TYPES.FACEBOOK, payload: data });
  };
  const handleInstagram = (e) => {
    let data = e.target.value;
    dispatch({ type: ACTION_TYPES.INSTAGRAM, payload: data });
  };
  const handleTiktok = (e) => {
    let data = e.target.value;
    dispatch({ type: ACTION_TYPES.TIKTOK, payload: data });
  };
  const handleTelegram = (e) => {
    let data = e.target.value;
    dispatch({ type: ACTION_TYPES.TELEGRAM, payload: data });
  };

  const [isVerified, setIsVerified] = useState();
  const handleFetch = async () => {
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
      setIsVerified(response.data.customization.verified);
      dispatch({
        type: ACTION_TYPES.USERNAME,
        payload: response.data.customization.username,
      });
      console.log(response.data.customization.image);
      setProfile(response.data.customization.image);
      dispatch({
        type: ACTION_TYPES.SET_PHONE,
        payload: response.data.customization.phone,
      });
      dispatch({
        type: ACTION_TYPES.FACEBOOK,
        payload: response.data.customization.contactInfo.Facebook,
      });
      dispatch({
        type: ACTION_TYPES.INSTAGRAM,
        payload: response.data.customization.contactInfo.Instagram,
      });
      dispatch({
        type: ACTION_TYPES.TIKTOK,
        payload: response.data.customization.contactInfo.Tiktok,
      });
      dispatch({
        type: ACTION_TYPES.TELEGRAM,
        payload: response.data.customization.contactInfo.Telegram,
      });
      dispatch({
        type: ACTION_TYPES.IMAGE,
        payload: response.data.customization.image,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      handleFetch();
    }, 500);
  }, [state.success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let pUrl = "";
      try {
        const preset_key = "c003351q";
        const cloud_name = "dlplvjf9l";
        const token = cookies.get("jwt_authorization");
        console.log(profile);
        if (profile) {
          let blob = await fetch(profile).then((r) => r.blob());
          const file = blob;
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
            phone: state.phone,
            contactInfo: {
              Facebook: state.customization[0].facebook,
              Instagram: state.customization[0].instagram,
              Tiktok: state.customization[0].tiktok,
              Telegram: state.customization[0].telegram,
            },
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
      dispatch({ type: ACTION_TYPES.SET_SUCCESS, payload: true });
      dispatch({ type: ACTION_TYPES.SET_USERNAME, payload: "" });
      dispatch({
        type: ACTION_TYPES.SET_SUCCESS,
        payload: "Update profile successful",
      });
      setSubmitting(false);
      navigate("/");
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: err?.response.data.error,
      });
      setSubmitting(false);
    }
  };

  const [verifyLoading, setVerifyLoading] = useState(false);
  const handleVerify = async () => {
    setVerifyLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/auth/resend_verify`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${token}`,
          },
        }
      );
      if (response) {
        setVerifyLoading(false);
        Swal.fire({
          title: "Please check your email",
          icon: "success",
          confirmButtonColor: "#936a53",
          confirmButtonText: "Close",
        });
      }
    } catch (error) {
      setVerifyLoading(false);
      console.log(error);
      if (error.response.data.error_code == "BX0001") {
        navigate("/login");
      }
    }
  };

  return (
    <>
      <div className="p-4 sm:ml-16 bg-gray-100 flex flex-col gap-4 transition-full duration-300">
        <div className=" bg-white shadow-lg flex flex-col gap-6 rounded-md">
          <form>
            <div className="px-8 pb-8 mt-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  {/* image */}
                  <div className="flex flex-col justify-center items-center">
                    <h2>{state.user}</h2>
                    {!isVerified ? (
                      <div className="flex gap-1 items-center mb-4 text-yellow-700 group relative hover:cursor-default">
                        <div className="w-5 h-5">
                          <IconAlert fill="#b45309" />
                        </div>
                        <div className="font-semibold">
                          Account is not verfied
                        </div>
                        <div className="hidden group-hover:block absolute left-full pl-2 w-64">
                          <div className="shadow-md p-4 rounded-md">
                            Check your email to verify account.
                            {verifyLoading ? (
                              <span
                                className="ml-2 font-semibold underline"
                              >
                                Sending...
                              </span>
                            ) : (
                              <span
                                onClick={() => handleVerify()}
                                className="ml-2 font-semibold underline hover:cursor-pointer"
                              >
                                Resend verify email
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="w-36 h-36 rounded-full bg-gray-200 border">
                      {console.log(profile)}
                      <img
                        className="w-full h-full rounded-full object-cover"
                        alt=""
                        src={profile}
                      />
                    </div>
                    <label htmlFor="profile" className="btn mt-4">
                      <input
                        id="profile"
                        type="file"
                        onChange={(event) =>
                          setProfile(URL.createObjectURL(event.target.files[0]))
                        }
                        className="hidden"
                      />
                      Update image
                    </label>
                  </div>
                  {/* phone */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="phone"
                      className="text-cldark font-semibold"
                    >
                      <div className="flex items-center gap-1">
                        <div>Phone number</div>
                      </div>
                    </label>
                    <input
                      type="number"
                      placeholder="Phone number"
                      name="phone"
                      id="phone"
                      value={state.phone}
                      required
                      autoComplete="off"
                      onChange={(e) =>
                        dispatch({
                          type: ACTION_TYPES.SET_PHONE,
                          payload: e.target.value,
                        })
                      }
                      onFocus={() => {
                        dispatch({
                          type: ACTION_TYPES.SET_PHONE_FOCUS,
                          payload: true,
                        });
                        dispatch({
                          type: ACTION_TYPES.SET_SUCCESS,
                          payload: "",
                        });
                      }}
                      onBlur={() =>
                        dispatch({
                          type: ACTION_TYPES.SET_PHONE_FOCUS,
                          payload: false,
                        })
                      }
                      className="border border-gray-300 w-full p-3 rounded-lg outline-cldark caret-cldark text-cldark focus:outline focus:outline-1 focus-border-none"
                    />
                  </div>
                  {/* contact info */}
                  {console.log(state.customization)}
                  <div className="flex flex-col gap-2">
                    <div className="text-xl font-semibold text-cldark">
                      Contact Info
                    </div>
                    <div className="grid grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                      <div className="col-span-2 md:col-span-1">
                        <div className="flex gap-2 items-center">
                          <div className="flex items-center  border rounded-lg  border-gray-300 focus-within:outline focus-within:outline-1 w-full">
                            <div className="w-full p-3 rounded-lg  text-cldark text-center">
                              Facebook
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 col-span-4 md:col-span-5 lg:col-span-7 xl:col-span-9">
                        <div>
                          <div className="flex gap-2 items-center">
                            <div className="flex items-center border rounded-lg w-full  border-gray-300 focus-within:outline focus-within:outline-1">
                              <input
                                type="text"
                                placeholder="Facebook"
                                onChange={(e) => handleFacebook(e)}
                                value={state.customization[0].facebook}
                                name="subCustom"
                                className="focus:outline-none w-full p-3 rounded-lg text-cldark"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2 md:col-span-1">
                        <div className="flex gap-2 items-center">
                          <div className="flex items-center  border rounded-lg  border-gray-300 focus-within:outline focus-within:outline-1 w-full">
                            <div className="w-full p-3 rounded-lg  text-cldark text-center">
                              Instagram
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 col-span-4 md:col-span-5 lg:col-span-7 xl:col-span-9">
                        <div>
                          <div className="flex gap-2 items-center">
                            <div className="flex items-center border rounded-lg w-full  border-gray-300 focus-within:outline focus-within:outline-1">
                              <input
                                type="text"
                                placeholder="Instagram"
                                onChange={(e) => handleInstagram(e)}
                                value={state.customization[0].instagram}
                                name="subCustom"
                                className="focus:outline-none w-full p-3 rounded-lg text-cldark"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                      <div className="col-span-2 md:col-span-1">
                        <div className="flex gap-2 items-center">
                          <div className="flex items-center  border rounded-lg  border-gray-300 focus-within:outline focus-within:outline-1 w-full">
                            <div className="w-full p-3 rounded-lg  text-cldark text-center">
                              Tiktok
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 col-span-4 md:col-span-5 lg:col-span-7 xl:col-span-9">
                        <div>
                          <div className="flex gap-2 items-center">
                            <div className="flex items-center border rounded-lg w-full  border-gray-300 focus-within:outline focus-within:outline-1">
                              <input
                                type="text"
                                placeholder="Tiktok"
                                onChange={(e) => handleTiktok(e)}
                                value={state.customization[0].tiktok}
                                name="subCustom"
                                className="focus:outline-none w-full p-3 rounded-lg text-cldark"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2 md:col-span-1">
                        <div className="flex gap-2 items-center">
                          <div className="flex items-center  border rounded-lg  border-gray-300 focus-within:outline focus-within:outline-1 w-full">
                            <div className="w-full p-3 rounded-lg  text-cldark text-center">
                              Telegram
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 col-span-4 md:col-span-5 lg:col-span-7 xl:col-span-9">
                        <div>
                          <div className="flex gap-2 items-center">
                            <div className="flex items-center border rounded-lg w-full  border-gray-300 focus-within:outline focus-within:outline-1">
                              <input
                                type="text"
                                placeholder="Telegram"
                                onChange={(e) => handleTelegram(e)}
                                value={state.customization[0].telegram}
                                name="subCustom"
                                className="focus:outline-none w-full p-3 rounded-lg text-cldark"
                              />
                            </div>
                          </div>
                        </div>
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
                      Update Profile
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
