import { createActions } from 'redux-actions';
const {
    connect,
} = createActions({
    CONNECT: (node) => ({node})
});

export {
    connect
}