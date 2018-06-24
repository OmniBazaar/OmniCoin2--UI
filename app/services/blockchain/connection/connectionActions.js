import { createActions } from 'redux-actions';

const {
  connect,
  getDynGlobalObject
} = createActions({
  CONNECT: (nodes) => ({ nodes }),
  GET_DYN_GLOBAL_OBJECT: () => ({})
});

export {
  connect,
  getDynGlobalObject
};
