import React from 'react';
import ReactDOM, {render} from 'react-dom';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import {reducer as formReducer} from 'redux-form';
import {reducer as toastrReducer} from 'react-redux-toastr'
import ReduxToastr from 'react-redux-toastr'

import {Provider} from 'react-redux';

import './app.global.scss';
import App from './App';
import * as reducers from './services/reducer';
import {
    connectionSubscriber,
    authSubscriber
} from './services/saga';


const reducer = combineReducers({
    ...reducers,
    form: formReducer,
    toastr: toastrReducer
});
const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

if (process.env.NODE_ENV !== 'production') {
  const logger = createLogger();
  middleware.push(logger);
}

const store = createStore(
    reducer,
    applyMiddleware(...middleware)
);

sagaMiddleware.run(connectionSubscriber);
sagaMiddleware.run(authSubscriber);

localStorage.clear(); // Temporarily for login functionality TODO: remove this

ReactDOM.render((
    <Provider store={store}>
        <div>
            <App />
            <ReduxToastr/>
        </div>
    </Provider>
), document.getElementById('root'));


