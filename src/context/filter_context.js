import React, { useEffect, useContext, useReducer } from "react";
import reducer from "../reducers/filter_reducer";
import axios from "axios";
import {
  LOAD_PRODUCTS,
  SET_GRIDVIEW,
  SET_LISTVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from "../actions";
import { useProductsContext } from "./products_context";
import { logRoles } from "@testing-library/react";

const initialState = {
  filtered_products: [],
  all_products: [],
  grid_view: true,
  filter: false,
  sort: "price-lowest",
  filters: {
    text: "",
    ownerName: "all",
    catName: "all",
    color: "all",
    min_price: 0,
    max_price: 0,
    price: 0,
    shipping: false,
  },
};

const FilterContext = React.createContext();

export const FilterProvider = ({ children }) => {
  const { products } = useProductsContext();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: LOAD_PRODUCTS, payload: products });
  }, [products]);

  const setGridView = () => {
    dispatch({ type: SET_GRIDVIEW });
  };

  const setListView = () => {
    dispatch({ type: SET_LISTVIEW });
  };

  useEffect(() => {
    if (state.filter) {
      // Search product and filter category
      if (
        state.filters.text &&
        state.filters.catName !== "all" &&
        state.filters.ownerName === "all" &&
        state.filters.price === state.filters.max_price
      ) {
        const filterTextAndCategory = async () => {
          const response = await fetch(
            `http://api.localhost/products/matching?name=m${state.filters.text}&catName=m${state.filters.catName}`
          );
          return await response.json();
        };
        filterTextAndCategory().then((result) => {
          dispatch({ type: FILTER_PRODUCTS, textAndCategory: { result } });
        });
      }
      // Filter category
      if (
        state.filters.catName !== "all" &&
        !state.filters.text &&
        state.filters.ownerName === "all" &&
        state.filters.price === state.filters.max_price
      ) {
        const filterCategory = async () => {
          const response = await fetch(
            `http://api.localhost/products/matching?catName=m${state.filters.catName}`
          );
          return await response.json();
        };
        filterCategory().then((result) => {
          dispatch({ type: FILTER_PRODUCTS, category: { result } });
        });
      }
      // Search Product
      if (
        state.filters.text &&
        state.filters.catName === "all" &&
        state.filters.ownerName === "all" &&
        state.filters.price === state.filters.max_price
      ) {
        const searchProducts = async () => {
          const response = await fetch(
            `http://api.localhost/products/matching?name=m${state.filters.text}`
          );
          return await response.json();
        };
        searchProducts().then((result) => {
          dispatch({ type: FILTER_PRODUCTS, text: { result } });
        });
      }
      // Filter vendor
      if (
        state.filters.ownerName !== "all" &&
        state.filters.catName === "all" &&
        !state.filters.text &&
        state.filters.price === state.filters.max_price
      ) {
        const filterVendor = async () => {
          const response = await fetch(
            `http://api.localhost/products/matching?ownerName=m${state.filters.ownerName}`
          );
          return await response.json();
        };
        filterVendor().then((result) => {
          dispatch({ type: FILTER_PRODUCTS, ownerName: { result } });
        });
      }
      // Filter vendor and category
      if (
        state.filters.ownerName !== "all" &&
        state.filters.catName !== "all" &&
        !state.filters.text &&
        state.filters.price === state.filters.max_price
      ) {
        const filterVendorAndCategory = async () => {
          const response = await fetch(
            `http://api.localhost/products/matching?catName=m${state.filters.catName}&ownerName=m${state.filters.ownerName}`
          );
          return await response.json();
        };
        filterVendorAndCategory().then((result) => {
          dispatch({ type: FILTER_PRODUCTS, ownerNameAndCategory: { result } });
        });
      }
      // Filter vendor and search product
      if (
        state.filters.ownerName !== "all" &&
        state.filters.catName === "all" &&
        state.filters.text &&
        state.filters.price === state.filters.max_price
      ) {
        const filterVendorAndText = async () => {
          const response = await fetch(
            `http://api.localhost/products/matching?name=m${state.filters.text}&ownerName=m${state.filters.ownerName}`
          );
          return await response.json();
        };
        filterVendorAndText().then((result) => {
          dispatch({
            type: FILTER_PRODUCTS,
            ownerNameAndSearch: { result },
          });
        });
      }
      // Filter vendor and category and search product
      if (
        state.filters.ownerName !== "all" &&
        state.filters.catName !== "all" &&
        state.filters.text &&
        state.filters.price === state.filters.max_price
      ) {
        const filterVendorAndTextAndCategory = async () => {
          const response = await fetch(
            `http://api.localhost/products/matching?name=m${state.filters.text}&ownerName=m${state.filters.ownerName}&catName=m${state.filters.catName}`
          );
          return await response.json();
        };
        filterVendorAndTextAndCategory().then((result) => {
          dispatch({
            type: FILTER_PRODUCTS,
            ownerNameAndSearchAndCategory: { result },
          });
        });
      }
      console.log(
        state.filters.ownerName,
        state.filters.catName,
        state.filters.text,
        state.filters.price
      );
      // Filter price
      if (
        state.filters.ownerName === "all" &&
        state.filters.catName === "all" &&
        !state.filters.text &&
        state.filters.price
      ) {
        if (isFinite(state.filters.price)) {
          const filterPrice = async () => {
            const response = await fetch(
              `http://api.localhost/products/matching?price=r${0}-${
                state.filters.price
              }`
            );
            return await response.json();
          };
          filterPrice().then((result) => {
            console.log(result);
            dispatch({
              type: FILTER_PRODUCTS,
              price: { result },
            });
          });
        }
        dispatch({ type: FILTER_PRODUCTS });
      }
      // Filter price and vendor
      if (
        state.filters.ownerName !== "all" &&
        state.filters.catName === "all" &&
        !state.filters.text &&
        state.filters.price !== state.filters.max_price
      ) {
        if (isFinite(state.filters.price)) {
          const filterPriceAndVendor = async () => {
            const response = await fetch(
              `http://api.localhost/products/matching?ownerName=m${
                state.filters.ownerName
              }&price=r${0}-${state.filters.price}`
            );
            return await response.json();
          };
          filterPriceAndVendor().then((result) => {
            console.log(result);
            dispatch({
              type: FILTER_PRODUCTS,
              priceAndVendor: { result },
            });
          });
        }
        dispatch({ type: FILTER_PRODUCTS });
      }
      // Filter price and category
      if (
        state.filters.ownerName === "all" &&
        state.filters.catName !== "all" &&
        !state.filters.text &&
        state.filters.price !== state.filters.max_price
      ) {
        if (isFinite(state.filters.price)) {
          const filterPriceAndCategory = async () => {
            const response = await fetch(
              `http://api.localhost/products/matching?catName=m${
                state.filters.catName
              }&price=r${0}-${state.filters.price}`
            );
            return await response.json();
          };
          filterPriceAndCategory().then((result) => {
            console.log(result);
            dispatch({
              type: FILTER_PRODUCTS,
              priceAndCategory: { result },
            });
          });
        }
        dispatch({ type: FILTER_PRODUCTS });
      }
      // Filter price and search
      if (
        state.filters.ownerName === "all" &&
        state.filters.catName === "all" &&
        state.filters.text &&
        state.filters.price !== state.filters.max_price
      ) {
        if (isFinite(state.filters.price)) {
          const filterPriceAndText = async () => {
            const response = await fetch(
              `http://api.localhost/products/matching?price=r${0}-${
                state.filters.price
              }&name=m${state.filters.text}`
            );
            return await response.json();
          };
          filterPriceAndText().then((result) => {
            console.log(result);
            dispatch({
              type: FILTER_PRODUCTS,
              priceAndText: { result },
            });
          });
        }
        dispatch({ type: FILTER_PRODUCTS });
      }
      // Filter price and vendor and category
      if (
        state.filters.ownerName !== "all" &&
        state.filters.catName !== "all" &&
        !state.filters.text &&
        state.filters.price !== state.filters.max_price
      ) {
        if (isFinite(state.filters.price)) {
          const filterPriceAndVendorAndCategory = async () => {
            const response = await fetch(
              `http://api.localhost/products/matching?catName=m${
                state.filters.catName
              }&ownerName=m${state.filters.ownerName}&price=r${0}-${
                state.filters.price
              }`
            );
            return await response.json();
          };
          filterPriceAndVendorAndCategory().then((result) => {
            console.log(result);
            dispatch({
              type: FILTER_PRODUCTS,
              priceAndCatAndOwner: { result },
            });
          });
        }
        dispatch({ type: FILTER_PRODUCTS });
      }
      // Filter price and vendor and search
      if (
        state.filters.ownerName !== "all" &&
        state.filters.catName === "all" &&
        state.filters.text &&
        state.filters.price !== state.filters.max_price
      ) {
        if (isFinite(state.filters.price)) {
          const filterPriceAndVendorAndSearch = async () => {
            const response = await fetch(
              `http://api.localhost/products/matching?name=m${
                state.filters.text
              }&ownerName=m${state.filters.ownerName}&price=r${0}-${
                state.filters.price
              }`
            );
            return await response.json();
          };
          filterPriceAndVendorAndSearch().then((result) => {
            console.log(result);
            dispatch({
              type: FILTER_PRODUCTS,
              priceAndSearchAndOwner: { result },
            });
          });
        }
        dispatch({ type: FILTER_PRODUCTS });
      }
      // Filter price and category and search
      if (
        state.filters.ownerName === "all" &&
        state.filters.catName !== "all" &&
        state.filters.text &&
        state.filters.price !== state.filters.max_price
      ) {
        if (isFinite(state.filters.price)) {
          const filterPriceAndCategoryAndSearch = async () => {
            const response = await fetch(
              `http://api.localhost/products/matching?name=m${
                state.filters.text
              }&catName=m${state.filters.catName}&price=r${0}-${
                state.filters.price
              }`
            );
            return await response.json();
          };
          filterPriceAndCategoryAndSearch().then((result) => {
            console.log(result);
            dispatch({
              type: FILTER_PRODUCTS,
              priceAndSearchAndCat: { result },
            });
          });
        }
        dispatch({ type: FILTER_PRODUCTS });
      }
      // Filter price and vendor and category and search
      if (
        state.filters.ownerName !== "all" &&
        state.filters.catName !== "all" &&
        state.filters.text &&
        state.filters.price !== state.filters.max_price
      ) {
        if (isFinite(state.filters.price)) {
          const filterPriceAndCategoryAndSearchAndVendor = async () => {
            const response = await fetch(
              `http://api.localhost/products/matching?name=m${
                state.filters.text
              }&catName=m${state.filters.catName}&price=r${0}-${
                state.filters.price
              }&ownerName=m${state.filters.ownerName}`
            );
            return await response.json();
          };
          filterPriceAndCategoryAndSearchAndVendor().then((result) => {
            console.log(result);
            dispatch({
              type: FILTER_PRODUCTS,
              priceAndSearchAndCatAndOwner: { result },
            });
          });
        }
        dispatch({ type: FILTER_PRODUCTS });
      }
    }
  }, [products, state.filters, state.filter]);

  const updateSort = (e) => {
    const value = e.target.value;
    dispatch({ type: UPDATE_SORT, payload: value });
  };

  const updateFilters = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    if (name === "catName") {
      value = e.target.textContent;
    }
    if (name === "color") {
      value = e.target.dataset.color;
    }
    if (name === "price") {
      value = Number(value);
    }
    console.log(name, value);
    dispatch({ type: UPDATE_FILTERS, payload: { name, value } });
  };

  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS });
  };

  const startFilters = () => {
    dispatch({ type: "FILTER" });
  };

  return (
    <FilterContext.Provider
      value={{
        ...state,
        setGridView,
        setListView,
        updateSort,
        updateFilters,
        clearFilters,
        startFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
// make sure use
export const useFilterContext = () => {
  return useContext(FilterContext);
};
