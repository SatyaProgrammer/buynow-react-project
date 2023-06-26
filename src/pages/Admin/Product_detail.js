import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect, useReducer } from "react";
import { Loading, Stars } from "../../components";
import {
  INITIAL_STATE,
  ACTION_TYPES,
  productDetailReducer,
} from "./ProductDetailReducer";
import axios from "axios";
import { Link } from "react-router-dom";
import ProductImages from "../Shop/ShopComponents/ProductImages";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Product_detail = () => {
  const [state, dispatch] = useReducer(productDetailReducer, INITIAL_STATE);
  const uid = useParams().uid;
  const pid = useParams().pid;
  const cookies = new Cookies();
  const token = cookies.get("jwt_authorization");
  const navigate = new useNavigate();

  const [singleProduct, setSingleProduct] = useState();
  const [reivewComment, setReviewComment] = useState();
  const handleFetch = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/users/${uid}/products`
      );
      if (response) {
        response.data.products.map((product) => {
          if (product.pid == pid) {
            setSingleProduct(product);
          }
        });
      }
    } catch (error) {
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/reviews/${pid}`
      );

      if (response && response.data) {
        setReviewComment(response.data);
      }
    } catch (error) {
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
      navigate("/sell/product");
    } catch (err) {
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

  return (
    <>
      {state.loading ? (
        //  ml-16 md:ml-64
        <div className="p-4 sm:ml-16 bg-gray-100 flex justify-center items-center transition-full duration-300">
          <Loading />
        </div>
      ) : (
        //  ml-16 md:ml-64
        <div className="p-4 bg-gray-100 transition-full duration-300">
          <div className=" flex flex-col gap-4 container">
            <p className="text-cldark text-4xl font-bold my-4">
              Product Detail
            </p>
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
                  <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
                    {singleProduct?.images.images ? (
                      <ProductImages images={singleProduct?.images.images} />
                    ) : (
                      ""
                    )}
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
                      {singleProduct?.name}
                    </div>
                    <div>
                      <div>
                        <Stars stars={singleProduct?.rating} reviews="200" />
                      </div>
                      <div className="text-xl text-primary4">
                        $ {singleProduct?.price}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="text-xl text-cldark">Review comments</div>
                      <div className=" overflow-y-scroll dropdown-scrolling p-2 border-2 rounded-md max-h-80">
                        {reivewComment?.reviews?.length >= 1 ? (
                          reivewComment.reviews.map((review, idx) => (
                            <div
                              key={idx}
                              className="border rounded-md p-4 py-2"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="text-lg">{review.username}</div>
                                <div className="flex items-center justify-center">
                                  <Stars stars={review.rating} />
                                </div>
                              </div>
                              <div className="text-md text-gray-600">
                                {review.comment}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div>No review</div>
                        )}
                      </div>
                    </div>
                    <div className="leading-loose text-grey2">
                      {singleProduct?.description}
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
                        <div>{singleProduct?.availability}</div>
                        <div>{singleProduct?.catName}</div>
                        <div>{singleProduct?.deliveryOption}</div>
                        <div className="">
                          {singleProduct?.customization?.size
                            ? singleProduct?.customization.size.map(
                                (size, idx) => <span key={idx}>{size}, </span>
                              )
                            : ""}
                        </div>

                        <div className="flex gap-2">
                          {singleProduct?.customization?.color.map(
                            (color, idx) => (
                              <div
                                key={idx}
                                className="w-6 h-6 rounded-full"
                                style={{ background: color }}
                              ></div>
                            )
                          )}
                        </div>
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

export default Product_detail;
