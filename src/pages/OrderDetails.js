import { PageHero } from "../components";
import { Link } from "react-router-dom";
import DetailColumn from "../components/DetailColumns";
import DetailItem from "../components/DetailItem";
import axios from "axios";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { useReducer } from "react";
import reducer from "../reducers/detail_reducer";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const iniatialState = {
  data: [],
};

const OrderDetails = () => {
  const { id } = useParams();
  const [state, dispatch] = useReducer(reducer, iniatialState);
  const navigate = useNavigate();
  const cookies = new Cookies();
  const token = cookies.get("jwt_authorization");
  const getTracking = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/trackings/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${token}`,
          },
        }
      );
      const data = response.data.orders;
      dispatch({ type: "TRACKING", payload: { data } });
    } catch (error) {
      if (error?.response?.data?.error_code == "BX0001") {
        cookies.remove("jwt_authorization");
        navigate("/login", { replace: true });
      }
    }
  };
  useEffect(() => {
    setTimeout(() => {
      getTracking(id);
    }, 300);
  }, []);
  return (
    <Wrapper>
      <PageHero title="Order History" product="18" />
      <div className="section section-center">
        <DetailColumn />
        {state.data.map((product) => {
          return <DetailItem key={product.pid} {...product} />;
        })}
        <div className="link-container">
          <Link to="/history" className="link-btn">
            back to order history
          </Link>
        </div>
      </div>
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
export default OrderDetails;
