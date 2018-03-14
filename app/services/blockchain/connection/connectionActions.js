import { createActions } from 'redux-actions';

const {
  connect,
  getDynGlobalObject
} = createActions({
  CONNECT: (node) => ({ node }),
  GET_DYN_GLOBAL_OBJECT: () => ({})
});

export {
  connect,
  getDynGlobalObject
};
