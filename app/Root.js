import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Signup from './scenes/Signup/Signup';
import Login from './scenes/Login/Login';
import Home from './scenes/Home/Home';

import {connect as connectToNode} from './services/blockchain/connection/connectionActions';
import {requestPcIds} from './services/blockchain/auth/authActions';

class Root extends Component {

  componentWillMount() {
      this.props.connectionActions.connectToNode(this.props.settings.activeNode);
      this.props.authActions.requestPcIds();
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/signup" render={(props) => <Signup {...props} />}/>
          <Route path="/login" render={(props) => <Login {...props} />}/>
          <Route path="/" render={(props) => <Home {...props} />}/>
        </Switch>
      </Router>
    );
  }
}

export default connect(
    (state) => {
        return {...state.default}
    },
    (dispatch) => ({
        connectionActions: bindActionCreators({ connectToNode }, dispatch),
        authActions: bindActionCreators({ requestPcIds }, dispatch)
    }),
)(Root);
