import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import { Loader } from 'semantic-ui-react';
import { createBrowserHistory } from 'history';

import Signup from './scenes/Signup/Signup';
import Login from './scenes/Login/Login';
import Home from './scenes/Home/Home';
import AirDrop from './scenes/AirDrop/AirDrop';
import UpdateForcer from './components/UpdateForcer/UpdateForcer';
import { connect as connectToNode, getDynGlobalObject } from './services/blockchain/connection/connectionActions';
import { setup } from "./services/accountSettings/accountActions";
import localeData from './../app/dist/i18n/data.json';
import Background from "./components/Background/Background";
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

const history = createBrowserHistory({
  basename: window.location.pathname
});

class Root extends Component {

  componentWillMount() {
    this.props.accountActions.setup();
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

  renderContent() {
    return (
        <div>
          <Router history={history}>
            <ErrorBoundary>
              <Switch>
                <Route path="/signup" render={(props) => <Signup {...props} />} />
                <Route path="/air-drop" render={props => <AirDrop {...props} />} />
                <Route path="/login" render={(props) => <Login {...props} />} />
                <Route path="/" render={(props) => <Home {...props} />} />
              </Switch>
            </ErrorBoundary>
          </Router>
          <UpdateForcer />
        </div>
    );
  }

  renderLoader() {
    return (
      <Background>
        <Loader inline="centered" active />
      </Background>
    );
  }

  render() {

    const { language } = this.props.preferences.preferences;
    const { isLoading } = this.props.connection;
    const messages = this.getLocaleMessages(language);
    return (
      <IntlProvider locale={language} messages={messages} key={language}>
        {isLoading ? this.renderLoader() : this.renderContent()}
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
    accountActions: bindActionCreators({
      setup
    }, dispatch)
  })
)(Root);
