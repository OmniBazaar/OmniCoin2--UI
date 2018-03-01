import { handleActions } from 'redux-actions';

let defaultState = {
    connected: false,
    apiInstance: null,
    error: null
};

const reducer = handleActions({
    CONNECT_SUCCEEDED: (state, action) => {
        return {
            ...state,
            apiInstance: action.result,
            connected: true,
            error: null
        }
    },
    CONNECT_FAILED: (state, action) => {
        return {
            ...state,
            apiInstance: null,
            connected: false,
            error: action.result
        }
    }
}, defaultState);

export default reducer;
