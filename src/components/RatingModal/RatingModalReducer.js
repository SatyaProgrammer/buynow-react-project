export const ACTION_TYPES = {
    SET_RATING: "SET_RATING"
};

export const INITIAL_STATE = {
  rating: [false, false, false, false, false],
};

export const ratingModalReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.FETCH_START:
      return {
        rating: action.payload
      };

    default:
      return state;
  }
};
