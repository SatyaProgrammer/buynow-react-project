import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useReducer } from "react";
import { Loading, Stars } from "../../../components";
import {
  INITIAL_STATE,
  ACTION_TYPES,
  productDetailReducer,
} from "./ProductDetailReducer";
import axios from "axios";
import { API_CALL } from "../utils/Constant";
import { Link } from "react-router-dom";
import ProductImages from "../ShopComponents/ProductImages";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ProductDetail = () => {
  const [state, dispatch] = useReducer(productDetailReducer, INITIAL_STATE);
  const pid = useParams().id;
  const cookies = new Cookies();
  const token = cookies.get("jwt_authorization");
  const navigate = new useNavigate();

  const handleFetch = async () => {
    dispatch({ type: ACTION_TYPES.FETCH_START });
    const response = await axios.get(`http://api.localhost/products/${pid}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response && response.data) {
      dispatch({ type: ACTION_TYPES.FETCH_SUCCESS, payload: response.data });

      let inputData = state.size;
      let colorData = state.color;
      for (let i = 0; i < response.data.customization.length; i++) {
        if (response.data.customization[i].type == "Size") {
          inputData = response.data.customization[i].value;
        }
        if (response.data.customization[i].type == "Color") {
          colorData = response.data.customization[i].value;
        }
      }
      dispatch({ type: ACTION_TYPES.SET_SIZE, payload: inputData });
      dispatch({ type: ACTION_TYPES.SET_COLOR, payload: colorData });
    }
  };

  const deleteProduct = async (pid) => {
    let data = JSON.stringify({
      pid: pid,
    });
    try {
      const response = await axios.post(
        `http://api.localhost/products/delete`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${token}`,
          },
        }
      );
      navigate("/sell/product");
    } catch (err) {
      console.log(err);
      if (err?.response.data.error_code == "BX0001") {
        cookies.remove("jwt_authorization");
        navigate("/sell/product");
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

  console.log(state.post.image);

  return (
    <>
      {state.loading ? (
        <div className="p-4 ml-16 md:ml-64 bg-gray-100 flex justify-center items-center transition-full duration-300">
          <Loading />
        </div>
      ) : (
        <div className="p-4 ml-16 md:ml-64 bg-gray-100 flex flex-col gap-4 transition-full duration-300">
          <p className="text-cldark text-4xl font-bold my-4">Product Detail</p>
          <div className="bg-white shadow-md p-4 flex flex-col gap-4">
            <div>
              <div
                onClick={() => navigate(-1)}
                className="btn bg-white cursor-pointer"
              >
                Back
              </div>
            </div>
            <div>
              <div className="grid grid-col-1 lg:grid-cols-5 gap-10 justify-center">
                <div className="col-span-1 lg:col-span-2 flex flex-col justify-between">
                  <ProductImages images={state.post.images?.images} />
                  <div className="flex flex-col gap-2">
                    <div className="w-full border">
                      <Link to={"/sell/product/edit_product/".concat(pid)}>
                        <div className="w-full text-white bg-primary4 flex justify-center py-1 rounded-sm hover:opacity-80 transition-all duration-300">
                          Edit
                        </div>
                      </Link>
                    </div>
                    <div
                      onClick={() => handleDelete(pid)}
                      className="w-full text-white bg-cldanger text-center py-1 rounded-sm hover:opacity-80 transition-all duration-300 cursor-pointer"
                    >
                      Delete
                    </div>
                  </div>
                </div>
                <div className="h-full w-full flex flex-col gap-4 col-span1 lg:col-span-3">
                  <div className="text-3xl font-bold text-cldark">
                    {state.post.name}
                  </div>
                  <div>
                    <div>
                      <Stars stars={state.post.rating} reviews="200" />
                    </div>
                    <div className="text-xl text-primary4">
                      $ {state.post.price}
                    </div>
                  </div>
                  <div className="leading-loose text-grey2">
                    {state.post.description}
                  </div>
                  <div className="flex gap-8">
                    <div className="flex flex-col gap-4 text-grey2 font-bold">
                      <div>Quantity:</div>
                      <div>Category:</div>
                      <div>Delivery Option:</div>
                      <div>Size:</div>
                      <div>Color:</div>
                    </div>
                    <div className="flex flex-col gap-4 text-grey2">
                      <div>{state.post.availability}</div>
                      <div>{state.post.category}</div>
                      <div>{state.post.deliveryOption}</div>
                      <div className="">
                        {state.post.customization?.size
                          ? state.post.customization.size.map((size, idx) => (
                              <span key={idx}>{size}, </span>
                            ))
                          : ""}
                      </div>

                      <div className="flex gap-2">
                        {state.post.customization?.color.map((color, idx) => (
                          <div
                            key={idx}
                            className="w-6 h-6 rounded-full"
                            style={{ background: color }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;
