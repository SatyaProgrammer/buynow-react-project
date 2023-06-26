import React from "react";
import { useState } from "react";
import styled from "styled-components";
import logo from "../assets/buynowLogo.png";
import { FaBars } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { links } from "../utils/constants";
import CartButtons from "./CartButtons";
import { useProductsContext } from "../context/products_context";
import { SidebarItems } from "../pages/Shop/utils/Constant";
import { FaShoppingCart, FaUserMinus, FaUserPlus } from "react-icons/fa";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const cookies = new Cookies();
  const navigate = new useNavigate();
  const token = cookies.get("jwt_authorization");
  const [dropDown, setDropDown] = useState(false);
  const { openSidebar } = useProductsContext();
  const refreshPage = () => {
    setTimeout(() => {
      window.location.reload(false);
    }, 500);
  };

  const logout = () => {
    cookies.remove("jwt_authorization");
    cookies.remove("isAdmin");
    navigate("/login");
  };

  const login = () => {
    navigate("/login");
  };
  return (
    <NavContainer>
      <div className="container flex items-center justify-between">
        <div className="flex nav-header">
          <Link to="/admin">
            <img src={logo} alt="buy now" className="logo1" />
          </Link>
          <button type="button" className="nav-toggle" onClick={openSidebar}>
            <FaBars />
          </button>
        </div>
        <div className="flex w-fit">
          {token ? (
            <button type="button" className="auth-btn" onClick={logout}>
              Logout <FaUserMinus />
            </button>
          ) : (
            <button type="button" className="auth-btn" onClick={login}>
              Login <FaUserPlus />
            </button>
          )}
        </div>
      </div>
    </NavContainer>
  );
};

const NavContainer = styled.nav`
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  .logo1 {
    height: 51.31px;
  }

  .nav-center {
    width: 90vw;
    margin: 0 auto;
    max-width: var(--max-width);
  }
  .nav-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    img {
      width: 175px;
    }
  }
  .nav-toggle {
    background: transparent;
    border: transparent;
    color: var(--clr-primary-5);
    cursor: pointer;
    svg {
      font-size: 2rem;
    }
  }
  .nav-links {
    display: none;
  }
  .cart-btn-wrapper {
    display: none;
  }
  @media (min-width: 992px) {
    .nav-toggle {
      display: none;
    }
    .nav-center {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
    }
    .nav-links {
      display: flex;
      justify-content: center;
      li {
        margin: 0 0.5rem;
      }
      a {
        color: var(--clr-grey-3);
        font-size: 1rem;
        text-transform: capitalize;
        letter-spacing: var(--spacing);
        padding: 0.5rem;
        &:hover {
          border-bottom: 2px solid var(--clr-primary-7);
        }
      }
    }
    .cart-btn-wrapper {
      display: flex;
      gap: 10%;
    }
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

export default AdminNavbar;
