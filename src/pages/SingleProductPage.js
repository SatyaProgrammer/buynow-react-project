import { useParams, useNavigate, Link } from "react-router-dom";
import { useProductsContext } from "../context/products_context";
import { useEffect, useState } from "react";
import {
  Loading,
  Error,
  PageHero,
  ProductImages,
  Stars,
  AddToCart,
} from "../components";
import styled from "styled-components";
import { formatPrice } from "../utils/helpers";
import RatingModal from "../components/RatingModal/RatingModal";
import Navbar from "../components/Navbar";
import { IconCross } from "./Shop/utils/Icons";
import { IconContext } from "react-icons";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";
import "../components/RatingModal/RatingModal.css";
import axios from "axios";
import Cookies from "universal-cookie";
import Swal from "sweetalert2";

const SingleProductPage = () => {
  const cookies = new Cookies();
  const token = cookies.get("jwt_authorization");
  const navigate = new useNavigate();
  const { id } = useParams();
  const history = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [ratingComment, setRatingComment] = useState("");
  const [productRating, setProductRating] = useState([
    true,
    false,
    false,
    false,
    false,
  ]);
  const [comment, setComment] = useState("");

  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [myRating, setMyRating] = useState();
  const [haveRating, setHaveRating] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const getModal = async () => {
    if (!token) {
      navigate("/login");
    } else {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/reviews/${id}/me`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${token}`,
            },
          }
        );
        if (response && response.data) {
          let inputData = productRating;
          for (let i = 0; i < 5; i++) {
            if (i < response.data.rating) {
              inputData[i] = true;
            } else {
              inputData[i] = false;
            }
          }
          setProductRating(inputData);
          setComment(response.data.comment);
          setHaveRating(response.data.id);
        }
        setOpenModal(true);
      } catch (error) {
        if (error.response.data.error_code == "BX0001") {
          navigate("/login");
        }
        setOpenModal(true);
      }
    }
  };

  const [reivewComment, setReviewComment] = useState([]);
  const getCommentModal = async () => {
    setOpenCommentModal(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/reviews/${id}`
      );

      if (response && response.data) {
        setReviewComment(response.data);
      }
    } catch (error) {}
  };

  const onClose = () => {
    setOpenModal(false);
    setOpenCommentModal(false);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    let ratingInput = 0;
    for (let i = 0; i < productRating.length; i++) {
      if (productRating[i] === true) {
        ratingInput++;
      }
    }
    let data = JSON.stringify({
      rating: ratingInput,
      comment: comment,
    });
    try {
      if (haveRating) {
        const response = await axios.patch(
          `${process.env.REACT_APP_BACKEND_URL}/reviews/${id}/${haveRating}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${token}`,
            },
          }
        );
      } else {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/reviews/${id}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${token}`,
            },
          }
        );
      }
      setSubmitting(false);
      // openModal(false)
      Swal.fire({
        title: "Product rated",
        text: "Thanks for your feedback",
        icon: "success",
        confirmButtonColor: "#936a53",
        confirmButtonText: "Close",
      });
    } catch (err) {
      if (err?.response.data.error_code == "BX0001") {
        cookies.remove("jwt_authorization");
        navigate("/login", { replace: true });
      }
      setSubmitting(false);
    }
  };

  const {
    single_product_loading: loading,
    single_product_error: error,
    single_product: product,
    fetchSingleProduct,
  } = useProductsContext();

  useEffect(() => {
    fetchSingleProduct(`${process.env.REACT_APP_BACKEND_URL}/products/${id}`);
  }, [id]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        history("/");
      }, 3000);
    }
  }, [error]);

  const {
    name,
    price,
    description,
    availability,
    rating,
    images,
    deliveryOption,
    owner,
    category,
    ownerId,
  } = product;

  const [vendorInfo, setVenderInfo] = useState([]);
  const fetchVenderInfo = async (ownerID) => {
    if (ownerID) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/users/${ownerID}`
        );
        if (response) {
          console.log(response.data);
          setVenderInfo(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchVenderInfo(ownerId);
  }, [product]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <Wrapper>
      {/* <PageHero title={name} /> */}
      <div onClick={onClose} className={openModal ? "overlay" : "hidden"}>
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="modalContainer p-4 flex flex-col "
        >
          <div className="w-full flex justify-end">
            <div
              onClick={onClose}
              className="w-6 h-6 hover:scale-110 transition-all duration-300 cursor-pointer"
            >
              <IconCross />
            </div>
          </div>
          <div className="w-full flex-1 flex flex-col gap-4">
            <div className="text-center text-lg text-cldark">
              Rate this product
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-full flex items-center justify-center gap-4">
                {productRating.map((star, idx) => (
                  <div key={idx}>
                    <div>
                      {productRating[idx] ? (
                        <IconContext.Provider
                          value={{ color: "hsl(22, 28%, 45%)", size: "50px" }}
                        >
                          <BsStarFill
                            onClick={() => {
                              let inputData = [
                                false,
                                false,
                                false,
                                false,
                                false,
                              ];
                              for (let i = 0; i < inputData.length; i++) {
                                if (i <= idx) {
                                  inputData[i] = true;
                                } else inputData[i] = false;
                              }
                              setProductRating(inputData);
                            }}
                            className="hover:scale-110 transition-all duration-300"
                          />
                        </IconContext.Provider>
                      ) : (
                        <IconContext.Provider
                          value={{ color: "hsl(22, 28%, 45%)", size: "50px" }}
                        >
                          <BsStar
                            onClick={() => {
                              let inputData = [
                                false,
                                false,
                                false,
                                false,
                                false,
                              ];
                              for (let i = 0; i < inputData.length; i++) {
                                if (i <= idx) {
                                  inputData[i] = true;
                                } else inputData[i] = false;
                              }
                              setProductRating(inputData);
                            }}
                            className="hover:scale-110 transition-all duration-300"
                          />
                        </IconContext.Provider>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-xl font-semibold text-cldark">Review</div>
              <textarea
                type="text"
                placeholder="Product feedback"
                required
                onChange={(e) => setComment(e.target.value)}
                name="description"
                value={comment}
                rows="4"
                className="w-full border border-gray-300 rounded-lg p-3 text-cldark focus:outline focus:outline-1"
              />
            </div>
          </div>
          <div className=" mt-4 w-full flex justify-center">
            {submitting ? (
              <div className="btn">Submitting...</div>
            ) : (
              <button onClick={handleSubmit} className="btn">
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
      <div
        onClick={onClose}
        className={openCommentModal ? "overlay" : "hidden"}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="modalContainer p-4 flex flex-col "
        >
          <div className="w-full flex justify-end">
            <div
              onClick={onClose}
              className="w-6 h-6 hover:scale-110 transition-all duration-300 cursor-pointer"
            >
              <IconCross />
            </div>
          </div>
          <div className="w-full h-80 flex flex-col gap-4">
            {haveRating ? "" : ""}
            <div className="text-2xl font-semibold text-gray-600 underline text-center">
              User review
            </div>
            <div className=" overflow-y-scroll dropdown-scrolling p-2">
              {reivewComment.reviews?.length >= 1 ? (
                reivewComment.reviews.map((review, idx) => (
                  <div key={idx} className="border-2 rounded-lg p-4 py-2">
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
        </div>
      </div>
      <Navbar />
      <PageHero title={name} product={product} />
      <div className="section section-center">
        <Link to="/" className="btn">
          back to products
        </Link>
        <div className="product-center">
          <ProductImages images={images} />
          <section>
            <div className="flex gap-2">
              <h2>{name}</h2>
            </div>
            <Stars stars={rating} reviews={deliveryOption} />
            <h5 className="price">{formatPrice(price)}</h5>
            <p className="desc">{description}</p>
            <p className="info">
              <span>Available : </span>
              {availability > 0 ? "In stock" : "out of stock"}
            </p>
            <p className="info">
              <span>Category : </span>
              {category}
            </p>
            <p className="info">
              <span>Vendor : </span>
              {owner}
            </p>
            <p className="info">
              <span>Delivery option: </span>
              {deliveryOption}
            </p>
            {console.log("urah: ", vendorInfo)}
            <div className="info">
              <span>Contact information: </span>
              <div>
                {vendorInfo.contactInfo
                  ? Object.keys(vendorInfo.contactInfo).map((keyName, i) => (
                      <div key={i} className="flex gap-2">
                        {keyName}:{" "}
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href={vendorInfo.contactInfo[keyName]}
                          className="text-blue-500 underline"
                        >
                          {vendorInfo.contactInfo[keyName]}
                        </a>
                      </div>
                    ))
                  : ""}
              </div>
            </div>
            <div className="flex gap-2">
              <div onClick={() => getCommentModal()} className="btn">
                View ratings
              </div>

              <div onClick={() => getModal()} className="btn">
                Rate product
              </div>
            </div>
            <p className="info"></p>
            <hr />
            {availability > 0 ? (
              <AddToCart product={product} />
            ) : (
              <h2 style={{ marginTop: "2rem", color: "hsl(360, 67%, 44%)" }}>
                Out of Stock
              </h2>
            )}
            {/* {availability > 0 && <AddToCart product={product} />} */}
          </section>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  h2 {
    font-weight: 600;
  }
  .product-center {
    display: grid;
    gap: 4rem;
    margin-top: 2rem;
  }
  .price {
    color: var(--clr-primary-5);
  }
  .desc {
    line-height: 2;
    max-width: 45em;
  }
  .info {
    text-transform: capitalize;
    width: 400px;
    display: grid;
    grid-template-columns: 180px 1fr;
    span {
      font-weight: 700;
    }
  }

  @media (min-width: 992px) {
    .product-center {
      grid-template-columns: 1fr 1fr;
      align-items: center;
    }
    .price {
      font-size: 1.25rem;
    }
  }
`;

export default SingleProductPage;
