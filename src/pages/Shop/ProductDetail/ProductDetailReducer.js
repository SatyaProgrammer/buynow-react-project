export const ACTION_TYPES = {
  FETCH_START: "FETCH_START",
  FETCH_SUCCESS: "FETCH_SUCCESS",
  SHOW_ROW: "SHOW_ROW",
  SET_SIZE: "SET_SIZE",
  SET_COLOR: "SET_COLOR",
};

export const INITIAL_STATE = {
  loading: false,
  show_row: false,
  size: [],
  color: [],
  error: false,
  post: [],
};

export const productDetailReducer = (state, action) => {
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
    case ACTION_TYPES.SET_SIZE:
      return {
        ...state,
        size: action.payload,
      };
    case ACTION_TYPES.SET_COLOR:
      return {
        ...state,
        color: action.payload,
      };
    default:
      return state;
  }
};
