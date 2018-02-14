/**
 * Created by denissamohvalov on 14.02.18.
 */
import { createActions } from 'redux-actions';


const { login } = createActions({
    LOGIN: (username, password) => ({ username, password }),
});

export {
    login
}