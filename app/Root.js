import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import Signup from './scenes/Signup/Signup';
import Login from './scenes/Login/Login';
import Home from './scenes/Home/Home';

import { connect as connectToNode, getDynGlobalObject } from './services/blockchain/connection/connectionActions';
import { getCurrentUser, getLastLoginUserName, requestPcIds } from './services/blockchain/auth/authActions';
import { dhtConnect } from './services/search/dht/dhtActions';

class Root extends Component {
  componentWillMount() {
    this.props.connectionActions.connectToNode(this.props.settings.activeNode);
    this.props.authActions.requestPcIds();
    this.props.authActions.getLastLoginUserName();
    this.props.dhtActions.dhtConnect();
    // this.props.authActions.getCurrentUser();
  }

  componentDidMount() {
    this.syncInterval = setInterval(this.props.connectionActions.getDynGlobalObject, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.syncInterval);
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/signup" render={(props) => <Signup {...props} />} />
          <Route path="/login" render={(props) => <Login {...props} />} />
          <Route path="/" render={(props) => <Home {...props} />} />
        </Switch>
      </Router>
    );
  }
}

Root.propTypes = {
  connectionActions: PropTypes.shape({
    connectToNode: PropTypes.func,
    getDynGlobalObject: PropTypes.func
  }),
  authActions: PropTypes.shape({
    requestPcIds: PropTypes.func,
    getLastLoginUserName: PropTypes.func,
    getCurrentUser: PropTypes.func
  }),
  dhtActions: PropTypes.shape({
    dhtConnect: PropTypes.func
  }),
  settings: PropTypes.shape({
    activeNode: PropTypes.object
  })
};

Root.defaultProps = {
  connectionActions: {},
  authActions: {},
  dhtActions: {},
  settings: {}
};

export default connect(
  (state) => ({ ...state.default }),
  (dispatch) => ({
    connectionActions: bindActionCreators({
      connectToNode, getDynGlobalObject
    }, dispatch),
    authActions: bindActionCreators({
      requestPcIds, getCurrentUser, getLastLoginUserName
    }, dispatch),
    dhtActions: bindActionCreators({
      dhtConnect,
    }, dispatch)
  })
)(Root);
