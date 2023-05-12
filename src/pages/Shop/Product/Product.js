import React from "react";
import { Link } from "react-router-dom";
import '../color.css'
import Pic from "../../../assets/hero-bcg-2.jpeg"
import Pic2 from "../../../assets/hero-bcg.jpeg"
import IconArrowDown from "../icons/icon_arrow_down";
import IconSearch from "../icons/icon_search";
import { useReducer, useEffect } from "react";
import { productReducer, INITIAL_STATE, ACTION_TYPES } from "./ProductReducer";
import axios from "axios";


const Product = () => {
    const [state, dispatch] = useReducer(productReducer, INITIAL_STATE);
    
    const handleFetch = async () => {
        dispatch({ type: ACTION_TYPES.FETCH_START })
        const response = await axios.get("https://fakestoreapi.com/products").catch((err) => {
            console.log("Error:", err)
        })
        if(response && response.data){
            dispatch({ type: ACTION_TYPES.FETCH_SUCCESS, payload: response.data })
        }
    }

    // const handleFetch = () => {
    //     dispatch({ type: ACTION_TYPES.FETCH_START });
    //     fetch("https://fakestoreapi.com/products")
    //       .then((res) => {
    //         return res.json();
    //       })
    //       .then((data) => {
    //         dispatch({ type: ACTION_TYPES.FETCH_SUCCESS, payload: data });
    //       })
    //       .catch((err) => {

    //       });
    //   };

    useEffect(() => {
        handleFetch()
    }, [])

    return ( 
        <>
        <div className="p-4 md:ml-64 bg-gray-100 flex flex-col gap-4 transition-full duration-300">
            <p className="bn-text-dark text-4xl font-bold my-4 text-medium">Product</p>

            <div className="shadow-md bg-white py-4">
                    <div className="mb-4 p-2 px-4">
                        <Link className="btn">Add Product</Link>
                    </div>
                    <div className="p-4 border-t flex items-center sm:justify-between sm:flex-row gap-1 flex-col justify-center">
                        <div className="flex items-center gap-1">
                            <div className="text-md text-grey1 font-semibold">Show</div>
                            <div>
                                <div className="w-20 h-7 border rounded-md px-1 flex justify-between items-center">
                                    <div>10</div>
                                    <div className="w-6 h-6">
                                        <IconArrowDown fill='#222'/>
                                    </div>
                                </div>
                                <div className="w-20 h-24 border absolute hidden"></div>
                            </div>
                        </div>
                        
                        <form>   
                            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                </div>
                                <input type="search" id="default-search" className="block w-full px-4 py-2 pl-10 text-sm text-gray-900 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..." required />
                            </div>
                        </form>

                    </div>
                    <div className="overflow-x-auto pb-2">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead className="bg-gray-100 z-50">
                                <tr>
                                    <th className="bn-text-dark font-semibold text-md p-4 border-y">Product</th>
                                    <th className="bn-text-dark font-semibold text-md p-4 border-y ">Category</th>
                                    <th className="bn-text-dark font-semibold text-md p-4 border-y ">Added date</th>
                                    <th className="bn-text-dark font-semibold text-md p-4 border-y">Price</th>
                                    <th className="bn-text-dark font-semibold text-md p-4 border-y">Quantity</th>
                                    <th className="bn-text-dark font-semibold text-md p-4 border-y">Status</th>
                                </tr>
                            </thead>
                            <tbody className="">
                                {state.post?.map((product, idx) => (                                
                                    <tr key={idx}>
                                        <td className="bn-text-dark p-4 border-b">
                                            <div className="w-fit flex items-center gap-2">
                                                <div className="w-16">
                                                    <img src={product.image} alt="product image" className="w-full h-10 rounded-md shadow-md object-cover"/>
                                                </div>
                                                <div className="text-cldark font-semibold">
                                                    {product.title}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="bn-text-dark p-4 border-b">T-Shirt</td>
                                        <td className="bn-text-dark p-4 border-b">00-00-0000</td>
                                        <td className="bn-text-dark p-4 border-b">$19.99</td>
                                        <td className="bn-text-dark p-4 border-b">200</td>
                                        <td className="bn-text-dark p-4 border-b">Ded</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
            </div>
        </div>
        </>
  );
};

export default Product;
