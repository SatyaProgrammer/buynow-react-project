import React from "react";
import { useReducer, useEffect, useRef } from "react";
import {
  addProductReducer,
  INITIAL_STATE,
  ACTION_TYPES,
} from "./AddProductReducer";
import { IconPlus, IconBin, IconAlert, IconCheck } from "../utils/Icons";
import axios from "axios";
import Cookies from "universal-cookie";

const AddProduct = () => {
  const [state, dispatch] = useReducer(addProductReducer, INITIAL_STATE);
  const nameRef = useRef();
  const cookies = new Cookies();

  const handleAddCustom = () => {
    dispatch({
      type: ACTION_TYPES.ADD_CUSTOMIZATION,
      payload: { type: "", value: [""] },
    });
  };

  const handleChangeCustom = (onChangeValue, i) => {
    let inputData = state.customization;
    inputData[i]["type"] = onChangeValue.target.value;
    dispatch({ type: ACTION_TYPES.SET_CUSTOMIZATION, payload: [inputData] });
  };

  const handleRemoveCustom = (i) => {
    let inputData = state.customization;
    inputData.splice(i, 1);
    dispatch({ type: ACTION_TYPES.SET_CUSTOMIZATION, payload: [inputData] });
  };

  const handleAddSubCustom = (i) => {
    let inputData = state.customization;
    inputData[i]["value"].push("");
    dispatch({ type: ACTION_TYPES.SET_CUSTOMIZATION, payload: [inputData] });
  };

  const handleChangeSubCustom = (onChangeValue, i, k) => {
    let inputData = state.customization;
    inputData[i]["value"][k] = onChangeValue.target.value;
    dispatch({ type: ACTION_TYPES.SET_CUSTOMIZATION, payload: [inputData] });
  };

  const handleRemoveSubCustom = (i, k) => {
    let inputData = state.customization;
    inputData[i]["value"].splice(k, 1);
    dispatch({ type: ACTION_TYPES.SET_CUSTOMIZATION, payload: [inputData] });
  };

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
    dispatch({
      type: ACTION_TYPES.ADD_CUSTOMIZATION,
      payload: { type: "", value: [""] },
    });
    dispatch({ type: ACTION_TYPES.ADD_IMAGE, payload: "" });
  }, []);

  useEffect(() => {
    dispatch({ type: ACTION_TYPES.SET_ERROR, payload: "" });
  }, [
    state.name,
    state.description,
    state.category,
    state.price,
    state.customization,
    state.availability,
    state.deliveryOption,
    state.image,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
              inputData.push(res.data.secure_url);
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
    } else {
      console.log("Token expired");
    }

    let data = JSON.stringify({
      name: state.name,
      images: state.imageUrl,
      category: state.category,
      price: state.price,
      customization: state.customization,
      description: state.description,
      availability: state.availability,
      deliveryOption: state.deliveryOption,
    });

    try {
      const response = await axios.post(
        "http://api.localhost/products/add",
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
      dispatch({ type: ACTION_TYPES.SET_CATEGORY, payload: "" });
      dispatch({ type: ACTION_TYPES.SET_PRICE, payload: "" });
      dispatch({
        type: ACTION_TYPES.SET_CUSTOMIZATION,
        payload: [],
      });
      dispatch({ type: ACTION_TYPES.SET_AVAILABILITY, payload: 1 });
      dispatch({ type: ACTION_TYPES.SET_DELIVERYOPTION, payload: "" });
      dispatch({ type: ACTION_TYPES.SET_IMAGE, payload: [""] });
      dispatch({ type: ACTION_TYPES.SET_IMAGE_URL, payload: [""] });
      dispatch({
        type: ACTION_TYPES.SET_SUCCESS,
        payload: "Product listed for sale",
      });
      window.scrollTo(0, 0);
    } catch (err) {
      dispatch({
        type: ACTION_TYPES.SET_ERROR,
        payload: err?.response.data.error,
      });
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <div className="p-4 ml-16 md:ml-64 bg-gray-100 flex flex-col gap-4 transition-full duration-300">
        <p className="text-cldark text-4xl font-bold my-4 text-medium">
          Add Product
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
                  Category
                </div>
                <input
                  type="text"
                  placeholder="Product category"
                  required
                  onFocus={() =>
                    dispatch({ type: ACTION_TYPES.SET_SUCCESS, payload: "" })
                  }
                  onChange={(e) =>
                    dispatch({
                      type: ACTION_TYPES.SET_CATEGORY,
                      payload: e.target.value,
                    })
                  }
                  name="category"
                  value={state.category}
                  className="border border-gray-300 w-full p-3 rounded-lg text-cldark focus:outline focus:outline-1"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-xl font-semibold text-cldark">Price</div>
                <input
                  type="number"
                  required
                  onFocus={() =>
                    dispatch({ type: ACTION_TYPES.SET_SUCCESS, payload: "" })
                  }
                  placeholder="Product price"
                  onChange={(e) =>
                    dispatch({
                      type: ACTION_TYPES.SET_PRICE,
                      payload: e.target.value,
                    })
                  }
                  name="price"
                  value={state.price}
                  className="border border-gray-300 w-full p-3 rounded-lg text-cldark focus:outline focus:outline-1"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="text-xl font-semibold text-cldark">
                  Customization
                </div>
                {state.customization?.map((custom, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    {/* <div className="text-cldark text-sm font-semibold">Type</div> */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex gap-2 items-center">
                          <div className="flex items-center border rounded-lg  border-gray-300 focus-within:outline focus-within:outline-1 w-full">
                            <input
                              type="text"
                              placeholder="Color"
                              required
                              onFocus={() =>
                                dispatch({
                                  type: ACTION_TYPES.SET_SUCCESS,
                                  payload: "",
                                })
                              }
                              onChange={(e) => handleChangeCustom(e, i)}
                              value={state.customization[i]["type"]}
                              name="customTitle"
                              className="focus:outline-none w-full p-3 rounded-lg  text-cldark"
                            />
                            <div
                              onClick={handleAddCustom}
                              className="p-2 hover:scale-110 transition-full duration-300"
                            >
                              <div className="w-4 h-4">
                                <IconPlus fill="#222" />
                              </div>
                            </div>
                          </div>
                          {state.customization.length > 1 ? (
                            <div
                              onClick={() => handleRemoveCustom(i)}
                              className="w-5 h-5 hover:scale-110 transition-all duration-300"
                            >
                              <IconBin fill="#222" />
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        {/* {Object.entries(state.customization[i]).filter(([key, _]) => key !== "title").map((t,k) => ( */}
                        {state.customization[i]["value"].map((t, k) => (
                          <div key={k}>
                            <div>
                              <div className="flex gap-2 items-center">
                                <div className="flex items-center border rounded-lg w-full  border-gray-300 focus-within:outline focus-within:outline-1">
                                  <input
                                    type="text"
                                    placeholder="Blue"
                                    required
                                    onFocus={() =>
                                      dispatch({
                                        type: ACTION_TYPES.SET_SUCCESS,
                                        payload: "",
                                      })
                                    }
                                    onChange={(e) =>
                                      handleChangeSubCustom(e, i, k)
                                    }
                                    value={state.customization[i]["value"][k]}
                                    name="subCustom"
                                    className="focus:outline-none w-full p-3 rounded-lg text-cldark"
                                  />
                                  <div
                                    onClick={() => handleAddSubCustom(i)}
                                    className="p-2 hover:scale-110 transition-full duration-300"
                                  >
                                    <div className="w-4 h-4">
                                      <IconPlus fill="#222" />
                                    </div>
                                  </div>
                                </div>
                                {state.customization[i]["value"].length > 1 ? (
                                  <div
                                    onClick={() => handleRemoveSubCustom(i, k)}
                                    className="w-5 h-5 hover:scale-110 duration-300 transition-all"
                                  >
                                    <IconBin fill="#222" />
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 shadow-lg rounded-md flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="text-xl font-semibold text-cldark">
                  Availability
                </div>
                <div>
                  <select
                    id="availability"
                    name="availability"
                    className="border border-gray-300 w-full p-3 rounded-lg text-cldark focus:outline focus:outline-1"
                    onFocus={() =>
                      dispatch({ type: ACTION_TYPES.SET_SUCCESS, payload: "" })
                    }
                    onChange={(e) => {
                      dispatch({
                        type: ACTION_TYPES.SET_AVAILABILITY,
                        payload: e.target.value,
                      });
                      console.log(state.availability);
                    }}
                  >
                    <option value={0}>Available</option>
                    <option value={1}>Unavailable</option>
                  </select>
                </div>
              </div>
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
                        htmlFor="image"
                        className="w-full cursor-pointer p-3 hover:bg-gray-300"
                      >
                        {/* Select image */}
                        <input
                          type="file"
                          // required
                          accept="image/png, image/jpg, image/gif, image/jpeg"
                          name="image"
                          id="image"
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
                          className=""
                        />
                      </label>
                      <div
                        onClick={() => handleAddImage()}
                        className="p-2 hover:scale-110 transition-full duration-300"
                      >
                        <div className="w-4 h-4">
                          <IconPlus fill="#222" />
                        </div>
                      </div>
                    </div>
                    {state.image.length > 1 ? (
                      <div
                        onClick={() => handleRemoveImage(idx)}
                        className="w-5 h-5 hover:scale-110 duration-300 transition-all"
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
                        className="w-5 h-5 hover:scale-110 duration-300 transition-all"
                      >
                        <IconBin fill="#222" />
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                ))}
              </div>
              <button className="btn">Submit</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
