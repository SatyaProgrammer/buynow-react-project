import React from "react";
import { Link } from "react-router-dom";
import '../color.css'

const Product = () => {
    return ( 
        <>
        <div className="p-4 md:ml-64 bg-gray-100 flex flex-col gap-4 transition-full duration-300 h-screen">
            <p className="bn-text-dark text-4xl font-bold my-4 text-medium">Product</p>

            <div className="shadow-md bg-white py-4">
                    <div className="mb-4 p-2 px-4">
                        <Link className="p-2 bn-bg-primary text-white font-semibold rounded-md transition-all duration-300 hover:bg-green-700">Add Product</Link>
                    </div>
                    <div className="overflow-x-auto table-wrapper pb-2 overflow-auto h-96 ">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead className="sticky top-0 bg-gray-100 z-50">
                                <tr>
                                    <th className="bn-text-dark font-semibold text-md p-4 border-y">OrderID</th>
                                    <th className="bn-text-dark font-semibold text-md p-4 border-y ">Customer</th>
                                    <th className="bn-text-dark font-semibold text-md p-4 border-y">Product</th>
                                    <th className="bn-text-dark font-semibold text-md p-4 border-y">Quantity</th>
                                    <th className="bn-text-dark font-semibold text-md p-4 border-y">Status</th>
                                </tr>
                            </thead>
                            <tbody className="">
                                <tr>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                </tr>
                                <tr>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                </tr>
                                <tr>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                </tr>
                                <tr>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                </tr>
                                <tr>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                </tr>
                                <tr>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                </tr>
                                <tr>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                </tr>
                                <tr>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                </tr>
                                <tr>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                </tr>
                                <tr>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                </tr>
                                <tr>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                </tr>
                                <tr>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                </tr>
                                <tr>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                    <td className="bn-text-dark p-4 border-b">001</td>
                                </tr>
                                
                                
                                
                            </tbody>
                        </table>
                    </div>
                </div>
        </div>
        </>
    );
}

export default Product