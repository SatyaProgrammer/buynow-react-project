import React from "react";
import { IconDelete, IconEdit, IconFile } from "../pages/Shop/utils/Icons";
import { Link } from "react-router-dom";

const Table = (props) => {
    return (
      <div className="overflow-x-auto table-scrolling">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              {props.th.map((th, idx) => (
                <th key={idx} className="text-cldark text-left font-semibold text-md p-4 border-y name-row whitespace-nowrap">
                  {th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {props.tr.map((product, idx) => (
              <tr key={idx} className="hover:bg-gray-50 ">
                <td className="text-cldark p-4 border-b overflow-hidden whitespace-nowrap name-row">
                  <div className="flex items-center gap-2 w-48">
                    <div className="w-16">
                      <img
                        src={product.image}
                        alt="product image"
                        className="w-full h-10 rounded-md shadow-md object-cover"
                      />
                    </div>
                    <div className="font-semibold w-32 overflow-hidden">
                      {product.title}
                    </div>
                  </div>
                </td>
                <td className="text-cldark p-4 border-b whitespace-nowrap">
                  {product.category}
                </td>
                <td className="text-cldark p-4 border-b whitespace-nowrap">
                  00-00-0000
                </td>
                <td className="text-cldark p-4 border-b whitespace-nowrap">
                  ${product.price}
                </td>
                <td className="text-cldark p-4 border-b whitespace-nowrap">
                  200
                </td>
                <td className="text-cldark p-4 border-b whitespace-nowrap">
                  In-stock
                </td>
                <td className="text-cldark p-4 border-b whitespace-nowrap">
                  <div className="flex gap-2 items-center">
                    <Link to={"/shop/product/".concat(product.id)}>
                      <div className="w-5 h-5 hover:scale-110 transition-all duration-300">
                        <IconFile fill="hsl(22, 28%, 45%)" />
                      </div>
                    </Link>
                    <div className="w-6 h-6 hover:scale-110 transition-all duration-300">
                      <IconEdit fill="hsl(22, 28%, 45%)" />
                    </div>
                    <div className="w-7 h-7 hover:scale-110 transition-all duration-300">
                      <IconDelete fill="hsl(22, 28%, 45%)" />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
}

export default Table