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

const Navbar = () => {
  const [dropDown, setDropDown] = useState(false);
  const { openSidebar } = useProductsContext();
  const refreshPage = () => {
    setTimeout(() => {
      window.location.reload(false);
    }, 500);
  };
  return (
    <NavContainer>
      <div className="nav-center">
        <div className="nav-header">
          <Link to="/">
            <img src={logo} alt="buy now" className="logo1" />
          </Link>
          <button type="button" className="nav-toggle" onClick={openSidebar}>
            <FaBars />
          </button>
        </div>
        <ul className="nav-links">
          {links.map((link) => {
            const { id, text, url } = link;
            return (
              <li key={id}>
                {id == 1 ? (
                  <NavLink
                    to={url}
                    className={({ isActive }) =>
                      isActive ? "border-b-2 border-primary4" : ""
                    }
                    // onClick={refreshPage}
                  >
                    {text}
                  </NavLink>
                ) : (
                  <>
                    {id == 2 ? (
                      <div
                        // onMouseOver={() => setDropDown(!dropDown)}
                        className="relative cursor-pointer group"
                      >
                        <NavLink
                          to={url}
                          className={({ isActive }) =>
                            isActive ? "border-b-2 border-primary4" : ""
                          }
                        >
                          {text}
                        </NavLink>
                        <div
                          id="dropdown"
                          className="z-10 bg-white divide-y divide-gray-100 py-2 rounded-sm shadow w-44 dark:bg-gray-700 absolute left-0 mt-1 hidden group-hover:block"
                        >
                          <ul
                            className="text-sm text-gray-700 dark:text-gray-200"
                            aria-labelledby="dropdownDefaultButton"
                          >
                            {SidebarItems.map((item, i) => (
                              <li key={i}>
                                <NavLink
                                  to={item.link}
                                  className={({ isActive }) =>
                                    isActive
                                      ? "bg-gray-100 flex p-5 text-lg text-cldark"
                                      : "flex p-5 text-lg text-cldark bg-white"
                                  }
                                >
                                  <li>{item.name}</li>
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <NavLink
                        to={url}
                        className={({ isActive }) =>
                          isActive ? "border-b-2 border-primary4" : ""
                        }
                      >
                        {text}
                      </NavLink>
                    )}
                  </>
                )}
              </li>
            );
          })}
        </ul>
        <CartButtons />
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
      display: grid;
    }
  }
`;

export default Navbar;
