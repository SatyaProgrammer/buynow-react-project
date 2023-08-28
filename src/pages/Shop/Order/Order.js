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
import { orderStatus } from "../utils/Constant";
import { useNavigate } from "react-router-dom";
import Redirecter from "../../../components/Redirecter";

const Order = () => {
  const [state, dispatch] = useReducer(orderReducer, INITIAL_STATE);
  const cookies = new Cookies();
  const token = cookies.get("jwt_authorization");
  const navigate = new useNavigate();

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
    } catch (err) {}
  };

  useEffect(() => {
    setTimeout(() => {
      handleFetch();
    }, "300");
  }, []);
  const statOpen = async (idx, orderStatus, trackingNumber) => {
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
    dispatch({ type: ACTION_TYPES.SET_ORDERS, payload: inputData });
    if (trackingNumber) {
      try {
        let data = JSON.stringify({
          status: orderStatus,
        });
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/trackings/${trackingNumber}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${token}`,
            },
          }
        );
        if (response) {
          navigate("/redirect");
        }
      } catch (error) {}
    }
  };

  let toggleShowRow = state.show_row ? "block" : "hidden";
  let toggleShowRowIcon = state.show_row ? "rotate-180" : "rotate-0";
  const handleShowRow = () => {
    dispatch({ type: ACTION_TYPES.SHOW_ROW });
  };

  return (
    <>
      {state.loading ? (
        // ml-16 md:ml-64
        <div className="p-4 sm:ml-16 bg-gray-100 flex justify-center items-center transition-full duration-300">
          <Loading />
        </div>
      ) : (
        // ml-16 md:ml-64
        <div className="p-4 sm:ml-16 bg-gray-100 flex flex-col gap-4 transition-full duration-300">
          <p className="text-cldark text-4xl font-bold my-4 text-medium">
            Order
          </p>

          <div className="shadow-md bg-white">
            <div className="p-4 flex items-center sm:justify-between sm:flex-row gap-1 flex-col justify-center">
              <div className="text-2xl font-semibold text-cldark">
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
                  </tr>
                </thead>
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
                          {orderStatus.map((stat, id) => (
                            <div key={id}>
                              {product.status == stat.status ? (
                                <button
                                  onClick={() => statOpen(idx)}
                                  id="dropdownDefaultButton"
                                  data-dropdown-toggle="dropdown"
                                  className={stat.css}
                                  type="button"
                                >
                                  {product.status}
                                  <svg
                                    className={
                                      state.post.orders[idx]?.status_drop
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
                              ) : (
                                ""
                              )}
                            </div>
                          ))}
                          {/* <!-- Dropdown menu --> */}
                          <div
                            id="dropdown"
                            className={
                              state.post.orders[idx]?.status_drop
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
                                  onClick={() =>
                                    statOpen(
                                      idx,
                                      "pending",
                                      product.trackingNumber
                                    )
                                  }
                                  href="#"
                                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                  Pending
                                </Link>
                              </li>
                              <li>
                                <Link
                                  onClick={() =>
                                    statOpen(
                                      idx,
                                      "delivering",
                                      product.trackingNumber
                                    )
                                  }
                                  href="#"
                                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                  Delevering
                                </Link>
                              </li>
                              <li>
                                <Link
                                  onClick={() =>
                                    statOpen(
                                      idx,
                                      "completed",
                                      product.trackingNumber
                                    )
                                  }
                                  href="#"
                                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                  Completed
                                </Link>
                              </li>
                              <li>
                                <Link
                                  onClick={() =>
                                    statOpen(
                                      idx,
                                      "failed",
                                      product.trackingNumber
                                    )
                                  }
                                  href="#"
                                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                  Failed
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="p-4"></td>
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
