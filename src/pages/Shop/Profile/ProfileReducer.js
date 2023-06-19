export const ACTION_TYPES = {
  SET_PHONENUMBER: "SET_PHONENUMBER",
  SET_PHONENUMBER_FOCUS: "SET_PHONENUMBER_FOUCS",
  SET_VALID_PHONENUMBER: "SET_VALID_PHONENUMBER",

  SET_ERROR: "SET_ERROR",
  SET_SUCCESS: "SET_SUCCESS",
};

export const INITIAL_STATE = {
  phoneNumber: "",
  validPhoneNumber: false,
  phoneNumberFocus: false,

  errorMsg: "",
  success: "",
};

export const profileReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_PHONENUMBER:
      return {
        ...state,
        phoneNumber: action.payload,
      };
    case ACTION_TYPES.SET_PHONENUMBER_FOCUS:
      return {
        ...state,
        phoneNumberFocus: action.payload,
      };
    case ACTION_TYPES.SET_VALID_PHONENUMBER:
      return {
        ...state,
        validPhoneNumber: action.payload,
      };
    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        errorMsg: action.payload,
      };
    case ACTION_TYPES.SET_SUCCESS:
      return {
        ...state,
        success: action.payload,
      };
    default:
      return state;
  }
};
