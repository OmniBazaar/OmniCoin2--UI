import React from 'react';
import ReactDOM, {render} from 'react-dom';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import createSagaMiddleware from 'redux-saga'
import {reducer as formReducer} from 'redux-form';

import {Provider} from 'react-redux';

import 'bootstrap/dist/css/bootstrap.min.css';

import registerServiceWorker from './registerServiceWorker';
import './index.scss';
import App from './App';
import * as reducers from './services/reducer';
import * as sagas from './services/saga';


const reducer = combineReducers({
    ...reducers,
    form: formReducer,
});
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
    reducer,
    applyMiddleware(sagaMiddleware)
);

// sagaMiddleware.run(sagas);

ReactDOM.render((
    <Provider store={store}>
        <App />
    </Provider>
), document.getElementById('root'));

registerServiceWorker();
