import React, { useState } from "react";
import { FaShoppingCart, FaUserMinus, FaUserPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useProductsContext } from "../context/products_context";
import { useCartContext } from "../context/cart_context";
import Cookies from "universal-cookie";

const CartButtons = () => {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const { closeSidebar } = useProductsContext();
  const { total_items } = useCartContext();
  const data = cookies.get("jwt_authorization");

  const logout = () => {
    cookies.remove("jwt_authorization");
    navigate("/login");
  };

  const login = () => {
    navigate("/login");
  };

  const [dropDown, setDropDown] = useState(false);

  return (
    <Wrapper className={data ? "cart-btn-wrapper" : "cart-btn-wrapper"}>
      <Link to="/cart" className="cart-btn" onClick={closeSidebar}>
        Cart
        <span className="cart-container">
          <FaShoppingCart />
          <span className="cart-value">{total_items}</span>
        </span>
      </Link>
      {data ? (
        <div
          onClick={() => setDropDown(!dropDown)}
          className="relative cursor-pointer"
        >
          <div className="flex gap-2 items-center">
            <div className="cart-btn">Username</div>
            <div className="rounded-full w-10 h-10 bg-gray-200"></div>
          </div>
          <div
            id="dropdown"
            class={
              dropDown
                ? "z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute right-0 mt-1"
                : "hidden"
            }
          >
            <ul
              class="text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownDefaultButton"
            >
              <li>
                <Link
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  to="/profile"
                >
                  View Profile
                </Link>
                {/* <a
                  href=
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  View Profile
                </a> */}
              </li>
              <li>
                <a
                  href="#"
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={logout}
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button type="button" className="auth-btn" onClick={login}>
          Login <FaUserPlus />
        </button>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  width: 225px;
  gap: 1.5rem;

  .cart-btn {
    color: var(--clr-grey-1);
    font-size: 1.5rem;
    letter-spacing: var(--spacing);
    color: var(--clr-grey-1);
    display: flex;
    align-items: center;
  }
  .cart-container {
    display: flex;
    align-items: center;
    position: relative;
    svg {
      height: 1.6rem;
      margin-left: 5px;
    }
  }
  .cart-value {
    position: absolute;
    top: -10px;
    right: -16px;
    background: var(--clr-primary-5);
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 0.75rem;
    color: var(--clr-white);
    padding: 12px;
  }
  .auth-btn {
    display: flex;
    align-items: center;
    background: transparent;
    border-color: transparent;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--clr-grey-1);
    letter-spacing: var(--spacing);
    svg {
      margin-left: 5px;
    }
  }
`;

export default CartButtons;
