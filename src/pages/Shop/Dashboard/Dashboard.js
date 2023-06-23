import React, { useEffect } from "react";
import "./Dashboard.css";
import { LineChart, PieChart } from "../../../components/Chart";
import { useState } from "react";
import { UserData } from "../ChartTempData";
import { IconShoppingCart, IconDollar, IconUser } from "../utils/Icons";
import { Link } from "react-router-dom";
import {
  dashboardReducer,
  INITIAL_STATE,
  ACTION_TYPES,
} from "./DashboardReducer";
import { useReducer } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [state, dispatch] = useReducer(dashboardReducer, INITIAL_STATE);
  const cookies = new Cookies();
  const navigate = new useNavigate();

  const handleFetch = async () => {
    dispatch({ type: ACTION_TYPES.FETCH_START });
    let data = {};
    const token = cookies.get("jwt_authorization");
    const current_user = cookies.get("current_user");

    // CUSTOMERS
    const customers_response = await axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/dashboard/customers`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
      })
      .catch((err) => {
        if (err?.response.data.error_code == "BX0001") {
          cookies.remove("jwt_authorization");
          navigate("/shop/dashboard");
        }
      });
    if (customers_response && customers_response.data) {
      data["customers"] = customers_response.data;
      dispatch({
        type: ACTION_TYPES.SET_CUSTOMER_DATA,
        payload: customers_response.data,
      });
      dispatch({
        type: ACTION_TYPES.SET_SUCCESS,
        payload: data,
      });
    }

    // ORDER COUNTS
    const order_counts_response = await axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/dashboard/orders_count`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
      })
      .catch((err) => {
        if (err?.response.data.error_code == "BX0001") {
          cookies.remove("jwt_authorization");
          navigate("/shop/dashboard");
        }
      });
    if (order_counts_response && order_counts_response.data) {
      data["order_counts"] = order_counts_response.data;
      dispatch({
        type: ACTION_TYPES.SET_SUCCESS,
        payload: data,
      });
    }

    // REVENUE
    const revenue_response = await axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/dashboard/revenue`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
      })
      .catch((err) => {
        if (err?.response.data.error_code == "BX0001") {
          cookies.remove("jwt_authorization");
          navigate("/shop/dashboard");
        }
      });
    if (revenue_response && revenue_response.data) {
      data["revenue"] = revenue_response.data;
      dispatch({
        type: ACTION_TYPES.SET_SUCCESS,
        payload: data,
      });
    }

    // RECENT ORDER
    const recent_order_response = await axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/dashboard/recent_orders`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
      })
      .catch((err) => {
        if (err?.response.data.error_code == "BX0001") {
          cookies.remove("jwt_authorization");
          navigate("/sell/dashboard");
        }
      });
    if (recent_order_response && recent_order_response.data) {
      data["recent_order"] = recent_order_response.data;
      dispatch({
        type: ACTION_TYPES.SET_SUCCESS,
        payload: data,
      });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      handleFetch();
    }, "300");
  }, []);

  return (
    <div>
      {/* ml-16 md:ml-64 */}
      <div className="p-4 sm:ml-16 bg-gray-100 flex flex-col gap-4 transition-full duration-300">
        <p className="text-cldark text-4xl font-bold my-4">Dashboard</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="h-48 bg-white shadow-md flex flex-col justify-evenly px-6 hover:-translate-y-1 hover:shadow-none transition-full duration-300">
            <div className="flex justify-between items-center">
              <div className="text-xl text-gray-600 font-bold">Orders</div>
              <div className="w-8">
                <IconShoppingCart fill="#936a53" />
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cldark">
                {state.post.order_counts?.count}
              </div>
            </div>
            <Link to="/sell/order">
              <div>
                <div className="text-md text-primary4 font-bold">
                  View orders
                </div>
              </div>
            </Link>
          </div>
          <div className="h-48 bg-white shadow-md flex flex-col justify-evenly px-6 hover:-translate-y-1 hover:shadow-none transition-full duration-300">
            <div className="flex justify-between items-center">
              <div className="text-xl text-gray-600 font-bold">Revenue</div>
              <div className="w-7">
                <IconDollar fill="#936a53" />
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cldark">
                ${state.post.revenue?.revenue}
              </div>
            </div>
            <div>
              <div className="text-md text-primary4 font-bold">
                View earning
              </div>
            </div>
          </div>
          <div className="h-48 bg-white shadow-md flex flex-col justify-evenly px-6 hover:-translate-y-1 hover:shadow-none transition-full duration-300">
            <div className="flex justify-between items-center">
              <div className="text-xl text-gray-600 font-bold">Customer</div>
              <div className="w-8">
                <IconUser fill="#936a53" />
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cldark">
                {/* {state.customer_data.total_customers} */}
                {state.post.customers?.total_customers}
              </div>
            </div>
            <Link to="/shop/customer">
              <div>
                <div className="text-md text-primary4 font-bold">
                  All customer
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-3 gap-4">
          <div className="lg:col-span-3 xl:col-span-2 shadow-md bg-white hover:shadow-none transition-full duration-300 h-96">
            <LineChart chartData={userData} />
          </div>
          <div className="lg:col-span-2 xl:col-span-1 shadow-md bg-white hover:shadow-none transition-full duration-300 h-96 flex justify-center items-center p-0 xl:p-2">
            <PieChart chartData={userData} />
          </div>
        </div> */}

        <div className="">
          <div className="shadow-md bg-white p-2">
            <div className="mb-4 p-2 flex justify-between">
              <div className="text-cldark text-2xl font-semibold">
                Recent Orders
              </div>
              <Link to="/sell/order" className="btn">
                View more
              </Link>
            </div>
            <div className="overflow-x-auto table-wrapper h-80 px-2 pb-2">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead className="sticky top-0 bg-white z-50">
                  <tr>
                    <th className="text-cldark font-semibold text-md mr-2 pb-4 border-b">
                      Product
                    </th>
                    <th className="text-cldark font-semibold text-md pb-4 border-b">
                      Customer
                    </th>
                    <th className="text-cldark font-semibold text-md pb-4 border-b">
                      Quantity
                    </th>
                    <th className="text-cldark font-semibold text-md pb-4 border-b">
                      Total
                    </th>
                    <th className="text-cldark font-semibold text-md pb-4 border-b">
                      Order ID
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  {state.post.recent_order?.orders.map((product, idx) => (
                    <tr key={idx} className="text-left hover:bg-gray-50">
                      <td className="text-cldark py-4 whitespace-nowrap overflow-hidden">
                        <div className="flex items-center gap-2">
                          <div className="w-16">
                            <img
                              src={product.images.images[0]}
                              alt="product image"
                              className="w-full h-10 rounded-md shadow-md object-cover"
                            />
                          </div>
                          <div className="font-semibold w-10 overflow-hidden">
                            {product.name}
                          </div>
                        </div>
                      </td>
                      <td className="text-cldark py-2">{product.username}</td>
                      <td className="text-cldark py-2">{product.quantity}</td>
                      <td className="text-cldark py-2">{product.cost}</td>
                      <td className="text-cldark py-2">
                        {product.trackingNumber}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
