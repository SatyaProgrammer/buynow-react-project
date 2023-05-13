import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useReducer } from "react";
import { ProductImages, Loading, Stars } from "../../../components";
import {
  INITIAL_STATE,
  ACTION_TYPES,
  productDetailReducer,
} from "./ProductDetailReducer";
import axios from "axios";
import { API_CALL } from "../utils/Constant";
import { Link } from "react-router-dom";

const ProductDetail = () => {
  const [state, dispatch] = useReducer(productDetailReducer, INITIAL_STATE);
  const id = useParams().id;
  let images = [];

  const handleFetch = async () => {
    dispatch({ type: ACTION_TYPES.FETCH_START });
    const response = await axios
      .get(API_CALL.SINGLE_PRODUCT.concat(id))
      .catch((err) => {
        // console.log("Error:", err)
      });
    if (response && response.data) {
      dispatch({ type: ACTION_TYPES.FETCH_SUCCESS, payload: response.data });
    }
  };

  useEffect(() => {
    handleFetch();
    images = [state.post.image];
  }, []);

  return (
    <>
      {state.loading ? (
        <Loading />
      ) : (
        <div className="p-4 md:ml-64 bg-gray-100 flex flex-col gap-4 transition-full duration-300">
          <p className="text-cldark text-4xl font-bold my-4">Product Detail</p>

          <div className="bg-white shadow-md p-4 flex flex-col gap-4">
            <div>
              <Link
                to={"/shop/product"}
              >
                <div className="btn">
                  Back
                </div>
              </Link>
            </div>
            <div>
              <div className="flex gap-10">
                <div className="w-96 h-64 ">
                  <img
                    src={state.post.image}
                    alt="product image"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="h-full w-full flex flex-col gap-4">
                  <div className="text-3xl font-bold text-cldark">
                    {state.post.title}
                  </div>
                  <div>
                    <div className="text-xl text-primary4">
                      $ {state.post.price}
                    </div>
                  </div>
                  <div className="leading-loose text-grey2">
                    {state.post.description}
                  </div>
                  <div className="flex gap-8">
                    <div className="flex flex-col gap-4 text-grey2 font-bold">
                      <div>Available:</div>
                      <div>SKU:</div>
                      <div>Brand</div>
                    </div>
                    <div className="flex flex-col gap-4 text-grey2">
                      <div>In stock</div>
                      <div>{state.post.id}</div>
                      <div>{state.post.category}</div>
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
