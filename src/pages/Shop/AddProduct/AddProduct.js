import React from "react";
import { useReducer, useEffect, useRef } from "react";
import {
  addProductReducer,
  INITIAL_STATE,
  ACTION_TYPES,
} from "./AddProductReducer";
import { IconPlus, IconBin } from "../utils/Icons";

const price_regex = /^[0-9\b]+$/;

const AddProduct = () => {
  const [state, dispatch] = useReducer(addProductReducer, INITIAL_STATE);
  const nameRef = useRef();
  const priceRef = useRef("");

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

  useEffect(() => {
    nameRef.current.focus();
    dispatch({
      type: ACTION_TYPES.ADD_CUSTOMIZATION,
      payload: { type: "", value: [""] },
    });
  }, []);

  useEffect(() => {
    priceRef.current = state.price;
    if (price_regex.test(state.price)) {
      dispatch({ type: ACTION_TYPES.SET_PRICE, payload: state.price });
    } else {
      dispatch({ type: ACTION_TYPES.SET_PRICE, payload: priceRef.current });
    }
  }, [state.price]);

  // console.log(state.name)
  // console.log(state.description)
  // console.log(state.brand)
  // console.log(state.price)

  return (
    <>
      <div className="p-4 md:ml-64 bg-gray-100 flex flex-col gap-4 transition-full duration-300">
        <p className="text-cldark text-4xl font-bold my-4 text-medium">
          Add Product
        </p>
        <form>
          <div className="flex flex-col gap-4">
            <div className="bg-white p-4 shadow-lg rounded-md flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="text-xl font-semibold text-cldark">
                  Product Name
                </div>
                <input
                  type="text"
                  placeholder="Product name"
                  ref={nameRef}
                  onChange={(e) =>
                    dispatch({
                      type: ACTION_TYPES.SET_NAME,
                      payload: e.target.value,
                    })
                  }
                  name="name"
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
                <div className="text-xl font-semibold text-cldark">Brand</div>
                <input
                  type="text"
                  placeholder="Product brand"
                  onChange={(e) =>
                    dispatch({
                      type: ACTION_TYPES.SET_BRAND,
                      payload: e.target.value,
                    })
                  }
                  name="brand"
                  value={state.brand}
                  className="border border-gray-300 w-full p-3 rounded-lg text-cldark focus:outline focus:outline-1"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-xl font-semibold text-cldark">Price</div>
                <input
                  type="text"
                  ref={priceRef}
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
                {console.log(JSON.stringify(state.customization))}
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
          </div>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
