const detail_reducer = (state, action) => {
  if (action.type === "TRACKING") {
    return { ...state, data: action.payload.data };
  }
};
export default detail_reducer;
