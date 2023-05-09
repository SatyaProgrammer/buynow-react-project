import React from "react";
import "./ShopSidebar.css";
import { NavLink } from "react-router-dom";
import { IconBag } from "../utils/Icons";
import { SidebarItems } from "../utils/Constant";

function ShopSidebar() {
  return (
    <>
      <button
        data-drawer-target="sidebar-multi-level-sidebar"
        data-drawer-toggle="sidebar-multi-level-sidebar"
        aria-controls="sidebar-multi-level-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="sidebar-multi-level-sidebar"
        className="absolute left-0 z-40 w-64 transition-transform -translate-x-full md:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full overflow-y-auto bg-primary dark:bg-gray-800">
          <ul className="font-medium">
            {SidebarItems.map((item) => (
              <li>
                <NavLink to={item.link} className={({isActive}) => isActive ? 'bg-gray-100 flex p-5 text-lg text-cldark hover:bg-gray-100 transition-all duration-300' : 'flex p-5 text-lg text-cldark hover:bg-gray-100 transition-all duration-300 bg-white'}>
                  <div className="flex flex-wrap gap-2">
                    <div className="w-6 h-6">
                      {item.icon}
                    </div>
                    <div className="capitalize">
                      {item.name}
                    </div>
                  </div>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}

export default ShopSidebar;
