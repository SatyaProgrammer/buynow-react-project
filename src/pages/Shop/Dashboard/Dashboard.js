import React from "react";
import "./Dashboard.css";
import IconShoppingCart from "../icons/icon_shopping_cart";
import IconDollar from "../icons/icon_dollar";
import IconUser from "../icons/icon_user";
import IconCreditCard from "../icons/icon_credit_card";
import "../color.css";
import { LineChart, PieChart } from "../../../components/Chart";
import { useState } from "react";
import { UserData } from "../ChartTempData";

function Dashboard() {
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

  return (
    <>
      <div className="p-4 md:ml-64 bg-gray-100 flex flex-col gap-4 transition-full duration-300">
        <p className="text-cldark text-4xl font-bold my-4">Dashboard</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="h-48 bg-white shadow-md flex flex-col justify-evenly px-6 hover:-translate-y-1 hover:shadow-none transition-full duration-300">
            <div className="flex justify-between items-center">
              <p className="text-xl text-gray-600 font-bold">Orders</p>
              <div className="w-8">
                <IconShoppingCart fill="#936a53" />
              </div>
            </div>
            <div>
              <p className="text-4xl font-bold text-cldark">150</p>
            </div>
            <div>
              <p className="text-md text-primary4 font-bold">View orders</p>
            </div>
          </div>
          <div className="h-48 bg-white shadow-md flex flex-col justify-evenly px-6 hover:-translate-y-1 hover:shadow-none transition-full duration-300">
            <div className="flex justify-between items-center">
              <p className="text-xl text-gray-600 font-bold">Revenue</p>
              <div className="w-7">
                <IconDollar fill="#936a53" />
              </div>
            </div>
            <div>
              <p className="text-4xl font-bold text-cldark">$1500</p>
            </div>
            <div>
              <p className="text-md text-primary4 font-bold">View earning</p>
            </div>
          </div>
          <div className="h-48 bg-white shadow-md flex flex-col justify-evenly px-6 hover:-translate-y-1 hover:shadow-none transition-full duration-300">
            <div className="flex justify-between items-center">
              <p className="text-xl text-gray-600 font-bold">Customer</p>
              <div className="w-8">
                <IconUser fill="#936a53" />
              </div>
            </div>
            <div>
              <p className="text-4xl font-bold text-cldark">94</p>
            </div>
            <div>
              <p className="text-md text-primary4 font-bold">All customer</p>
            </div>
          </div>
          <div className="h-48 bg-white shadow-md flex flex-col justify-evenly px-6 hover:-translate-y-1 hover:shadow-none transition-full duration-300">
            <div className="flex justify-between items-center">
              <p className="text-xl text-gray-600 font-bold">Balance</p>
              <div className="w-7">
                <IconCreditCard fill="#936a53" />
              </div>
            </div>
            <div>
              <p className="text-4xl font-bold text-cldark">$5300</p>
            </div>
            <div>
              <p className="text-md text-primary4 font-bold">View balance</p>
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
}

export default Dashboard;
