import React, { useEffect, useReducer } from "react";
import styled from "styled-components";
import { useCartContext } from "../context/cart_context";
import { Link } from "react-router-dom";
import HistoryColumns from "./HistoryColumns";
import CartItem from "./CartItem";
import CartTotals from "./CartTotals";
import { useNavigate } from "react-router-dom";
import reducer from "../reducers/history_reducer";
import axios from "axios";
import Cookies from "universal-cookie";
import HistoryItem from "./HistoryItem";

const initialState = {
  trackings: [],
};

const HistoryContent = () => {
  // get all tracking data
  const navigate = useNavigate();
  const cookies = new Cookies();
  const token = cookies.get("jwt_authorization");
  const [state, dispatch] = useReducer(reducer, initialState);
  const getTrackings = async () => {
    try {
      const response = await axios.get("http://api.localhost/trackings", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
      });
      const data = response.data.trackings;
      dispatch({ type: "TRACKINGS", payload: { data } });
    } catch (error) {
      if (error?.response?.data?.error_code == "BX0001") {
        cookies.remove("jwt_authorization");
        navigate("/login", { replace: true });
      }
    }
  };
  useEffect(() => {
    getTrackings();
  }, []);
  console.log(state.trackings);
  return (
    <Wrapper className="section section-center">
      <HistoryColumns />
      {state.trackings.map((tracking) => {
        return <HistoryItem key={tracking.id} {...tracking} {...state} />;
      })}
      {/* {cart.map((item) => {
        return <CartItem key={item.id} {...item} />;
      })}
      <hr />
      <div className="link-container">
        <Link to="/" className="link-btn">
          continue shopping
        </Link>
        <button
          type="button"
          className="link-btn clear-btn"
          onClick={clearCart}
        >
          clear shopping cart
        </button>
      </div>
      <CartTotals /> */}
    </Wrapper>
  );
};
const Wrapper = styled.section`
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
  .link-container {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
  }
  .link-btn {
    background: transparent;
    border-color: transparent;
    text-transform: capitalize;
    padding: 0.25rem 0.5rem;
    background: var(--clr-primary-5);
    color: var(--clr-white);
    border-radius: var(--radius);
    letter-spacing: var(--spacing);
    font-weight: 400;
    cursor: pointer;
  }
  .clear-btn {
    background: var(--clr-black);
  }
`;
export default HistoryContent;
