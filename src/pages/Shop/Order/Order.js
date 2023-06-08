import React from "react";
import { Link } from "react-router-dom";
import { useReducer, useEffect } from "react";
import { orderReducer, INITIAL_STATE, ACTION_TYPES } from "./OrderReducer";
import axios from "axios";
import { API_CALL } from "../utils/Constant";
import { IconDelete, IconEdit, IconFile, IconArrowDown } from "../utils/Icons";
import { Loading } from "../../../components";
import Table from "../../../components/Table";
import Cookies from "universal-cookie";

const Order = () => {
  const [state, dispatch] = useReducer(orderReducer, INITIAL_STATE);
  const cookies = new Cookies();
  const token = cookies.get("jwt_authorization");

  const handleFetch = async () => {
    dispatch({ type: ACTION_TYPES.FETCH_START });
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/trackings/vendor`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${token}`,
          },
        }
      );

      if (response && response.data) {
        response.data.orders.map((data, idx) => {
          response.data.orders[idx]["status_drop"] = false;
        });
        dispatch({ type: ACTION_TYPES.FETCH_SUCCESS, payload: response.data });
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  const statOpen = (idx) => {
    let inputData = state.post;
    let flag = false;
    inputData.orders.map((order, id) => {
      if (inputData.orders[id].status_drop == true) {
        if (id != idx) {
          flag = true;  
        }
      }
    });
    if (flag) {
      inputData.orders.map((order, id) => {
        inputData.orders[id].status_drop = false;
      });
    }
    inputData.orders[idx].status_drop = !inputData.orders[idx].status_drop;
    console.log(inputData.orders[idx].status_drop);
    dispatch({ type: ACTION_TYPES.SET_ORDERS, payload: inputData });
  };

  let toggleShowRow = state.show_row ? "block" : "hidden";
  let toggleShowRowIcon = state.show_row ? "rotate-180" : "rotate-0";
  const handleShowRow = () => {
    dispatch({ type: ACTION_TYPES.SHOW_ROW });
  };

  return (
    <>
      {state.loading ? (
        <div className="p-4 ml-16 md:ml-64 bg-gray-100 flex justify-center items-center transition-full duration-300">
          <Loading />
        </div>
      ) : (
        <div className="p-4 ml-16 md:ml-64 bg-gray-100 flex flex-col gap-4 transition-full duration-300">
          <p className="text-cldark text-4xl font-bold my-4 text-medium">
            Order
          </p>

          <div className="shadow-md bg-white">
            <div className="p-4 flex items-center sm:justify-between sm:flex-row gap-1 flex-col justify-center">
              {/* <div className="flex items-center gap-1">
                  <div className="text-md text-cldark font-semibold">Show</div>
                  <div>
                    <div className="w-20 h-7 border rounded-md px-1 flex justify-between items-center">
                      <div>10</div>
                      <div
                        onClick={handleShowRow}
                        className={`w-6 h-6 tansition-all duration-200 ${toggleShowRowIcon}`}
                      >
                        <IconArrowDown fill="#222" />
                      </div>
                    </div>
                    <div
                      className={`w-20 h-24 border absolute mt-1 rounded-md bg-white ${toggleShowRow}`}
                    ></div>
                  </div>
                </div>

                <form>
                  <label
                    htmlFor="default-search"
                    className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                  >
                    Search
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        ></path>
                      </svg>
                    </div>
                    <input
                      type="search"
                      id="default-search"
                      className="block w-full px-4 py-2 pl-10 text-sm text-gray-900 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Search..."
                      required
                    />
                  </div>
                </form> */}
              <div className="text-2xl font-semibold text-primary4">
                Customer orders
              </div>
            </div>
            <div className="overflow-x-auto table-scrolling table-wrapper page">
              <table className="w-full">
                <thead className="bg-gray-100 z-50">
                  <tr>
                    <th className="text-cldark text-left font-semibold text-md p-4 border-y name-row whitespace-nowrap">
                      Product
                    </th>
                    <th className="text-cldark text-left font-semibold text-md p-4 border-y name-row whitespace-nowrap">
                      Customer
                    </th>
                    <th className="text-cldark text-left font-semibold text-md p-4 border-y name-row whitespace-nowrap">
                      Quantity
                    </th>
                    <th className="text-cldark text-left font-semibold text-md p-4 border-y name-row whitespace-nowrap">
                      Total
                    </th>
                    <th className="text-cldark text-left font-semibold text-md p-4 border-y name-row whitespace-nowrap">
                      Status
                    </th>
                    <th className="text-cldark text-left font-semibold text-md p-4 border-y name-row whitespace-nowrap">
                      Action
                    </th>
                  </tr>
                </thead>
                {console.log(state.post.orders)}
                <tbody className="">
                  {state.post.orders ? (
                    state.post.orders.map((product, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 ">
                        <td className="text-cldark p-4 border-b whitespace-nowrap overflow-hidden">
                          <div className="flex items-center gap-2 w-48">
                            <div className="w-16">
                              <img
                                src={product.images.images[0]}
                                alt="product image"
                                className="w-full h-10 rounded-md shadow-md object-cover"
                              />
                            </div>
                            <div className="font-semibold w-32 overflow-hidden">
                              {product.name}
                            </div>
                          </div>
                        </td>
                        <td className="text-cldark p-4 border-b whitespace-nowrap">
                          {product.username}
                        </td>
                        <td className="text-cldark p-4 border-b whitespace-nowrap">
                          {product.quantity}
                        </td>
                        <td className="text-cldark p-4 border-b whitespace-nowrap">
                          ${product.cost}
                        </td>
                        <td className="text-cldark p-4 border-b whitespace-nowrap">
                          <button
                            onClick={() => statOpen(idx)}
                            id="dropdownDefaultButton"
                            data-dropdown-toggle="dropdown"
                            className="text-center inline-flex items-center p-1 px-2 rounded-full bg-yellow-100 border-2 border-yellow-200 text-yellow-700 font-semibold hover:opacity-70"
                            type="button"
                          >
                            Pending
                            <svg
                              className={
                                state.post.orders[idx].status_drop
                                  ? "w-4 h-4 ml-2 rotate-180"
                                  : "w-4 h-4 ml-2"
                              }
                              aria-hidden="true"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                              ></path>
                            </svg>
                          </button>
                          {/* <!-- Dropdown menu --> */}
                          <div
                            id="dropdown"
                            className={
                              state.post.orders[idx].status_drop
                                ? "absolute mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-fit dark:bg-gray-700"
                                : "hidden"
                            }
                          >
                            <ul
                              className="py-2 text-gray-700 dark:text-gray-200"
                              aria-labelledby="dropdownDefaultButton"
                            >
                              <li>
                                <Link
                                  onClick={() => statOpen(idx)}
                                  href="#"
                                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                  Pending
                                </Link>
                              </li>
                              <li>
                                <Link
                                  onClick={() => statOpen(idx)}
                                  href="#"
                                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                  Delevering
                                </Link>
                              </li>
                              <li>
                                <Link
                                  onClick={() => statOpen(idx)}
                                  href="#"
                                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                  Delivered
                                </Link>
                              </li>
                              <li>
                                <Link
                                  onClick={() => statOpen(idx)}
                                  href="#"
                                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                  Canceled
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </td>
                        <td className="text-cldark p-4 border-b whitespace-nowrap">
                          <div className="flex gap-2 items-center">
                            <div className="w-5 h-5 hover:scale-110 transition-all duration-300">
                              <IconFile fill="hsl(22, 28%, 45%)" />
                            </div>
                            <div className="w-6 h-6 hover:scale-110 transition-all duration-300">
                              <IconEdit fill="hsl(22, 28%, 45%)" />
                            </div>
                            <div className="w-7 h-7 hover:scale-110 transition-all duration-300">
                              <IconDelete fill="hsl(22, 28%, 45%)" />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="p-4">No order found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Order;
