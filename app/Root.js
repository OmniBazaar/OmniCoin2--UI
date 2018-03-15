import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Signup from './scenes/Signup/Signup';
import Login from './scenes/Login/Login';
import Home from './scenes/Home/Home';

import { connect as connectToNode, getDynGlobalObject } from './services/blockchain/connection/connectionActions';
import { requestPcIds } from './services/blockchain/auth/authActions';
import { getCurrentUser } from './services/blockchain/auth/authActions';


class Root extends Component {
  componentWillMount() {
    this.props.connectionActions.connectToNode(this.props.settings.activeNode);
    this.props.authActions.requestPcIds();
    this.props.authActions.getCurrentUser();
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

export default connect(
  (state) => ({ ...state.default }),
  (dispatch) => ({
    connectionActions: bindActionCreators({ connectToNode, getDynGlobalObject }, dispatch),
    authActions: bindActionCreators({ requestPcIds, getCurrentUser }, dispatch)
  }),
)(Root);
