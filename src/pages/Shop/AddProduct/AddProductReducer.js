export const ACTION_TYPES = {
    SET_NAME: 'SET_NAME',
    SET_NAME_FOCUS: 'SET_NAME_FOCUS',
    SET_DESCRIPTION: 'SET_DESCRIPTION',
    SET_DESCRIPTION_FOCUS: 'SET_DESCRIPTION_FOCUS',
    SET_BRAND: 'SET_BRAND',
    SET_PRICE: 'SET_PRICE',
    ADD_CUSTOMIZATION: 'ADD_CUSTOMIZATION',
    SET_CUSTOMIZATION: 'SET_CUSTOMIZATION',
}

export const INITIAL_STATE = {
    name: '',
    nameFocus: false,

    description: '',
    descriptionFocus: false,

    brand: '',
    
    price: '',

    constomization: ([]),

    errMessage: '',
    sucess: false,
}

export const addProductReducer = (state, action) => {
    switch (action.type) {
        case ACTION_TYPES.SET_NAME:
            return {
                ...state,
                name: action.payload
            }
        case ACTION_TYPES.SET_NAME_FOCUS:
            return {
                nameFocus: !state.nameFocus
            }
        case ACTION_TYPES.SET_DESCRIPTION:
            return {
                ...state,
                description: action.payload
            }
        case ACTION_TYPES.SET_DESCRIPTION_FOCUS:
            return {
                descriptionFocus: !state.descriptionFocus
            }
        case ACTION_TYPES.SET_BRAND:
            return {
                ...state,
                brand: action.payload
            }
        case ACTION_TYPES.SET_PRICE:
            return {
                ...state,
                price: action.payload
            }
        case ACTION_TYPES.ADD_CUSTOMIZATION:
            return {
                ...state,
                customization: [...state.customization || [], action.payload]
            }
        case ACTION_TYPES.SET_CUSTOMIZATION:
            return {
                ...state,
                customElements: action.payload
            }

        default:
            return state;
    }
}