import React from "react";
import { useReducer, useEffect, useRef } from "react";
import {
  addProductReducer,
  INITIAL_STATE,
  ACTION_TYPES,
} from "./ProfileReducer";
import { IconPlus, IconBin, IconAlert, IconCheck } from "../utils/Icons";
import axios from "axios";
import Cookies from "universal-cookie";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import logo from "../../../assets/hero-bcg.jpeg";

const ProfilePage = () => {
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

  const [state, dispatch] = useReducer(addProductReducer, INITIAL_STATE);
  const nameRef = useRef();
  const imageRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();

  const handleAddImage = () => {
    let inputData = state.image;
    inputData.push("");
    dispatch({ type: ACTION_TYPES.SET_IMAGE, payload: inputData });
  };

  const handleChangeImage = (file, i) => {
    let inputData = state.image;
    inputData[i] = file;
    dispatch({ type: ACTION_TYPES.SET_IMAGE, payload: inputData });
  };

  const handleRemoveImage = (i) => {
    let inputData = state.image;
    inputData.splice(i, 1);
    dispatch({ type: ACTION_TYPES.SET_IMAGE, payload: inputData });
  };

  useEffect(() => {
    if (state.image.length <= 0) {
      dispatch({ type: ACTION_TYPES.ADD_IMAGE, payload: "" });
    }
    dispatch({ type: ACTION_TYPES.SET_NAME, payload: "" });
    dispatch({ type: ACTION_TYPES.SET_DESCRIPTION, payload: "" });
    dispatch({ type: ACTION_TYPES.SET_AVAILABILITY, payload: 0 });
    dispatch({ type: ACTION_TYPES.SET_DELIVERYOPTION, payload: "" });
    dispatch({ type: ACTION_TYPES.SET_IMAGE, payload: [""] });
    dispatch({ type: ACTION_TYPES.SET_IMAGE_URL, payload: { images: [] } });
  }, []);

  useEffect(() => {
    dispatch({ type: ACTION_TYPES.SET_ERROR, payload: "" });
  }, [
    state.name,
    state.description,
    state.availability,
    state.deliveryOption,
    state.image,
    state.image[0],
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: ACTION_TYPES.SET_DURING_SUBMIT, payload: true });
    if (state.image.length <= 1 && !state.image[0]) {
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: "A minimum of one image is required.",
      });
      dispatch({ type: ACTION_TYPES.SET_DURING_SUBMIT, payload: false });
      window.scrollTo(0, 0);
      return;
    }

    const preset_key = "c003351q";
    const cloud_name = "dlplvjf9l";
    const token = cookies.get("jwt_authorization");

    if (token) {
      for (let i = 0; i < state.image.length; i++) {
        if (state.image[i] != "") {
          const file = state.image[i];
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", preset_key);
          await axios
            .post(
              `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
              formData
            )
            .then((res) => {
              let inputData = state.imageUrl;
              inputData.images.push(res.data.secure_url);
              dispatch({
                type: ACTION_TYPES.SET_IMAGE_URL,
                payload: inputData,
              });
              dispatch({
                type: ACTION_TYPES.SET_IMAGE_URL,
                payload: [""],
              });
            })
            .catch((err) =>
              dispatch({
                type: ACTION_TYPES.SET_ERROR,
                payload: "Image upload fail",
              })
            );
        }
      }
    }

    let data = JSON.stringify({
      name: state.name,
      images: state.imageUrl,
      description: state.description,
      availability: state.availability,
      deliveryOption: state.deliveryOption,
    });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/products/add`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${token}`,
          },
        }
      );
      dispatch({ type: ACTION_TYPES.SET_SUCCESS, payload: true });
      dispatch({ type: ACTION_TYPES.SET_NAME, payload: "" });
      dispatch({ type: ACTION_TYPES.SET_DESCRIPTION, payload: "" });
      dispatch({ type: ACTION_TYPES.SET_AVAILABILITY, payload: 0 });
      dispatch({ type: ACTION_TYPES.SET_DELIVERYOPTION, payload: "" });
      dispatch({ type: ACTION_TYPES.SET_IMAGE, payload: [""] });
      dispatch({ type: ACTION_TYPES.SET_IMAGE_URL, payload: { images: [] } });
      dispatch({
        type: ACTION_TYPES.SET_SUCCESS,
        payload: "Product listed for sale",
      });
      dispatch({ type: ACTION_TYPES.SET_DURING_SUBMIT, payload: false });
      window.scrollTo(0, 0);
    } catch (err) {
      if (err?.response.data.error_code == "BX0001") {
        cookies.remove("jwt_authorization");
        navigate("/shop/add_product", { replace: true });
      }
      dispatch({ type: ACTION_TYPES.SET_IMAGE_URL, payload: { images: [] } });
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: err?.response.data.error,
      });
      dispatch({ type: ACTION_TYPES.SET_DURING_SUBMIT, payload: false });
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      {/* ml-16 md:ml-64 */}
      <div className="p-4 sm:ml-16 bg-gray-100 flex flex-col gap-4 transition-full duration-300">
        <p className="text-cldark text-4xl font-bold my-4 text-medium flex flex-col gap-4 items-center justify-center">
          <img src={logo} alt="" className="w-52 h-52 rounded-full" />
          <p>Name</p>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            {state.success ? (
              <div className="p-4 flex gap-1 items-center bg-green-50 text-clgreen font-semibold rounded-md shadow-md border-2 border-green-200">
                <div className="w-4 h-4">
                  <IconCheck fill="#25bb32" />
                </div>
                <div className="font-bold">Success:</div>
                <div>{state.success}</div>
              </div>
            ) : (
              ""
            )}
            {state.errMessage ? (
              <div className="p-4 flex gap-1 items-center bg-red-50 text-cldanger font-semibold rounded-md shadow-md border-2 border-red-200">
                <div className="w-4 h-4">
                  <IconAlert fill="#bb2525" />
                </div>
                <div className="font-bold">Error:</div>
                <div>{state.errMessage}</div>
              </div>
            ) : (
              ""
            )}
            <div className="bg-white p-4 shadow-lg rounded-md flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="text-xl font-semibold text-cldark">
                  Product Name
                </div>
                <input
                  type="text"
                  placeholder="Product name"
                  name="productName"
                  required
                  ref={nameRef}
                  onFocus={() =>
                    dispatch({ type: ACTION_TYPES.SET_SUCCESS, payload: "" })
                  }
                  onChange={(e) =>
                    dispatch({
                      type: ACTION_TYPES.SET_NAME,
                      payload: e.target.value,
                    })
                  }
                  value={state.name}
                  className="border border-gray-300 w-full p-3 rounded-lg text-cldark focus:outline focus:outline-1"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-xl font-semibold text-cldark">
                  Product Description
                </div>
                <textarea
                  type="text"
                  placeholder="Product description"
                  required
                  onFocus={() =>
                    dispatch({ type: ACTION_TYPES.SET_SUCCESS, payload: "" })
                  }
                  onChange={(e) =>
                    dispatch({
                      type: ACTION_TYPES.SET_DESCRIPTION,
                      payload: e.target.value,
                    })
                  }
                  name="description"
                  value={state.description}
                  rows="5"
                  className="w-full border border-gray-300 rounded-lg p-3 text-cldark focus:outline focus:outline-1"
                />
              </div>
            </div>

            <div className="bg-white p-4 shadow-lg rounded-md flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="text-xl font-semibold text-cldark">
                  Delivery Option
                </div>
                <input
                  type="text"
                  placeholder="Delivery option"
                  required
                  onFocus={() =>
                    dispatch({ type: ACTION_TYPES.SET_SUCCESS, payload: "" })
                  }
                  onChange={(e) =>
                    dispatch({
                      type: ACTION_TYPES.SET_DELIVERYOPTION,
                      payload: e.target.value,
                    })
                  }
                  name="brand"
                  value={state.deliveryOption}
                  className="border border-gray-300 w-full p-3 rounded-lg text-cldark focus:outline focus:outline-1"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-xl font-semibold text-cldark">Image</div>
                {state.image.map((image, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {state.image[idx] ? (
                      <div className="w-16 h-10">
                        <img
                          alt="not found"
                          src={URL.createObjectURL(state.image[idx])}
                          className="w-full h-full rounded-md object-cover shadow-md"
                        />
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="flex w-full border rounded-md items-center">
                      <label
                        htmlFor={idx}
                        className="w-full cursor-pointer p-3 hover:bg-gray-200"
                      >
                        <input
                          type="file"
                          accept="image/png, image/jpg, image/gif, image/jpeg"
                          name="image"
                          ref={imageRef}
                          id={idx}
                          onFocus={() =>
                            dispatch({
                              type: ACTION_TYPES.SET_SUCCESS,
                              payload: "",
                            })
                          }
                          onChange={(e) => {
                            handleChangeImage(e.target.files[0], idx);
                            e.target.value = null;
                          }}
                          className="hidden"
                        />
                        Select image
                      </label>
                      {state.image.length < 5 ? (
                        <div
                          onClick={() => handleAddImage()}
                          className="p-2 hover:scale-110 transition-full duration-300"
                        >
                          <div className="w-4 h-4 cursor-pointer">
                            <IconPlus fill="#222" />
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    {state.image.length > 1 ? (
                      <div
                        onClick={() => handleRemoveImage(idx)}
                        className="w-5 h-5 hover:scale-110 duration-300 transition-all cursor-pointer"
                      >
                        <IconBin fill="#222" />
                      </div>
                    ) : state.image[0] ? (
                      <div
                        onClick={() => {
                          let inputData = state.image;
                          inputData = [""];
                          dispatch({
                            type: ACTION_TYPES.SET_IMAGE,
                            payload: inputData,
                          });
                        }}
                        className="w-5 h-5 hover:scale-110 duration-300 transition-all cursor-pointer"
                      >
                        <IconBin fill="#222" />
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                ))}
              </div>
              {state.duringSubmit ? (
                <div className="btn text-center">Submitting...</div>
              ) : (
                <button className="btn outline-none">Update Profile</button>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProfilePage;
