import React from "react";
import { IconFile, IconEdit, IconDelete } from "../Shop/utils/Icons";

const Dashboard = () => {
  return (
    <>
      <div className="p-4 bg-gray-100 flex flex-col gap-4 transition-full duration-300">
        <p className="text-cldark text-4xl font-bold my-4 text-medium">Order</p>

        <div className="shadow-md bg-white">
          <div className="p-4 flex items-center sm:justify-between sm:flex-row gap-1 flex-col justify-center">
            <div className="text-2xl font-semibold text-cldark">
              User Management
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
              <tbody className="">
                <tr className="hover:bg-gray-50 ">
                  <td className="text-cldark p-4 border-b whitespace-nowrap overflow-hidden">
                    <div className="flex items-center gap-2 w-48">
                      <div className="w-10">
                        <img
                          src=""
                          alt="product image"
                          className="w-full h-10 rounded-full shadow-md object-cover"
                        />
                      </div>
                      <div className="font-semibold w-32 overflow-hidden">
                        product.name
                      </div>
                    </div>
                  </td>
                  <td className="text-cldark p-4 border-b whitespace-nowrap">
                    product.username
                  </td>
                  <td className="text-cldark p-4 border-b whitespace-nowrap">
                    product.quantity
                  </td>
                  <td className="text-cldark p-4 border-b whitespace-nowrap">
                    $product.cost
                  </td>
                  <td className="text-cldark p-4 border-b whitespace-nowrap">
                    DROP
                  </td>
                  <td className="text-cldark p-4 border-b whitespace-nowrap">
                    <div className="flex gap-2 items-center">
                      <div className="w-5 h-5 hover:scale-110 transition-all duration-300 hover:cursor-pointer">
                        <IconFile fill="hsl(22, 28%, 45%)" />
                      </div>
                      <div className="w-6 h-6 hover:scale-110 transition-all duration-300 hover:cursor-pointer">
                        <IconEdit fill="hsl(22, 28%, 45%)" />
                      </div>
                      <div className="w-7 h-7 hover:scale-110 transition-all duration-300 hover:cursor-pointer">
                        <IconDelete fill="hsl(22, 28%, 45%)" />
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
