import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';

import Signup from './scenes/Signup/Signup';
import Login from './scenes/Login/Login';
import StartGuide from './scenes/Home/components/StartGuide/StartGuide';
import Home from './scenes/Home/Home';

import { connect as connectToNode, getDynGlobalObject } from './services/blockchain/connection/connectionActions';
import {
  getCurrentUser,
  getLastLoginUserName,
  requestPcIds,
  requestReferrer
} from './services/blockchain/auth/authActions';
import { dhtConnect } from './services/search/dht/dhtActions';
import { loadListingDefault } from './services/listing/listingDefaultsActions';
import { loadPreferences } from './services/preferences/preferencesActions';
import localeData from './../app/dist/i18n/data.json';

class Root extends Component {
  componentWillMount() {
    this.props.connectionActions.connectToNode(this.props.settings.activeNode);
    this.props.authActions.requestPcIds();
    this.props.authActions.requestReferrer();
    this.props.authActions.getLastLoginUserName();
    this.props.dhtActions.dhtConnect();
    this.props.listingDefaultsActions.loadListingDefault();
    this.props.preferencesActions.loadPreferences();
    //this.props.authActions.getCurrentUser();
  }

  componentDidMount() {
    this.syncInterval = setInterval(this.props.connectionActions.getDynGlobalObject, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.syncInterval);
  }

  getLocaleMessages(language) {
    const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];
    return localeData[languageWithoutRegionCode] || localeData[language] || localeData.en;
  }

  render() {
    const { language } = this.props.preferences.preferences;
    const messages = this.getLocaleMessages(language);
    return (
      <IntlProvider locale={language} messages={messages} key={language}>
        <Router>
          <Switch>
            <Route path="/signup" render={(props) => <Signup {...props} />} />
            <Route path="/login" render={(props) => <Login {...props} />} />
            <Route path="/" render={(props) => <Home {...props} />} />
          </Switch>
        </Router>
      </IntlProvider>
    );
  }
}

Root.propTypes = {
  connectionActions: PropTypes.shape({
    connectToNode: PropTypes.func,
    getDynGlobalObject: PropTypes.func
  }).isRequired,
  authActions: PropTypes.shape({
    requestPcIds: PropTypes.func,
    getLastLoginUserName: PropTypes.func,
    getCurrentUser: PropTypes.func
  }).isRequired,
  dhtActions: PropTypes.shape({
    dhtConnect: PropTypes.func
  }).isRequired,
  settings: PropTypes.shape({
    activeNode: PropTypes.object
  }).isRequired,
  listingDefaultsActions: PropTypes.shape({
    loadListingDefault: PropTypes.func
  }).isRequired,
  preferencesActions: PropTypes.shape({
    loadPreferences: PropTypes.func
  }).isRequired,
  preferences: PropTypes.shape({
    preferences: PropTypes.shape({
      language: PropTypes.string
    })
  }).isRequired
};

export default connect(
  (state) => ({
    settings: state.default.settings,
    preferences: state.default.preferences
  }),
  (dispatch) => ({
    connectionActions: bindActionCreators({
      connectToNode, getDynGlobalObject
    }, dispatch),
    authActions: bindActionCreators({
      requestPcIds, getCurrentUser, getLastLoginUserName, requestReferrer
    }, dispatch),
    dhtActions: bindActionCreators({
      dhtConnect,
    }, dispatch),
    listingDefaultsActions: bindActionCreators({
      loadListingDefault
    }, dispatch),
    preferencesActions: bindActionCreators({
      loadPreferences
    }, dispatch)
  })
)(Root);
