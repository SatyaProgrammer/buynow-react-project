const history_reducer = (state, action) => {
  if (action.type === "TRACKINGS") {
    return { ...state, trackings: action.payload.data };
  }
};

export default history_reducer;
