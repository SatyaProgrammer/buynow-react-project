import React, { useEffect } from "react";
import "./Dashboard.css";
import { LineChart, PieChart } from "../../../components/Chart";
import { useState } from "react";
import { UserData } from "../ChartTempData";
import {
  IconShoppingCart,
  IconDollar,
  IconUser,
  IconCreditCard,
} from "../utils/Icons";
import { Link } from "react-router-dom";
import { dashboardReducer, INITIAL_STATE, ACTION_TYPES } from "./DashboardReducer";
import { useReducer } from "react";
import axios from "axios";

const Dashboard = () => {
  const [userData, setUserData] = useState({
    labels: UserData.map((data) => data.year),
    datasets: [
      {
        label: "Users Gained",
        data: UserData.map((data) => data.userGain),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
      },
    ],
  });

  const [state, dispatch] = useReducer(dashboardReducer, INITIAL_STATE);

  const handleFetch = async () => {
    dispatch({ type: ACTION_TYPES.FETCH_START });
    const response = await axios
      .get("http://api.localhost/dashboard/orders_count")
      .catch((err) => {
        console.log(err?.response);
      });
    if (response && response.data) {
      dispatch({ type: ACTION_TYPES.FETCH_SUCCESS, payload: response.data });
    }
  };

  useEffect(() => {
    handleFetch()
  }, [])
  return (
    <>
      <div className="p-4 ml-16 md:ml-64 bg-gray-100 flex flex-col gap-4 transition-full duration-300">
        <p className="text-cldark text-4xl font-bold my-4">Dashboard</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="h-48 bg-white shadow-md flex flex-col justify-evenly px-6 hover:-translate-y-1 hover:shadow-none transition-full duration-300">
            <div className="flex justify-between items-center">
              <div className="text-xl text-gray-600 font-bold">Orders</div>
              <div className="w-8">
                <IconShoppingCart fill="#936a53" />
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cldark">150</div>
            </div>
            <Link to="/shop/order">
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
              <div className="text-4xl font-bold text-cldark">$1500</div>
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
              <div className="text-4xl font-bold text-cldark">94</div>
            </div>
            <Link to="/shop/customer">
              <div>
                <div className="text-md text-primary4 font-bold">
                  All customer
                </div>
              </div>
            </Link>
          </div>
          <div className="h-48 bg-white shadow-md flex flex-col justify-evenly px-6 hover:-translate-y-1 hover:shadow-none transition-full duration-300">
            <div className="flex justify-between items-center">
              <div className="text-xl text-gray-600 font-bold">Balance</div>
              <div className="w-7">
                <IconCreditCard fill="#936a53" />
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cldark">$5300</div>
            </div>
            <div>
              <div className="text-md text-primary4 font-bold">
                View balance
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-3 gap-4">
          <div className="lg:col-span-3 xl:col-span-2 shadow-md bg-white hover:shadow-none transition-full duration-300 h-96">
            <LineChart chartData={userData} />
          </div>
          <div className="lg:col-span-2 xl:col-span-1 shadow-md bg-white hover:shadow-none transition-full duration-300 h-96 flex justify-center items-center p-0 xl:p-2">
            <PieChart chartData={userData} />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="shadow-md bg-white p-2">
            <div className="mb-4 p-2">
              <p className="text-cldark text-2xl font-semibold">
                Recent Orders
              </p>
            </div>
            <div className="overflow-x-auto table-wrapper h-80 px-2 pb-2">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead className="sticky top-0 bg-white z-50">
                  <tr>
                    <th className="text-cldark font-semibold text-md mr-2 pb-4 border-b">
                      OrderID
                    </th>
                    <th className="text-cldark font-semibold text-md pb-4 border-b">
                      Customer
                    </th>
                    <th className="text-cldark font-semibold text-md pb-4 border-b">
                      Product
                    </th>
                    <th className="text-cldark font-semibold text-md pb-4 border-b">
                      Quantity
                    </th>
                    <th className="text-cldark font-semibold text-md pb-4 border-b">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  <tr>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                  </tr>
                  <tr>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                  </tr>
                  <tr>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                  </tr>
                  <tr>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                  </tr>
                  <tr>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                  </tr>
                  <tr>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                  </tr>
                  <tr>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                  </tr>
                  <tr>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                  </tr>
                  <tr>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                  </tr>
                  <tr>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                  </tr>
                  <tr>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="shadow-md bg-white p-2">
            <div className="mb-4 p-2">
              <p className="text-cldark text-2xl font-semibold">
                Recent Orders
              </p>
            </div>
            <div className="overflow-x-auto table-wrapper h-80 px-2 pb-2">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead className="sticky top-0 bg-white z-50">
                  <tr>
                    <th className="text-cldark font-semibold text-md mr-2 pb-4 border-b">
                      OrderID
                    </th>
                    <th className="text-cldark font-semibold text-md pb-4 border-b">
                      Customer
                    </th>
                    <th className="text-cldark font-semibold text-md pb-4 border-b">
                      Product
                    </th>
                    <th className="text-cldark font-semibold text-md pb-4 border-b">
                      Quantity
                    </th>
                    <th className="text-cldark font-semibold text-md pb-4 border-b">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="">
                  <tr>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                  </tr>
                  <tr>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                  </tr>
                  <tr>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                  </tr>
                  <tr>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                  </tr>
                  <tr>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                  </tr>
                  <tr>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                  </tr>
                  <tr>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                  </tr>
                  <tr>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                  </tr>
                  <tr>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                  </tr>
                  <tr>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                  </tr>
                  <tr>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                    <td className="text-cldark p-2">001</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
