import { createActions } from 'redux-actions';

const {
  setActiveNode,
} = createActions({
  SET_ACTIVE_NODE: (node) => ({ node }),
});

export { setActiveNode };
