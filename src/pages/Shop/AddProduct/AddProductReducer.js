export const ACTION_TYPES = {
  SET_NAME: "SET_NAME",
  SET_NAME_FOCUS: "SET_NAME_FOCUS",
  SET_DESCRIPTION: "SET_DESCRIPTION",
  SET_DESCRIPTION_FOCUS: "SET_DESCRIPTION_FOCUS",
  SET_CATEGORY: "SET_CATEGORY",
  SET_PRICE: "SET_PRICE",
  ADD_CUSTOMIZATION: "ADD_CUSTOMIZATION",
  SET_CUSTOMIZATION: "SET_CUSTOMIZATION",
  RESET_CUSTOMIZATION: "RESET_CUSTOMIZATION",
  SET_AVAILABILITY: "SET_AVAILABILITY",
  SET_DELIVERYOPTION: "SET_DELIVERYOPTION",
  ADD_IMAGE: "ADD_IMAGE",
  SET_IMAGE: "SET_IMAGE",
  SET_IMAGE_URL: "SET_IMAGE_URL",
  SET_ERROR: "SET_ERROR",
  SET_SUCCESS: "SET_SUCCESS",
  SET_DURING_SUBMIT: "SET_DURING_SUBMIT",
  SET_GET_CATEGORY: "SET_GET_CATEGORY",
  SET_CATEGORY_DROPDOWN: "SET_CATEGORY_DROPDOWN",
};

export const INITIAL_STATE = {
  duringSubmit: false,
  getCategory: [],

  name: "",
  nameFocus: false,

  description: "",
  descriptionFocus: false,

  category: "",
  categoryDropdown: false,

  price: "",

  customization: { color: [""], size: [""] },

  cholder: ["red", "small"],

  availability: 0,

  deliveryOption: "",

  image: [],
  imageUrl: {images: []},

  errMessage: "",
  sucess: "",
};

export const addProductReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_NAME:
      return {
        ...state,
        name: action.payload,
      };
    case ACTION_TYPES.SET_NAME_FOCUS:
      return {
        nameFocus: !state.nameFocus,
      };
    case ACTION_TYPES.SET_DESCRIPTION:
      return {
        ...state,
        description: action.payload,
      };
    case ACTION_TYPES.SET_DESCRIPTION_FOCUS:
      return {
        descriptionFocus: !state.descriptionFocus,
      };
    case ACTION_TYPES.SET_CATEGORY:
      return {
        ...state,
        category: action.payload,
      };
    case ACTION_TYPES.SET_PRICE:
      return {
        ...state,
        price: action.payload,
      };
    case ACTION_TYPES.ADD_CUSTOMIZATION:
      return {
        ...state,
        customization: [...(state.customization || []), action.payload],
      };
    case ACTION_TYPES.SET_CUSTOMIZATION:
      return {
        ...state,
        customElements: action.payload,
      };
    case ACTION_TYPES.RESET_CUSTOMIZATION:
      return {
        ...state,
        customization: { color: [""], size: [""] },
      };
    case ACTION_TYPES.SET_AVAILABILITY:
      return {
        ...state,
        availability: action.payload,
      };
    case ACTION_TYPES.SET_DELIVERYOPTION:
      return {
        ...state,
        deliveryOption: action.payload,
      };
    case ACTION_TYPES.ADD_IMAGE:
      return {
        ...state,
        image: [...(state.image || []), action.payload],
      };
    case ACTION_TYPES.SET_IMAGE:
      return {
        ...state,
        image: action.payload,
      };
    case ACTION_TYPES.SET_IMAGE_URL:
      return {
        ...state,
        imageUrl: action.payload,
      };
    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        errMessage: action.payload,
      };
    case ACTION_TYPES.SET_SUCCESS:
      return {
        ...state,
        success: action.payload,
      };
    case ACTION_TYPES.SET_DURING_SUBMIT:
      return {
        ...state,
        duringSubmit: action.payload,
      };
    case ACTION_TYPES.SET_GET_CATEGORY:
      return {
        ...state,
        getCategory: action.payload,
      };
    case ACTION_TYPES.SET_CATEGORY_DROPDOWN:
      return {
        ...state,
        categoryDropdown: !state.categoryDropdown,
      };

    default:
      return state;
  }
};
