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

const SingleProductPage = () => {
  const { id } = useParams();
  const history = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [productRating, setProductRating] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  const onClose = () => {
    setOpenModal(false);
  };

  const {
    single_product_loading: loading,
    single_product_error: error,
    single_product: product,
    fetchSingleProduct,
  } = useProductsContext();

  useEffect(() => {
    fetchSingleProduct(`http://api.localhost/products/${id}`);
  }, [id]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        history("/");
      }, 3000);
    }
  }, [error]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

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
  } = product;

  return (
    <Wrapper>
      {/* <PageHero title={name} /> */}
      {/* <div onClick={onClose} className={openModal ? "overlay" : "hidden"}>
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="modalContainer p-4 flex flex-col "
        >
          <div className="w-full flex justify-end">
            <div
              onClick={onClose}
              className="w-6 h-6 hover:scale-110 transition-all duration-300"
            >
              <IconCross />
            </div>
          </div>
          <div className="w-full flex-1">
            <div className="text-center text-lg text-cldark my-4">
              Rate this product
            </div>
            <div className="w-full flex items-center justify-center gap-4">
              {productRating.map((star, idx) => (
                <div key={idx}>
                  {productRating[idx] ? (
                    <IconContext.Provider
                      value={{ color: "green", size: "50px" }}
                    >
                      <BsStarFill
                        onClick={() => {
                          let inputData = [false, false, false, false, false];
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
                      value={{ color: "green", size: "50px" }}
                    >
                      <BsStar
                        onClick={() => {
                          let inputData = [false, false, false, false, false];
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
              ))}
            </div>
          </div>
        </div>
      </div> */}
      <Navbar />
      <PageHero title={name} product={product} />
      <div className="section section-center">
        <Link to="/" className="btn">
          back to products
        </Link>
        <div className="product-center">
          <ProductImages images={images} />
          <section>
            <h2>{name}</h2>
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
            <hr />
            {availability > 0 ? (
              <AddToCart product={product} />
            ) : (
              <h2 style={{ marginTop: "2rem", color: "hsl(22, 28%, 45%)" }}>
                Out of Stock
              </h2>
            )}
            {/* {availability > 0 && <AddToCart product={product} />} */}
            <div onClick={() => setOpenModal(true)}>Rate product</div>
          </section>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  h2 {
    font-weight: bold;
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
    width: 300px;
    display: grid;
    grid-template-columns: 125px 1fr;
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
