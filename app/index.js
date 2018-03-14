import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import { reducer as formReducer } from 'redux-form';
import { reducer as toastrReducer } from 'react-redux-toastr';
import { AppContainer } from 'react-hot-loader';
import { IntlProvider, addLocaleData } from 'react-intl';
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
    sendMailSubscriber,
    subscribeForMailSubscriber,
    mailReceivedSubscriber,
    confirmationRecievedSubscriber,
    loadFolderSubscriber,
    deleteMailSubscriber,
    mailSetReadSubscriber
} from './services/saga';

addLocaleData([...en, ...es, ...fr, ...it, ...ru]);

const language = (navigator.languages && navigator.languages[0]) ||
  navigator.language ||
  navigator.userLanguage;

const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];

const messages = localeData[languageWithoutRegionCode] || localeData[language] || localeData.en;

const reducer = combineReducers({
  ...reducers,
  form: formReducer,
  toastr: toastrReducer
});
const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

if (process.env.NODE_ENV !== 'production') {
  const logger = createLogger();
  // middleware.push(logger);
}

const store = createStore(
  reducer,
  applyMiddleware(...middleware)
);

sagaMiddleware.run(connectionSubscriber);
sagaMiddleware.run(authSubscriber);
sagaMiddleware.run(sendMailSubscriber);
sagaMiddleware.run(subscribeForMailSubscriber);
sagaMiddleware.run(mailReceivedSubscriber);
sagaMiddleware.run(confirmationRecievedSubscriber);
sagaMiddleware.run(loadFolderSubscriber);
sagaMiddleware.run(deleteMailSubscriber);
sagaMiddleware.run(mailSetReadSubscriber);

localStorage.clear(); // Temporarily for login functionality TODO: remove this

ReactDOM.render(
  (
    <AppContainer>
      <IntlProvider locale={language} messages={messages}>
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
          <IntlProvider locale={language} messages={messages}>
            <NextApp store={store} />
          </IntlProvider>
        </AppContainer>
      ), document.getElementById('root')
    );
  });
}

