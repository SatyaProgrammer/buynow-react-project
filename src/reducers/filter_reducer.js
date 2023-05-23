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

    if (text) {
      try {
        const response = axios.get(
          `http://api.localhost/products/matching?name=m${text}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = response.data;
        tempProducts = data;
        console.log(tempProducts);
        return { ...state, filtered_products: tempProducts };
      } catch (error) {
        console.log(error.response);
      }
    }

    return { ...state, filtered_products: tempProducts };
  }

  // if (action.type === FILTER_PRODUCTS) {
  //   const { all_products } = state;
  //   const { text, catName, ownerName, color, price, shipping } = state.filters;
  //   let tempProducts = [...all_products];
  //   // Filtering
  //   // Text

  //   if (text) {
  //     try {
  //       const response = axios.get(
  //         `http://api.localhost/products/matching?name=m${text}`,
  //         {
  //           headers: { "Content-Type": "application/json" },
  //         }
  //       );
  //       const data = response.data;
  //       tempProducts = data;
  //       console.log(tempProducts);
  //       return { ...state, filtered_products: tempProducts };
  //     } catch (error) {
  //       console.log(error.response);
  //     }
  //   }
  //   // Category
  //   if (catName !== "all") {
  //     tempProducts = tempProducts.filter(
  //       (product) => product.catName === catName
  //     );
  //     console.log(tempProducts);
  //   }
  //   // Company
  //   if (ownerName !== "all") {
  //     tempProducts = tempProducts.filter(
  //       (product) => product.ownerName === ownerName
  //     );
  //   }
  //   // Colors
  //   if (color !== "all") {
  //     tempProducts = tempProducts.filter((product) => {
  //       return product.customization.color.find((c) => c === color);
  //     });
  //   }
  //   // Price
  //   // tempProducts = tempProducts.filter((product) => product.price <= price);
  //   // console.log(tempProducts);
  //   // Shipping
  //   // if (shipping) {
  //   //   tempProducts = tempProducts.filter(
  //   //     (product) => product.shipping === true
  //   //   );
  //   // }
  //   return { ...state, filtered_products: tempProducts };
  // }

  if (action.type === UPDATE_FILTERS) {
    const { name, value } = action.payload;
    return { ...state, filters: { ...state.filters, [name]: value } };
  }

  if (action.type === "SEARCH_PRODUCTS") {
    const { all_products } = state;
    let tempProducts = [...all_products];
    if (action.payload) {
      console.log(action.payload.result.length);
      let data = action.payload;
      tempProducts = data.result;
    }
    return { ...state, filtered_products: tempProducts };
  }

  if (action.type === "FILTER_BY_CATEGORY") {
    const { all_products } = state;
    let tempProducts = [...all_products];
    if (action.payload) {
      console.log(action.payload.result.length);
      let data = action.payload;
      tempProducts = data.result;
    }
    return { ...state, filtered_products: tempProducts };
  }

  if (action.type === "FILTER_VENDOR") {
    const { all_products } = state;
    let tempProducts = [...all_products];
    if (action.payload) {
      console.log(action.payload.result.length);
      let data = action.payload;
      tempProducts = data.result;
    }
    return { ...state, filtered_products: tempProducts };
  }

  if (action.type === "FILTER_PRICE") {
    const { all_products } = state;
    let tempProducts = [...all_products];
    console.log(state.filters.price);
    return { ...state, filtered_products: tempProducts };
  }

  if (action.type === CLEAR_FILTERS) {
    return {
      ...state,
      filters: {
        ...state.filters,
        text: "",
        ownerName: "all",
        catName: "all",
        color: "all",
        price: state.filters.max_price,
        shipping: false,
      },
    };
  }
};

export default filter_reducer;
