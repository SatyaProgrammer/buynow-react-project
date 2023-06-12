export const ACTION_TYPES = {
  FETCH_START: "FETCH_START",
  FETCH_SUCCESS: "FETCH_SUCCESS",
  SHOW_ROW: "SHOW_ROW",
  SET_ORDERS: "SET_ORDERS",
};

export const INITIAL_STATE = {
  loading: false,
  show_row: false,
  error: false,
  post: [],
};

export const orderReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.FETCH_START:
      return {
        loading: true,
        post: [],
      };
    case ACTION_TYPES.FETCH_SUCCESS:
      return {
        loading: false,
        post: action.payload,
        show_row: false,
      };
    case ACTION_TYPES.SHOW_ROW:
      return {
        ...state,
        show_row: !state.show_row,
      };
    case ACTION_TYPES.SET_ORDERS:
      return {
        ...state,
        post: action.payload,
      };
    default:
      return state;
  }
};
