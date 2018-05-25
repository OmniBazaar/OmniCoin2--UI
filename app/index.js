import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import { reducer as formReducer } from 'redux-form';
import { reducer as toastrReducer } from 'react-redux-toastr';
import { AppContainer } from 'react-hot-loader';
import { IntlProvider, addLocaleData } from 'react-intl';
import { ChainConfig } from 'omnibazaarjs-ws';
import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';
import fr from 'react-intl/locale-data/fr';
import it from 'react-intl/locale-data/it';
import ru from 'react-intl/locale-data/ru';

import localeData from './../app/dist/i18n/data.json';

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
  transferSubscriber,
  wsMarketplaceSaga,
  dhtSubscriber,
  listingSubscriber
} from './services/saga';

ChainConfig.address_prefix = 'BTS';

addLocaleData([...en, ...es, ...fr, ...it]);

const language = 'en';// (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage;

const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];

const messages = localeData[languageWithoutRegionCode] || localeData[language] || localeData.en;

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
  applyMiddleware(...middleware)
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
sagaMiddleware.run(wsMarketplaceSaga);
sagaMiddleware.run(dhtSubscriber);
sagaMiddleware.run(listingSubscriber);

ReactDOM.render(
  (
    <AppContainer>
      <IntlProvider
        locale={language}
        messages={messages}
      >
        <App store={store} />
      </IntlProvider>
    </AppContainer>
  ), document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App');
    render(
      (
        <AppContainer>
          <IntlProvider
            locale={language}
            messages={messages}
          >
            <NextApp store={store} />
          </IntlProvider>
        </AppContainer>
      ), document.getElementById('root')
    );
  });
}
