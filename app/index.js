import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import { reducer as formReducer } from 'redux-form';
import { reducer as toastrReducer } from 'react-redux-toastr';
import { AppContainer } from 'react-hot-loader';
import { addLocaleData } from 'react-intl';
import { ChainConfig } from 'omnibazaarjs-ws';
import reduxReset from 'redux-reset';

import './app.global.scss';
import App from './App';
import * as reducers from './services/reducer';
import {
  connectionSubscriber,
  authSubscriber,
  mailSubscriber,
  escrowSubscriber,
  accountSubscriber,
  walletSubscriber,
  processorsSubscriber,
  bitcoinSubscriber,
  ethereumSubscriber,
  transferSubscriber,
  dhtSubscriber,
  searchSubscriber,
  wsMarketplaceSubscriber,
  listingSubscriber,
  listingDefaultsSubscriber,
  preferencesSubscriber,
  importSubscriber,
  myPurchasesSubscriber,
  configSubscriber,
  vestingBalancesSubscriber,
  updateNotificationSubscriber,
  publisherUpdateNotificationSubscriber,
  shippingSubscriber,
  exchangeSubscriber,
  currencySubscriber
} from './services/saga';

ChainConfig.address_prefix = 'XOM';

const newLocale = (locale) => ({
  locale,
  pluralRuleFunction: () => ''
});

// addLocaleData([...en, ...es, ...fr, ...it]);
addLocaleData([
  newLocale('cn'),
  newLocale('kr'),
  newLocale('tl')
]);

const reducer = combineReducers({
  ...reducers,
  form: formReducer,
  toastr: toastrReducer
});
const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

// if (process.env.NODE_ENV !== 'production') {
//   const logger = createLogger();
//   middleware.push(logger);
// }

if (localStorage.getItem('currentUser')) {
  try {
    JSON.parse(localStorage.getItem('currentUser'));
  } catch (e) {
    localStorage.clear();
  }
}

const store = createStore(
  reducer,
  applyMiddleware(...middleware),
  reduxReset()
);

sagaMiddleware.run(connectionSubscriber);
sagaMiddleware.run(authSubscriber);
sagaMiddleware.run(mailSubscriber);
sagaMiddleware.run(escrowSubscriber);
sagaMiddleware.run(accountSubscriber);
sagaMiddleware.run(transferSubscriber);
sagaMiddleware.run(walletSubscriber);
sagaMiddleware.run(processorsSubscriber);
sagaMiddleware.run(bitcoinSubscriber);
sagaMiddleware.run(ethereumSubscriber);
sagaMiddleware.run(searchSubscriber);
sagaMiddleware.run(wsMarketplaceSubscriber);
sagaMiddleware.run(dhtSubscriber);
sagaMiddleware.run(listingSubscriber);
sagaMiddleware.run(listingDefaultsSubscriber);
sagaMiddleware.run(preferencesSubscriber);
sagaMiddleware.run(importSubscriber);
sagaMiddleware.run(myPurchasesSubscriber);
sagaMiddleware.run(configSubscriber);
sagaMiddleware.run(vestingBalancesSubscriber);
sagaMiddleware.run(updateNotificationSubscriber);
sagaMiddleware.run(publisherUpdateNotificationSubscriber);
sagaMiddleware.run(shippingSubscriber);
sagaMiddleware.run(exchangeSubscriber);
sagaMiddleware.run(currencySubscriber);

ReactDOM.render(
  (
    <AppContainer>
      <App store={store} />
    </AppContainer>
  ), document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App');
    render(
      (
        <AppContainer>
          <NextApp store={store} />
        </AppContainer>
      ), document.getElementById('root')
    );
  });
}
