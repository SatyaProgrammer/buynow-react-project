export const ACTION_TYPES = {
  SET_USERNAME: "SET_USERNAME",
  SET_USERNAME_FOCUS: "SET_USERNAME_FOUCS",
  SET_VALID_USERNAME: "SET_VALID_USERNAME",

  SET_EMAIL: "SET_EMAIL",
  SET_EMAIL_FOCUS: "SET_EMAIL_FOCUS",
  SET_VALID_EMAIL: "SET_VALID_EMAIL",

  SET_PASSWORD: "SET_PASSWORD",
  SET_PASSWORD_FOCUS: "SET_PASSWORD_FOCUS",
  SET_VALID_PASSWORD: "SET_VALID_PASSWORD",

  SET_CONFIRM_PASSWORD: "SET_CONFIRM_PASSWORD",
  SET_CONFIRM_PASSWORD_FOCUS: "SET_CONFIRM_PASSWORD_FOCUS",
  SET_VALID_CONFIRM_PASSWORD: "SET_VALID_CONFIRM_PASSWORD",

  SET_ERROR: "SET_ERROR",
  SET_SUCCESS: "SET_SUCCESS",
};

export const INITIAL_STATE = {
  username: "",
  validUsername: false,
  usernameFocus: false,

  email: "",
  validEmail: false,
  emailFocus: false,

  password: "",
  validPassword: false,
  passwordFocus: false,

  confirmPassword: "",
  validConfirmPassword: false,
  confirmPasswordFocus: false,

  errorMsg: "",
  success: "",
};

export const signupReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_USERNAME:
      return {
        ...state,
        username: action.payload,
      };
    case ACTION_TYPES.SET_USERNAME_FOCUS:
      return {
        ...state,
        usernameFocus: action.payload,
      };
    case ACTION_TYPES.SET_VALID_USERNAME:
      return {
        ...state,
        validUsername: action.payload,
      };
    case ACTION_TYPES.SET_EMAIL:
      return {
        ...state,
        email: action.payload,
      };
    case ACTION_TYPES.SET_EMAIL_FOCUS:
      return {
        ...state,
        emailFocus: action.payload,
      };
    case ACTION_TYPES.SET_VALID_EMAIL:
      return {
        ...state,
        validEmail: action.payload,
      };
    case ACTION_TYPES.SET_PASSWORD:
      return {
        ...state,
        password: action.payload,
      };
    case ACTION_TYPES.SET_PASSWORD_FOCUS:
      return {
        ...state,
        passwordFocus: action.payload,
      };
    case ACTION_TYPES.SET_VALID_PASSWORD:
      return {
        ...state,
        validPassword: action.payload,
      };
    case ACTION_TYPES.SET_CONFIRM_PASSWORD:
      return {
        ...state,
        confirmPassword: action.payload,
      };
    case ACTION_TYPES.SET_CONFIRM_PASSWORD_FOCUS:
      return {
        ...state,
        confirmPasswordFocus: action.payload,
      };
    case ACTION_TYPES.SET_VALID_CONFIRM_PASSWORD:
      return {
        ...state,
        validConfirmPassword: action.payload,
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
