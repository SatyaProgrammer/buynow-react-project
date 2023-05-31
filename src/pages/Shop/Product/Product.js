import React from "react";
import { Link } from "react-router-dom";
import { useReducer, useEffect } from "react";
import { productReducer, INITIAL_STATE, ACTION_TYPES } from "./ProductReducer";
import axios from "axios";
import "./Product.css";
import { API_CALL } from "../utils/Constant";
import { IconDelete, IconEdit, IconFile, IconArrowDown } from "../utils/Icons";
import { Loading } from "../../../components";
import { ProductTableHeader, ProductTableData } from "../utils/Constant";
import Cookies from "universal-cookie";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const Product = () => {
  const [state, dispatch] = useReducer(productReducer, INITIAL_STATE);
  const navigate = new useNavigate();
  const cookies = new Cookies();
  const location = new useLocation();
  const token = cookies.get("jwt_authorization");

  const handleFetch = async () => {
    dispatch({ type: ACTION_TYPES.FETCH_START });
    const response = await axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/products/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
      })
      .catch((err) => {
        if (err?.response.data.error_code == "BX0001") {
          cookies.remove("jwt_authorization");
          navigate("/shop/product");
        }
      });
    if (response && response.data) {
      console.log(response.data.products);
      if (response.data.length >= 1) {
        dispatch({
          type: ACTION_TYPES.FETCH_SUCCESS,
          payload: [{ products: { availability: "No product found" } }],
        });
      } else {
        dispatch({ type: ACTION_TYPES.FETCH_SUCCESS, payload: response.data });
      }
    }
  };

  const deleteProduct = async (pid) => {
    let data = JSON.stringify({
      pid: pid,
    });
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/products/delete`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${token}`,
          },
        }
      );
      navigate("/redirect");
    } catch (err) {
      console.log(err);
      if (err?.response.data.error_code == "BX0001") {
        cookies.remove("jwt_authorization");
        navigate("/shop/product");
      }
    }
  };

  const handleDelete = (pid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProduct(pid);
        // Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };

  useEffect(() => {
    handleFetch();
  }, []);

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
            Product
          </p>
          <div className="shadow-md bg-white pt-4">
            <div className="mb-4 p-2 px-4">
              <Link to="/shop/add_product" className="btn">
                Add Product
              </Link>
            </div>
            {/* <div className="p-4 border-t flex items-center sm:justify-between sm:flex-row gap-1 flex-col justify-center">
              <div className="flex items-center gap-1">
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
              </form>
            </div> */}
            <div className="overflow-x-auto table-scrolling">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    {ProductTableHeader.map((th, idx) => (
                      <th
                        key={idx}
                        className="text-cldark text-left font-semibold text-md p-4 border-y name-row whitespace-nowrap"
                      >
                        {th}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {state.post.products ? (
                    state.post.products.map((product, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 ">
                        <td className="text-cldark p-4 border-b overflow-hidden whitespace-nowrap name-row">
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
                          {product.catName}
                        </td>
                        <td className="text-cldark p-4 border-b whitespace-nowrap">
                          ${product.price}
                        </td>
                        <td className="text-cldark p-4 border-b whitespace-nowrap">
                          {product.availability}
                        </td>
                        <td className="text-cldark p-4 border-b whitespace-nowrap">
                          {product.deliveryOption}
                        </td>
                        <td className="text-cldark p-4 border-b whitespace-nowrap">
                          <div className="flex gap-2 items-center">
                            <Link to={"/shop/product/".concat(product.pid)}>
                              <div className="w-5 h-5 hover:scale-110 transition-all duration-300">
                                <IconFile fill="hsl(22, 28%, 45%)" />
                              </div>
                            </Link>
                            <Link
                              to={"/shop/product/edit_product/".concat(
                                product.pid
                              )}
                            >
                              <div className="w-6 h-6 hover:scale-110 transition-all duration-300">
                                <IconEdit fill="hsl(22, 28%, 45%)" />
                              </div>
                            </Link>
                            <div
                              onClick={() => handleDelete(product.pid)}
                              className="w-7 h-7 hover:scale-110 transition-all duration-300"
                            >
                              <IconDelete fill="hsl(22, 28%, 45%)" />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td>No product found</td>
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

export default Product;
