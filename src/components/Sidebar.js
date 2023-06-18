import React from "react";
import logo from "../assets/buynowLogo.png";
import { Link } from "react-router-dom";
import { useProductsContext } from "../context/products_context";
import { FaTimes } from "react-icons/fa";
import { links } from "../utils/constants";
import styled from "styled-components";
import CartButtons from "./CartButtons";
import { NavLink } from "react-router-dom";
import { SidebarItems } from "../pages/Shop/utils/Constant";
import { useState } from "react";
import { IconArrowDown } from "../pages/Shop/utils/Icons";

const Sidebar = () => {
  const { isSidebarOpen, closeSidebar } = useProductsContext();
  const [dropDown, setDropDown] = useState(false)
  return (
    <SidebarContainer>
      <aside
        className={`${isSidebarOpen ? "sidebar show-sidebar" : "sidebar"}`}
      >
        <div className="sidebar-header">
          <img src={logo} alt="buy now" className="logo" />
          <button className="close-btn" type="button" onClick={closeSidebar}>
            <FaTimes />
          </button>
        </div>
        <ul className="links">
          {links.map(({ id, text, url }) => {
            return (
              <li key={id}>
                {id == 2 ? (
                  <div
                    onClick={() => setDropDown(!dropDown)}
                    className="relative cursor-pointer"
                  >
                    <Link to={url}>
                      <div className="flex justify-between items-center">
                        {text}
                        <div
                          className={
                            dropDown ? "w-6 h-6 rotate-180" : "w-6 h-6"
                          }
                        >
                          <IconArrowDown />
                        </div>
                      </div>
                    </Link>
                    <div
                      id="dropdown"
                      className={
                        dropDown
                          ? "bg-white py-2"
                          : "hidden"
                      }
                    >
                      <ul
                        className="text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownDefaultButton"
                      >
                        {SidebarItems.map((item, i) => (
                          <li key={i}>
                            <Link
                              onClick={closeSidebar}
                              to={item.link}
                              className="flex p-2 text-lg text-cldark bg-white"
                            >
                              <div className="flex">
                                <div className="w-8"></div>
                                {item.name}
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <Link to={url} onClick={closeSidebar}>
                    {text}
                  </Link>
                )}
              </li>
            );
          })}
          <li>
            <Link to="/checkout" onClick={closeSidebar}>
              checkout
            </Link>
          </li>
        </ul>
        <CartButtons />
      </aside>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div`
  text-align: center;
  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
  }
  .close-btn {
    font-size: 2rem;
    background: transparent;
    border-color: transparent;
    color: var(--clr-primary-5);
    transition: var(--transition);
    cursor: pointer;
    color: var(--clr-red-dark);
    margin-top: 0.2rem;
  }
  .close-btn:hover {
    color: var(--clr-red-light);
  }
  .logo {
    justify-self: center;
    width: 175px;
    height: 51.31px;
  }
  .links {
    margin-bottom: 2rem;
  }
  .links a {
    display: block;
    text-align: left;
    font-size: 1rem;
    text-transform: capitalize;
    padding: 1rem 1.5rem;
    color: var(--clr-grey-3);
    transition: var(--transition);
    letter-spacing: var(--spacing);
  }

  .links a:hover {
    padding: 1rem 1.5rem;
    padding-left: 2rem;
    background: var(--clr-grey-10);
    color: var(--clr-grey-2);
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--clr-white);
    transition: var(--transition);
    transform: translate(-100%);
    z-index: -1;
  }
  .show-sidebar {
    transform: translate(0);
    z-index: 999;
  }
  .cart-btn-wrapper {
    margin: 2rem auto;
  }
  @media screen and (min-width: 992px) {
    .sidebar {
      display: none;
    }
  }
`;

export default Sidebar;
