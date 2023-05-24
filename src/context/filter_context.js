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

  // useEffect(() => {
  //   // dispatch({ type: FILTER_PRODUCTS });
  //   dispatch({ type: SORT_PRODUCTS });
  // }, [products, state.sort, state.filters]);

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

  useEffect(() => {
    if (state.filters.text) {
      const searchProducts = async () => {
        const response = await fetch(
          `http://api.localhost/products/matching?name=m${state.filters.text}`
        );
        return await response.json();
      };
      searchProducts().then((result) => {
        dispatch({ type: "SEARCH_PRODUCTS", payload: { result } });
      });
    }
    dispatch({ type: "SEARCH_PRODUCTS" });
  }, [products, state.filters.text]);

  useEffect(() => {
    if (state.filters.catName === "all") {
      dispatch({ type: "FILTER_BY_CATEGORY" });
    } else if (state.filters.catName !== "all") {
      const filterCategory = async () => {
        const response = await fetch(
          `http://api.localhost/products/matching?catName=m${state.filters.catName}`
        );
        return await response.json();
      };
      filterCategory().then((result) => {
        dispatch({ type: "FILTER_BY_CATEGORY", payload: { result } });
      });
    }
    dispatch({ type: "FILTER_BY_CATEGORY" });
  }, [products, state.filters.catName]);

  useEffect(() => {
    if (state.filters.ownerName === "all") {
      dispatch({ type: "FILTER_VENDOR" });
    } else if (state.filters.ownerName !== "all") {
      if (state.filters.ownerName) {
        const filterVendor = async () => {
          const response = await fetch(
            `http://api.localhost/products/matching?ownerName=m${state.filters.ownerName}`
          );
          return await response.json();
        };
        filterVendor().then((result) => {
          console.log(result);
          dispatch({ type: "FILTER_VENDOR", payload: { result } });
        });
      }
    }
    dispatch({ type: "FILTER_VENDOR" });
  }, [products, state.filters.ownerName]);

  // useEffect(() => {
  //   if (isFinite(state.filters.price)) {
  //     const filterPrice = async () => {
  //       const response = await fetch(
  //         `http://api.localhost/products/matching?price=r${0}-${
  //           state.filters.price
  //         }`
  //       );
  //       return await response.json();
  //     };

  //     filterPrice().then((result) => {
  //       console.log(result);
  //       dispatch({ type: "FILTER_PRICE", payload: { result } });
  //     });
  //   }
  // }, [products, state.filters.price]);

  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS });
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
