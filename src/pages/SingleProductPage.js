import { useParams, useNavigate, Link } from "react-router-dom";
import { useProductsContext } from "../context/products_context";
import { useEffect } from "react";
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

const SingleProductPage = () => {
  const { id } = useParams();
  const history = useNavigate();

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

  console.log(images);

  return (
    <Wrapper>
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
            {availability > 0 && <AddToCart product={product} />}
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
