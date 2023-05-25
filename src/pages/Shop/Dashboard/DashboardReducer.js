export const ACTION_TYPES = {
  SET_CUSTOMER_DATA: "SET_CUSTOMER_DATA",
  SET_SUCCESS: "SET_SUCCESS",
};

export const INITIAL_STATE = {
  loading: false,
  error: false,
  customer_data: [],
  post: [],
};

export const dashboardReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_CUSTOMER_DATA:
      return {
        ...state,
        customer_data: action.payload,
      };
     case ACTION_TYPES.SET_SUCCESS:
      return {
        ...state,
        post: action.payload,
      } 

    default:
      return state;
  }
};
