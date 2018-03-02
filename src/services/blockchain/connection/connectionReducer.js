import { handleActions } from 'redux-actions';
import { connect } from './connectionActions';

let defaultState = {
    apiInstance: null,
    isLoading: false,
    error: null,
};

const reducer = handleActions({
    [connect](state, {payload: {node}}) {
        return {
            ...state,
            isLoading: true,
        }
    },
    CONNECT_SUCCEEDED: (state, action) => {
        return {
            ...state,
            apiInstance: action.apiInstance,
            isLoading: false,
            error: null,
        }
    },
    CONNECT_FAILED: (state, action) => {
        return {
            ...state,
            apiInstance: null,
            isLoading: false,
            error: action.error
        }
    }
}, defaultState);

export default reducer;
