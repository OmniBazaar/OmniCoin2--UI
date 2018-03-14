import { handleActions } from 'redux-actions';
import { connect } from './connectionActions';

const defaultState = {
  apiInstance: null,
  node: null,
  isLoading: false,
  error: null,
};

const reducer = handleActions({
  [connect](state, { payload: { node } }) {
    return {
      ...state,
      isLoading: true,
      node
    };
  },
  CONNECT_SUCCEEDED: (state, action) => ({
    ...state,
    apiInstance: action.apiInstance,
    isLoading: false,
    error: null,
  }),
  CONNECT_FAILED: (state, action) => ({
    ...state,
    apiInstance: null,
    node: null,
    isLoading: false,
    error: action.error
  })
}, defaultState);

export default reducer;
