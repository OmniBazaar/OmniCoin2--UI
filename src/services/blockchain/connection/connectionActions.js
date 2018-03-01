import { createActions } from 'redux-actions';
import { createConnection } from './connection';
const {
    connect,
} = createActions({
    CONNECT: (node) => ({node})
});

export {
    connect
}