import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router-dom';

import Background from '../../components/Background/Background';
import LoginForm from './components/LoginForm/LoginForm';
import './login.scss';
import { getAccount } from '../../services/blockchain/auth/authActions';


class Login extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.currentUser) {
      this.props.authActions.getAccount(nextProps.auth.currentUser.username);
    }
  }


  render() {
    if (this.props.auth.currentUser) {
      return (<Redirect
        to={{
          pathname: '/',
        }}
      />);
    }

    return (
      <Background>
        <LoginForm />
      </Background>
    );
  }
}

export default connect(
  (state) => ({ ...state.default }),
  (dispatch) => ({
    authActions: bindActionCreators({ getAccount }, dispatch),
  })
)(Login);

Login.propTypes = {
  authActions: PropTypes.shape({
    getCurrentUser: PropTypes.func,
    getAccount: PropTypes.func
  }),
  auth: PropTypes.shape({
    currentUser: PropTypes.shape({
      username: PropTypes.string
    })
  }),
  history: PropTypes.shape({
    push: PropTypes.func
  })
};

Login.defaultProps = {
  authActions: null,
  history: {},
  auth: {}
};
