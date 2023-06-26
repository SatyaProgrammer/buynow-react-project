import axios from "axios";
import {
  LOAD_PRODUCTS,
  SET_LISTVIEW,
  SET_GRIDVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from "../actions";

const filter_reducer = (state, action) => {
  if (action.type === LOAD_PRODUCTS) {
    let maxPrice = action.payload.map((p) => p.price);
    maxPrice = Math.max(...maxPrice);

    return {
      ...state,
      all_products: [...action.payload],
      filtered_products: [...action.payload],
      filters: { ...state.filters, max_price: maxPrice, price: maxPrice },
    };
  }

  if (action.type === SET_GRIDVIEW) {
    return { ...state, grid_view: true };
  }

  if (action.type === SET_LISTVIEW) {
    return { ...state, grid_view: false };
  }

  if (action.type === SORT_PRODUCTS) {
    const { sort, filtered_products } = state;
    let tempProducts = [...filtered_products];
    if (sort === "price-lowest") {
      tempProducts = tempProducts.sort((a, b) => a.price - b.price);
    }
    if (sort === "price-highest") {
      tempProducts = tempProducts.sort((a, b) => b.price - a.price);
    }
    if (sort === "name-a") {
      tempProducts = tempProducts.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    }
    if (sort === "name-z") {
      tempProducts = tempProducts.sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
    }
    return { ...state, filtered_products: tempProducts };
  }

  if (action.type === UPDATE_SORT) {
    return { ...state, sort: action.payload };
  }

  if (action.type === FILTER_PRODUCTS) {
    const { all_products } = state;
    const { text, catName, ownerName, color, price, shipping } = state.filters;
    let tempProducts = [...all_products];
    // Filtering
    // Text
    if (action.text) {
      // tempProducts = action.text.result;
      // ;
      tempProducts = action.text.result;
    }
    if (action.category) {
      // ;
      tempProducts = action.category.result;
    }
    if (action.textAndCategory) {
      // ;
      tempProducts = action.textAndCategory.result;
    }
    if (action.ownerName) {
      tempProducts = action.ownerName.result;
    }
    if (action.ownerNameAndCategory) {
      tempProducts = action.ownerNameAndCategory.result;
    }
    if (action.ownerNameAndSearch) {
      tempProducts = action.ownerNameAndSearch.result;
    }
    if (action.ownerNameAndSearchAndCategory) {
      tempProducts = action.ownerNameAndSearchAndCategory.result;
    }
    if (action.price) {
      tempProducts = action.price.result;
    }
    if (action.priceAndVendor) {
      tempProducts = action.priceAndVendor.result;
    }
    if (action.priceAndCategory) {
      tempProducts = action.priceAndCategory.result;
    }
    if (action.priceAndText) {
      tempProducts = action.priceAndText.result;
    }
    if (action.priceAndCatAndOwner) {
      tempProducts = action.priceAndCatAndOwner.result;
    }
    if (action.priceAndSearchAndOwner) {
      tempProducts = action.priceAndSearchAndOwner.result;
    }
    if (action.priceAndSearchAndCat) {
      tempProducts = action.priceAndSearchAndCat.result;
    }
    if (action.priceAndSearchAndCatAndOwner) {
      tempProducts = action.priceAndSearchAndCatAndOwner.result;
    }
    return { ...state, filter: false, filtered_products: tempProducts };
  }

  if (action.type === UPDATE_FILTERS) {
    const { name, value } = action.payload;
    if (name === "text") {
      return {
        ...state,
        filter: true,
        filters: { ...state.filters, [name]: value },
      };
    }
    return { ...state, filters: { ...state.filters, [name]: value } };
  }

  if (action.type === CLEAR_FILTERS) {
    return {
      ...state,
      filtered_products: state.all_products,
      filters: {
        ...state.filters,
        text: "",
        ownerName: "all",
        catName: "all",
        price: state.filters.max_price,
        shipping: false,
      },
    };
  }

  if (action.type === "FILTER") {
    return {
      ...state,
      filter: true,
    };
  }
};
export default filter_reducer;
