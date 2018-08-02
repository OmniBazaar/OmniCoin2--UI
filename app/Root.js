import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';

import Signup from './scenes/Signup/Signup';
import Login from './scenes/Login/Login';
import Home from './scenes/Home/Home';
import AirDrop from './scenes/AirDrop/AirDrop';
import IdentityVerificationForm from './scenes/AirDrop/components/AirDropForm/IdentityVerificationForm';

import { connect as connectToNode, getDynGlobalObject } from './services/blockchain/connection/connectionActions';
import {
  getCurrentUser,
  getLastLoginUserName,
  requestPcIds,
  requestReferrer
} from './services/blockchain/auth/authActions';
import { loadListingDefault } from './services/listing/listingDefaultsActions';
import { loadLocalPreferences } from './services/preferences/preferencesActions';
import { getConfig } from './services/config/configActions';
import { checkUpdate } from './services/updateNotification/updateNotificationActions';
import localeData from './../app/dist/i18n/data.json';

class Root extends Component {
  componentWillMount() {
    this.props.configActions.getConfig();
    this.props.authActions.requestPcIds();
    this.props.authActions.requestReferrer();
    this.props.authActions.getLastLoginUserName();
    this.props.listingDefaultsActions.loadListingDefault();
    this.props.preferencesActions.loadLocalPreferences();
    this.props.updateNotificationActions.checkUpdate();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.config.loading && !nextProps.config.loading) {
      const { nodes } = nextProps.config;
      this.props.connectionActions.connectToNode(nodes);
    }
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
            <Route path="/air-drop" render={props => <AirDrop {...props} />} />
            <Route path="/identity-verification" render={(props) => <IdentityVerificationForm {...props} />} />       
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
  settings: PropTypes.shape({
    activeNode: PropTypes.object
  }).isRequired,
  listingDefaultsActions: PropTypes.shape({
    loadListingDefault: PropTypes.func
  }).isRequired,
  preferencesActions: PropTypes.shape({
    loadLocalPreferences: PropTypes.func
  }).isRequired,
  preferences: PropTypes.shape({
    preferences: PropTypes.shape({
      language: PropTypes.string
    })
  }).isRequired
};

export default connect(
  (state) => ({ ...state.default }),
  (dispatch) => ({
    connectionActions: bindActionCreators({
      connectToNode, getDynGlobalObject
    }, dispatch),
    authActions: bindActionCreators({
      requestPcIds, getCurrentUser, getLastLoginUserName, requestReferrer
    }, dispatch),
    listingDefaultsActions: bindActionCreators({
      loadListingDefault
    }, dispatch),
    preferencesActions: bindActionCreators({
      loadLocalPreferences
    }, dispatch),
    configActions: bindActionCreators({
      getConfig
    }, dispatch),
    updateNotificationActions: bindActionCreators({
      checkUpdate
    }, dispatch)
  })
)(Root);
