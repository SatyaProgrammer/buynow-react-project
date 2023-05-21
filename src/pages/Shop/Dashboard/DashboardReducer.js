export const ACTION_TYPES = {
  SET_CUSTOMER_DATA: "SET_CUSTOMER_DATA",
};

export const INITIAL_STATE = {
  loading: false,
  error: false,
  customer_data: ([])
};

export const dashboardReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_CUSTOMER_DATA:
      return {
        ...state,
        customer_data: action.payload,
      };

    default:
      return state;
  }
};
