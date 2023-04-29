import React from "react";
import { useFilterContext } from "../context/filter_context";
import GridView from "./GridView";
import ListView from "./ListView";
import styled from "styled-components";

const ProductList = () => {
  const { filtered_products: products, grid_view } = useFilterContext();
  if (products.length < 1) {
    return (
      <Wrapper>
        <h5 style={{ textTransform: "none" }}>
          Sorry, no products matched your search...
        </h5>
      </Wrapper>
    );
  }
  if (grid_view === false) {
    return <ListView products={products} />;
  }
  return <GridView products={products} />;
};

const Wrapper = styled.div`
  h1,
  h2,
  h3,
  h4,
  h5 {
    letter-spacing: var(--spacing);
    text-transform: capitalize;
    line-height: 1.25;
    margin-bottom: 0.75rem;
    font-weight: bold;
  }
  h1 {
    font-size: 2.5rem;
  }
  h2 {
    font-size: 2rem;
  }
  h3 {
    font-size: 1.5rem;
  }
  h4 {
    font-size: 1.25rem;
  }
  h5 {
    font-size: 0.875rem;
  }
  p {
    margin-bottom: 1.25rem;
    color: var(--clr-grey-3);
  }
  @media screen and (min-width: 800px) {
    h1 {
      font-size: 3rem;
    }
    h2 {
      font-size: 2.5rem;
    }
    h3 {
      font-size: 2rem;
    }
    h4 {
      font-size: 1.5rem;
    }
    h5 {
      font-size: 1rem;
    }
    body {
      font-size: 1rem;
    }
    h1,
    h2,
    h3,
    h4 {
      line-height: 1;
    }
  }
`;

export default ProductList;
