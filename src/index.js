import React from 'react';
import ReactDOM, {render} from 'react-dom';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import {reducer as formReducer} from 'redux-form';
import 'semantic-ui-css/semantic.min.css';

import {Provider} from 'react-redux';


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
const middleware = [sagaMiddleware];

if (process.env.NODE_ENV !== 'production') {
  const logger = createLogger();
  middleware.push(logger);
}

const store = createStore(
    reducer,
    applyMiddleware(...middleware)
);

// sagaMiddleware.run(sagas);

ReactDOM.render((
    <Provider store={store}>
        <App />
    </Provider>
), document.getElementById('root'));

registerServiceWorker();
