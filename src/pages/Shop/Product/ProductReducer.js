export const ACTION_TYPES = {
    FETCH_START: "FETCH_START",
    FETCH_SUCCESS: "FETCH_SUCCESS"
}

export const INITIAL_STATE = {
    loading: false,
    post: ([])
}

export const productReducer = (state, action) => {
    switch (action.type) {
        case ACTION_TYPES.FETCH_START:
            return {
                loading: true,
                post: ([])
            }
        case ACTION_TYPES.FETCH_SUCCESS:
            return {
                loading: false, 
                post: action.payload
            }
        default:
            return state;
    }
}