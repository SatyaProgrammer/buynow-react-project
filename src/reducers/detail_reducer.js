const detail_reducer = (state, action) => {
  if (action.type === "TRACKING") {
    console.log(action.payload.data);
  }
};
export default detail_reducer;
