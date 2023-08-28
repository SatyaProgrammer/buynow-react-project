import React from "react";
import styled from "styled-components";
import { useCartContext } from "../context/cart_context";
import { formatPrice } from "../utils/helpers";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CartTotals = () => {
  const cookies = new Cookies();
  const data = cookies.get("jwt_authorization");
  const { total_amount, shipping_fee, cart, clearCart } = useCartContext();
  const navigate = useNavigate();
  const token = cookies.get("jwt_authorization");

  const checkOutModal = () => {
    Swal.fire({
      title: "Please confirm your order !",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "hsl(22, 31%, 52%)",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm",
    }).then((result) => {
      if (result.isConfirmed) {
        orderProducts();
        clearCart();
        navigate("/history");
        // Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };
  const orderProducts = async (e) => {
    // e.preventDefault();
    let data = cart.map((product) => {
      return { pid: product.pid, quantity: product.amount };
    });
    console.log(data);
    data = JSON.stringify({ orders: data });
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/trackings`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${token}`,
          },
        }
      );
    } catch (error) {
      if (error?.response.data.error_code == "BX0001") {
        cookies.remove("jwt_authorization");
        navigate("/shop/login", { replace: true });
      }
    }
  };

  return (
    <Wrapper>
      <div>
        <article>
          <h5>
            subtotal : <span>{formatPrice(total_amount)}</span>
          </h5>
          <p>
            shipping fee : <span>{formatPrice(shipping_fee)}</span>
          </p>
          <hr />
          <h4>
            order total :{" "}
            <span>{formatPrice(total_amount + shipping_fee)}</span>
          </h4>
        </article>
        {data ? (
          <Link className="btn" onClick={checkOutModal}>
            proceed to checkout
          </Link>
        ) : (
          <Link to="/login" className="btn">
            Please login
          </Link>
        )}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  margin-top: 3rem;
  display: flex;
  justify-content: center;
  article {
    border: 1px solid var(--clr-grey-8);
    border-radius: var(--radius);
    padding: 1.5rem 3rem;
  }
  h4,
  h5,
  p {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
  p {
    text-transform: capitalize;
  }
  h4 {
    margin-top: 2rem;
  }
  @media (min-width: 776px) {
    justify-content: flex-end;
  }
  .btn {
    width: 100%;
    margin-top: 1rem;
    text-align: center;
    font-weight: 700;
  }
`;

export default CartTotals;
