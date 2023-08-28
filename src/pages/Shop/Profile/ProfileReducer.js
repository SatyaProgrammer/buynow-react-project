export const ACTION_TYPES = {
  SET_PHONE: "SET_PHONE",
  SET_PHONE_FOCUS: "SET_PHONE_FOUCS",
  SET_VALID_PHONE: "SET_VALID_PHONE",

  USERNAME: "USERNAME",

  FACEBOOK: "FACEBOOK",
  INSTAGRAM: "INSTAGRAM",
  TIKTOK: "TIKTOK",
  TELEGRAM: "TELEGRAM",

  IMAGE: "IMAGE",

  SET_CONTACTINFO: "SET_CONTACTINFO",

  SET_ERROR: "SET_ERROR",
  SET_SUCCESS: "SET_SUCCESS",
};

export const INITIAL_STATE = {
  phone: "",
  validPhone: false,
  phoneFocus: false,

  image: "",
  user: "",

  customization: [
    { facebook: [""], instagram: [""], tiktok: [""], telegram: [""] },
  ],

  errorMsg: "",
  success: "",
};

export const profileReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_PHONE:
      return {
        ...state,
        phone: action.payload,
      };
    case ACTION_TYPES.SET_PHONE_FOCUS:
      return {
        ...state,
        phoneFocus: action.payload,
      };
    case ACTION_TYPES.SET_VALID_PHONE:
      return {
        ...state,
        validPhone: action.payload,
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
    case ACTION_TYPES.FACEBOOK:
      return {
        ...state,
        customization: [
          { ...state.customization[0], facebook: action.payload },
        ],
      };
    case ACTION_TYPES.INSTAGRAM:
      return {
        ...state,
        customization: [
          { ...state.customization[0], instagram: action.payload },
        ],
      };
    case ACTION_TYPES.TIKTOK:
      return {
        ...state,
        customization: [{ ...state.customization[0], tiktok: action.payload }],
      };
    case ACTION_TYPES.TELEGRAM:
      return {
        ...state,
        customization: [
          { ...state.customization[0], telegram: action.payload },
        ],
      };
    case ACTION_TYPES.USERNAME:
      return {
        ...state,
        user: action.payload,
      };
    case ACTION_TYPES.IMAGE:
      return {
        ...state,
        image: action.payload,
      };
    default:
      return state;
  }
};
